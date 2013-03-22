window.requestAnimFrame = this.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback, element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		rect1 = new Rect(new Vector2d(80, 150), 100, 100, 23),
		rect2 = new Rect(new Vector2d(250, 70), 50, 50, 78),
		objs = [rect1, rect2],
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
		switch(keycode) {
			case 82:
				rect1.deg += 5;
				break;
			case 84:
				rect2.deg += 5;
				break;
			default:
				break;
		}
	});


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

	function draw(context) {
		context.clearRect(0, 0, 400, 300);

		objs.forEach(function(o) {
			o.draw(context);
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