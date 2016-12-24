function MoverTool(manager) {
    this.manager = manager;
    this.prev_objId = undefined;
    this.objId = undefined;
}

MoverTool.prototype.mouseDown = function(xy, objId) {
    this.prev_objId = undefined;
    if(objId === undefined) return;
    this.obj = this.manager.objs[objId];
    this.manager.deleteObj(objId);
    this.objId = this.manager.addObj(this.obj);
}

MoverTool.prototype.mouseMove = function(xy) {
    if(this.obj === undefined) return;
    this.obj.xy = xy;
}

MoverTool.prototype.mouseUp = function(xy, objId) {
    this.prev_objId = this.objId;
    this.obj = undefined;
}

MoverTool.prototype.keyUp = function(code) {
    if(code == 46) {
        // delete
        if(this.prev_objId) {
            this.manager.deleteObj(this.prev_objId);
        }
    }
}