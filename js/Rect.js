var Rect = function(center, width, height, deg, velocity) {
		this.center = center;
		this.width = width;
		this.height = height;
		this.deg = deg || 0;
		this.color = "blue";

		this.velocity = velocity || new Vector2d(0, 0);
	}

Rect.prototype = {
	draw: function(context) {
		var points = this.getPoints(),
			prePoint;

		context.save();
		context.beginPath();
		points.forEach(function(p) {
			if (prePoint) {
				context.lineTo(p.x, p.y);
			} else {
				context.moveTo(p.x, p.y);
			}
			prePoint = p;
		});
		prePoint && context.lineTo(points[0].x, points[0].y);
		context.closePath();
		context.fillStyle = this.color;
		context.fill();
		context.stroke();
		context.restore();
	},
	update: function(timespan) {
		this.center.x += timespan * this.velocity.x;
		this.center.y += timespan * this.velocity.y;
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
	},
	/**
	 * 检测指定的法线是否可以被用作分离轴
	 */
	isSAT: function(normal, point) {
		var points = this.getPoints(),
			len = points.length;

		for(var i = 0; i < len; i++) {
			if(points[i].minus(point).dotProduct(normal) < 0) {
				return false;
			}
		}

		return true;
	}
}