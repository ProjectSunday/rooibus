Array.prototype.clone = function () {
	return JSON.parse(JSON.stringify(this))
}

Object.prototype.clone = function () {
	return JSON.parse(JSON.stringify(this))
}