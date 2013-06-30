var Rectangle = function(x, y, width, height, mass) {
		this.mass = mass || 1;
		this.width = width;
		this.height = height;

		this.topLeft = new Vector2d(x, y);
		this.topRight = new Vector2d(x + width, y);
		this.bottomRight = new Vector2d(x + width, y + height);
		this.bottomLeft = new Vector2d(x, y + height);

		this.velocity = new Vector2d(0, 0);
		this.acceleration = new Vector2d(0, 0);
		this.theta = 0;
		this.omega = 0;
		this.alpha = 0;
		this.J = this.mass * (this.height * this.height + this.width * this.width) / 12000;
	}

Rectangle.prototype.center = function() {
	var diagonal = this.bottomRight.minus(this.topLeft);
	var midpoint = this.topLeft.add(diagonal.scale(0.5));
	return midpoint;
};

Rectangle.prototype.rotate = function(angle) {
	this.theta += angle;
	var center = this.center();

	this.topLeft = this.topLeft.rotate(angle, center);
	this.topRight = this.topRight.rotate(angle, center);
	this.bottomRight = this.bottomRight.rotate(angle, center);
	this.bottomLeft = this.bottomLeft.rotate(angle, center);

	return this;
};

Rectangle.prototype.draw = function(context) {
	context.save();
	context.translate(this.topLeft.x, this.topLeft.y);
	context.rotate(this.theta);
	context.strokeRect(0, 0, this.width, this.height);
	context.restore();
}