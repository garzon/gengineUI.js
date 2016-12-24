function BasicRect(xy, wh, borderColor) {
    this.xy = xy;
    this.wh = wh || [3.0, 3.0];
    this.borderColor = borderColor || [0, 0, 0];
}

BasicRect.prototype.setFill = function(color) {
    this.color = color;
    return this;
}

BasicRect.prototype.draw = function(ctx) {
    ctx.rect(this.xy[0], this.xy[1], this.wh[0], this.wh[1]);
    if(this.color) {
        Util.setFillColor(ctx, this.color);
        ctx.fill();
    } else {
        Util.setStrokeColor(ctx, this.borderColor);
        ctx.stroke();
    }
}

BasicRect.prototype.hitTest = function(xy) {
    var diff = Util.minus(xy, this.xy);
    return Util.smaller(diff, this.wh) && Util.smaller([0, 0], diff);
}