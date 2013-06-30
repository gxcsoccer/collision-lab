window.requestAnimFrame = this.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback, element) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

window.onload = function() {
	var canvas = document.getElementById("canvas"),
		canvasWidth = canvas.width,
		canvasHeight = canvas.height,
		context = canvas.getContext("2d"),
		rect = new Rectangle(200, 0, 100, 50),
		spring = new Vector2d(200, 0),
		stiffness = 0.5,
		b = -1,
		angularB = -5;

	rect.velocity = new Vector2d(0, 2);

	var lastTimespan = 0;
	var loop = function(timespan) {
			timespan = timespan || 0;
			var dt = (timespan - lastTimespan) / 1000; 
			lastTimespan = timespan;
			// var now = new Date();
			// lastTimespan = lastTimespan || now;
			// var dt = (now - lastTimespan) / 1000;
			// lastTimespan = now;
			// console.log(dt);
			//var dt = 0.02;
			//dt = dt || 0.02;
			console.log(dt);

			var f = new Vector2d(0, 0);
			var torque = 0;

			/* Start Velocity Verlet by performing the translation */
			var dr = rect.velocity.scale(dt).add(rect.acceleration.scale(0.5 * dt * dt));
			rect.move(dr.scale(100));

			/* Add Gravity */
			f = f.add(new Vector2d(0, rect.mass * 9.81));

			/* Add damping */
			f = f.add(rect.velocity.scale(b));

			/* Add Spring; we calculate this separately so we can calculate a torque. */
			var springForce = rect.topLeft.minus(spring).scale(-1 * stiffness); /* This vector is the distance from the end of the spring to the box's center point */
			var r = rect.center().minus(rect.topLeft); /* The cross product informs us of the box's tendency to rotate. */
			var rxf = r.cross(springForce);

			torque += -1 * rxf;
			f = f.add(springForce);

			/* Finish Velocity Verlet */
			var new_a = f.scale(rect.mass);
			var dv = rect.acceleration.add(new_a).scale(0.5 * dt);
			rect.velocity = rect.velocity.add(dv);

			/* Do rotation; let's just use Euler for contrast */
			torque += rect.omega * angularB; // Angular damping
			rect.alpha = torque / rect.J;
			rect.omega += rect.alpha * dt;
			var deltaTheta = rect.omega * dt;
			rect.rotate(deltaTheta);

			draw();

			requestAnimFrame(loop);
		};

	var draw = function() {
			context.clearRect(0, 0, canvasWidth, canvasHeight);

			rect.draw(context);

			context.beginPath();
			context.moveTo(spring.x, spring.y);
			context.lineTo(rect.topLeft.x, rect.topLeft.y);
			context.stroke();
			context.closePath();
		};

	loop();
}