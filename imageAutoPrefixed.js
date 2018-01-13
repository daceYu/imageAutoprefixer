
const workStart = require("./imgBuild/lib/process/process");
const func = require("./imgBuild/lib/fsFunc/func");

workStart(function (data) {
	func(data);
})