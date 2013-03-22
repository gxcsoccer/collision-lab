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
		var vertexs = rect.getPoints(),
			closestDist, closestVertex;

		vertexs.forEach(function(v) {
			var dist = Util.distance(v, circle.center);
			if (closestDist == null || closestDist > dist) {
				closestVertex = v;
				closestDist = dist;
			}
		});

		var axis = new Vector2d(circle.center.x - closestVertex.x, circle.center.y - closestVertex.y).unitVector,
			maxminR = rect.getMaxMinProjection(axis),
			maxminC = circle.getMaxMinProjection(axis);

		return !(maxminR.max < maxminC.min || maxminC.max < maxminR.min)
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