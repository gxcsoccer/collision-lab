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
			if (o.containPoint(mp)) {
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
		var normals_1 = rect1.getVectors().map(function(v) {
			return v.leftNormal.unitVector;
		}),
			normals_2 = rect2.getVectors().map(function(v) {
				return v.leftNormal.unitVector;
			}),
			i;

		for (i = 0; i < normals_1.length; i++) {
			if (rect2.isSAT(normals_1[i])) {
				return false;
			}
		}

		for (i = 0; i < normals_2.length; i++) {
			if (rect1.isSAT(normals_2[i])) {
				return false;
			}
		}

		return true;
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