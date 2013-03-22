var Circle = function(center, radius) {
		this.center = center;
		this.radius = radius;
	};

Circle.prototype = {
	draw: function(context) {
		context.beginPath();
		context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
		context.stroke();
		context.closePath();
	},
	getMaxMinProjection: function(axis) {
		var pj = this.center.dotProduct(axis);

		return {
			max: pj + this.radius,
			min: pj - this.radius
		}
	},
	isDraggable: function(point) {
		return Util.distance(point, this.center) <= this.radius;
	}
};