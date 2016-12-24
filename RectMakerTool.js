function RectMakerTool(manager) {
    this.manager = manager;
}

RectMakerTool.prototype.mouseDown = function(xy, objId) {
    this.obj = new BasicRect(xy);
    this.manager.addObj(this.obj);
}

RectMakerTool.prototype.mouseMove = function(xy) {
    this.obj.wh = Util.minus(xy, this.obj.xy);
}

RectMakerTool.prototype.mouseUp = function(xy, objId) {
    this.obj = undefined;
}