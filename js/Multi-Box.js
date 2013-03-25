window.requestAnimFrame = this.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback, element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		rect1 = new Rect(new Vector2d(180, 150), 100, 100, 23, {x:0, y:10}),
		rect2 = new Rect(new Vector2d(250, 70), 50, 50, 78, {x:0, y:10}),
		objs = [rect1, rect2],
		dragObj, dragOffset, start = +(new Date());


	function checkCollision(rect1, rect2) {
		var vectors = rect1.getVectors().concat(rect2.getVectors()),
			normals = vectors.map(function(v) {
				return v.leftNormal.unitVector;
			}),
			isCollision = true;

		normals.forEach(function(n) {
			var maxmin1 = rect1.getMaxMinProjection(n),
				maxmin2 = rect2.getMaxMinProjection(n);

			if(maxmin1.max < maxmin2.min || maxmin2.max < maxmin1.min) {
				isCollision = false;
				return false;
			}
		});

		return isCollision;
	};

	context.font = "20px Calibri";
	context.globalCompositeOperation = "lighter";

	var yunitVector = Vector2d.unitVector(-90);

	function draw(context) {
		var now = +(new Date()),
			timespan = (now - start) / 1000;
		start = now;

		context.clearRect(0, 0, 400, 300);

		objs.forEach(function(o) {
			o.update(timespan);
			o.draw(context);

			var maxmin = o.getMaxMinProjection(yunitVector);
			if(-maxmin.max <= 0 || -maxmin.min >= 300) {
				o.velocity.y = -o.velocity.y;
			}
		});

		if (checkCollision(rect1, rect2)) {
			context.fillText("Collision", 10, 20);
		} else {
			context.fillText("Separated", 10, 20);
		}

		requestAnimFrame(function() {
			draw(context);
		});
	}

	draw(context);
};