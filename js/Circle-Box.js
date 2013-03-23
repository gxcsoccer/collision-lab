window.requestAnimFrame = this.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback, element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		rect = new Rect(new Vector2d(80, 150), 100, 100, 45),
		circle = new Circle(new Vector2d(220, 160), 30),
		objs = [rect, circle],
		dragObj, dragOffset;

	function getPoint(e) {
		var x, y;

		if (e.layerX != null) {
			x = e.layerX;
			y = e.layerY;
		} else {
			x = e.offsetX;
			y = e.offsetY;
		}

		return {
			x: x,
			y: y
		}
	};

	canvas.addEventListener("mousedown", function(e) {
		var mp = getPoint(e);
		objs.forEach(function(o) {
			if (o.isDraggable(mp)) {
				dragObj = o;
				dragOffset = {
					x: mp.x - o.center.x,
					y: mp.y - o.center.y
				}
				return false;
			}
		})

	}, false);
	canvas.addEventListener("mousemove", function(e) {
		var mp = getPoint(e);
		if (dragObj) {
			dragObj.center.x = mp.x - dragOffset.x;
			dragObj.center.y = mp.y - dragOffset.y;
		}
	}, false);
	canvas.addEventListener("mouseup", function(e) {
		dragObj && (dragObj = null);
	}, false);

	window.addEventListener("keydown", function(e) {
		var keycode = e.which;
		switch (keycode) {
		case 82:
			rect.deg += 5;
			break;
		default:
			break;
		}
	});


	function checkCollision(rect, circle) {
		var r2 = Util.sqr(circle.radius),
			normals = rect.getVectors().map(function(v) {
				return v.leftNormal.unitVector;
			}),
			distMin = 0;

		normals.forEach(function(axis) {
			var maxmin = rect.getMaxMinProjection(axis),
				cpj = circle.center.dotProduct(axis);

			if (cpj < maxmin.min) {
				distMin += Util.sqr(cpj - maxmin.min);
			} else if (cpj > maxmin.max) {
				distMin += Util.sqr(cpj - maxmin.max);
			}
		});

		return distMin <= r2;
	};

	context.font = "20px Calibri";

	function draw(context) {
		context.clearRect(0, 0, 400, 300);

		objs.forEach(function(o) {
			o.draw(context);
		});

		if (checkCollision(rect, circle)) {
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