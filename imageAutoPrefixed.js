
const workStart = require("./imgBuild/process/process");
const func = require("./imgBuild/fsFunc/func");

workStart(function (data) {
	func(data);
})