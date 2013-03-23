var Rect = function(center, width, height, deg) {
		this.center = center;
		this.width = width;
		this.height = height;
		this.deg = deg || 0;
	}

Rect.prototype = {
	draw: function(context) {
		var points = this.getPoints(),
			prePoint;

		context.beginPath();
		points.forEach(function(p) {
			prePoint && context.lineTo(p.x, p.y);
			context.moveTo(p.x, p.y);
			prePoint = p;
		});
		prePoint && context.lineTo(points[0].x, points[0].y);
		context.stroke();
		context.closePath();
	},
	/**
	 * 获取矩形四个顶点的向量
	 */
	getPoints: function() {
		var points = [],
			uv1 = Vector2d.unitVector(this.deg),
			uv2 = Vector2d.unitVector(this.deg + 90),
			uv3 = Vector2d.unitVector(-this.deg),
			uv4 = Vector2d.unitVector(90 - this.deg),
			cx = this.center.dotProduct(uv1),
			cy = this.center.dotProduct(uv2);

		points.push(new Vector2d(cx - this.width / 2, cy - this.height / 2));
		points.push(new Vector2d(cx + this.width / 2, cy - this.height / 2));
		points.push(new Vector2d(cx + this.width / 2, cy + this.height / 2));
		points.push(new Vector2d(cx - this.width / 2, cy + this.height / 2));

		return points.map(function(p) {
			return new Vector2d(p.dotProduct(uv3), p.dotProduct(uv4));
		});
	},
	/**
	 * 获取和矩形4条边分别平行的两个向量
	 */
	getVectors: function() {
		var points = this.getPoints(),
			v1 = new Vector2d(points[1].x - points[0].x, points[1].y - points[0].y),
			v2 = new Vector2d(points[3].x - points[0].x, points[3].y - points[0].y);

		return [v1, v2];
	},
	/**
	 * 获取矩形四个顶点在某条轴上的最大和最小投影值
	 */
	getMaxMinProjection: function(axis) {
		var points = this.getPoints(),
			max, min;

		points.forEach(function(p) {
			var pj = p.dotProduct(axis);
			(min == null || min > pj) && (min = pj);
			(max == null || max < pj) && (max = pj);
		});

		return {
			max: max,
			min: min
		};
	},
	/**
	 * 是否包含一个点
	 */
	containPoint: function(point) {
		var normals = this.getVectors().map(function(v) {
			return v.leftNormal.unitVector;
		}),
			dotV = new Vector2d(point.x, point.y),
			rect = this,
			isContain = true;

		normals.forEach(function(axis) {
			var maxmin = rect.getMaxMinProjection(axis),
				cpj = dotV.dotProduct(axis);

			if (cpj < maxmin.min || cpj > maxmin.max) {
				isContain = false;
				return false;
			}
		});

		return isContain;
	}
}