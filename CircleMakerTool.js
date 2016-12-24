function CircleMakerTool(manager) {
    this.manager = manager;
}

CircleMakerTool.prototype.mouseDown = function(xy, objId) {
    this.obj = new BasicCircle(xy);
    this.manager.addObj(this.obj);
}

CircleMakerTool.prototype.mouseMove = function(xy) {
    this.obj.r = Util.len(Util.minus(xy, this.obj.xy));
}

CircleMakerTool.prototype.mouseUp = function(xy, objId) {
    this.obj = undefined;
}