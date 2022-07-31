String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.isCapitalized = function() {
	return this.charAt(0) == this.charAt(0).toUpperCase();
}
