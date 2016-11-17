// Array.prototype.rclone = function () {
// 	return JSON.parse(JSON.stringify(this))
// }

// Object.prototype.rclone = function () {
// 	return JSON.parse(JSON.stringify(this))
// }


export const clone = (original) => {
	return JSON.parse(JSON.stringify(original))
}