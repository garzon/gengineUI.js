function BasicCircle(xy, r, borderColor) {
    this.xy = xy;
    this.r = r || 3.0;
    this.borderColor = borderColor || [0, 0, 0];
}

BasicCircle.prototype.setFill = function(color) {
    this.color = color;
    return this;
}

BasicCircle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.xy[0], this.xy[1], this.r, 0, 360);
    if(this.color) {
        Util.setFillColor(ctx, this.color);
        ctx.fill();
    } else {
        Util.setStrokeColor(ctx, this.borderColor);
        ctx.stroke();
    }
}

BasicCircle.prototype.hitTest = function(xy) {
    return Util.len(Util.minus(this.xy, xy)) <= this.r;
}