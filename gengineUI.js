Util = {
    _setColor: function(ctx, prop, color) {
        if(color.length == 3) {
            ctx[prop] = "rgb(" + color.join(',') + ")";
            return;
        }
        if(color.length == 4) {
            ctx[prop] = "rgba(" + color.join(',') + ")";
            return;
        }
        console.error(color);
        throw "color vector should be 3D or 4D.";
    },
    setFillColor: function(ctx, color) {
        Util._setColor(ctx, 'fillStyle', color);
    },
    setStrokeColor: function(ctx, color) {
        Util._setColor(ctx, 'strokeStyle', color);
    },
    add: function(v1, v2) {
        var res = [];
        if(v1.length != v2.length) throw "length of vectors not equal.";
        for(var i in v1) {
            res.push(v1[i]+v2[i]);
        }
        return res;
    },
    minus: function(v1, v2) {
        var res = [];
        if(v1.length != v2.length) throw "length of vectors not equal.";
        for(var i in v1) {
            res.push(v1[i]-v2[i]);
        }
        return res;
    },
    len: function(v) {
        return Math.sqrt(v.reduce(function(x,y) { return x+y*y; }, 0));
    },
    smaller: function(v1, v2) {
        if(v1.length != v2.length) throw "length of vectors not equal.";
        return v1.reduce(function(x,y,i) { return x && (y <= v2[i]); }, true);
    }
};

function Manager(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.objs = {};
    this.temp_objs = [];
    this.next_uid = 99999999;

    this.usingTool = undefined;
    this.setupUICallbacks();
    this.redraw = this.callback();
}

Manager.prototype.addObj = function(obj) {
    var uid = this.next_uid--;
    this.objs[uid] = obj;
    return uid;
}

Manager.prototype.deleteObj = function(objId) {
    delete this.objs[objId];
}

Manager.prototype.callback = function() {
    var manager = this;
    return function() {
        manager.ctx.clearRect(0, 0, manager.canvas.width, manager.canvas.height);
        for(var i in manager.objs) {
            manager.objs[i].draw(manager.ctx);
        }
        for(var i in manager.temp_objs) {
            manager.temp_objs[i].draw();
        }
        manager.temp_objs = [];
    };
};

Manager.prototype.setupUICallbacks = function() {
    var manager = this;

    var hitTest = function(mouseXY) {
        var objId = undefined;
        for(var i in manager.objs) {
            if(manager.objs[i].hitTest(mouseXY)) {	
                return i;
            }
        }
        return objId;
    };

    var getMouseXY = function(evt) {
        var boundingBox = manager.canvas.getBoundingClientRect();
        var mouseX = (evt.clientX - boundingBox.left) * (manager.canvas.width / boundingBox.width);
        var mouseY = (evt.clientY - boundingBox.top) * (manager.canvas.height / boundingBox.height);
        /*if(mouseX < 0) mouseX = 0;
        if(mouseY < 0) mouseY = 0;
        if(mouseX > manager.canvas.width) mouseX = manager.canvas.width;
        if(mouseY > manager.canvas.height) mouseY = manager.canvas.height;*/
        return [mouseX, mouseY];
    };

    this.mouseDownListener = function(evt) {
        var mouseXY = getMouseXY(evt);
        var objId = hitTest(mouseXY);

        if(manager.usingTool && manager.usingTool.mouseDown) {
            manager.usingTool.mouseDown(mouseXY, objId);
        }
        
        window.addEventListener("mousemove", manager.mouseMoveListener, false);
        manager.canvas.removeEventListener("mousedown", manager.mouseDownListener, false);
        window.addEventListener("mouseup", manager.mouseUpListener, false);
        
        if (evt.preventDefault) {
            evt.preventDefault();
        } else if (evt.returnValue) {
            evt.returnValue = false;
        }
        return false;
    }

    this.mouseUpListener = function(evt) {
        manager.canvas.addEventListener("mousedown", manager.mouseDownListener, false);
        window.removeEventListener("mouseup", manager.mouseUpListener, false);
        window.removeEventListener("mousemove", manager.mouseMoveListener, false);
        
        if(manager.usingTool && manager.usingTool.mouseUp) {
            var mouseXY = getMouseXY(evt);
            var objId = hitTest(mouseXY);
            manager.usingTool.mouseUp(mouseXY, objId);
        }

        manager.redraw();
    }

    this.mouseMoveListener = function(evt) {
        if(manager.usingTool && manager.usingTool.mouseMove)
            manager.usingTool.mouseMove(getMouseXY(evt));
    }

    this.keyUpListener = function(evt) {
        if(manager.usingTool && manager.usingTool.keyUp)
            manager.usingTool.keyUp(evt.keyCode);
        manager.redraw();
    }

    window.addEventListener("keyup", this.keyUpListener, false);
    this.canvas.addEventListener("mousedown", this.mouseDownListener, false);
};

