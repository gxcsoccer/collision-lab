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
	/**
	 * 圆形在某条轴上的最大和最小投影值
	 */
	getMaxMinProjection: function(axis) {
		var pj = this.center.dotProduct(axis);

		return {
			max: pj + this.radius,
			min: pj - this.radius
		}
	},
	/**
	 * 是否包含一个点
	 */
	containPoint: function(point) {
		return Util.distance(point, this.center) <= this.radius;
	}
};