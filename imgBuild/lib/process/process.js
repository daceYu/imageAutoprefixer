/**!
 * base 
 * explain: process operation
 * author: yugang <yugang@myhexin.com>
 */
const process = require("process");
const colors = require("../util/color.js");

/**
 * start process
 * param {Function} callback: callback function
 */
let workStart = (callback) => {
	console.log(colors.get("FgGreen"), "请输入图片文件所在目录：");	
	process.stdin.setEncoding("utf8");
	// The default is pause, call the follwing code to resume
	process.stdin.resume();
	// Listen input data
	process.stdin.on("data", function (result) {
		dealCMD(result, callback);
		process.stdin.pause();
	})
}

/**
 * deal width process result
 * param {Stream} data: process return
 * param {Function} callback: callback function
 */
let dealCMD = (data, callback) => {
	// Delete the spaces at the beginning and end of data
	let _result = data.toString().trim();

	// no process in
	if (!_result) {
		console.log(colors.get("FgRed"), "Error, no process in");
		return false;
	}

	callback(_result);
}

module.exports = workStart;