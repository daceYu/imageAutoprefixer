/**!
 * base 
 * explain: image operation
 * author: yugang <yugang@myhexin.com>
 */
const fs = require("fs");
const path = require("path");
const config = require("../../../config");
const colors = require("../util/color");
const gm = require("gm").subClass({
	imageMagick: true
})

let htmlArr = [],   // .html files
	imgArr = [],    // 2X pictures under the images folder
	baseArr = [];   // The base64 string that is turned into a picture

/**
 * verify folder exists
 * param {String} folderName: verify this folder exists
 */
let fsExistSync = (folderName) => {
	// path handle
	folderName = path.join(config.pathroot, folderName);

	// Non-existent
	if (!fs.existsSync(folderName)) {
		console.log(colors.get("FgRed"), `Cannot find ${folderName}`)
		return false;
	}

	getFiles(folderName);
}

/**
 * loop folder && find `.html` and the images folder
 * param {String} folderName: loop this folder
 */
let getFiles = (folderName) => {
	// find `.html` files
	fs.readdir(folderName.replace("/images", ""), (err, files) => {
		for (let i = 0; i < files.length; i++) {
			let obj = files[i];
			obj.indexOf(".html") > -1 && htmlArr.push(obj);
		}
	})

	// Determine the path of the picture folder
	folderName = folderName.indexOf("images") > -1 ? folderName : `${folderName}/images/`;
	// find all the pictures like `_2x.`
	fs.readdir(folderName, (err, files) => {
		if (err) {
			console.log(colors.get("FgRed"), err);
			return false;
		}

		for (let i = 0; i < files.length; i++) {
			let obj = files[i];
			imgArr.indexOf(obj) < 0 && obj.indexOf("_1x") < 0 && obj.indexOf("_2x") > -1 && imgArr.push(obj);
		}

		for (let j = 0; j < imgArr.length; j++) {
			writeImg(folderName, imgArr[j])
		}
	})
}

/**
 * Processing pictures
 * param {String} folderPath: target path
 * param {String} fileName: picture name
 */
let writeImg = (folderPath, fileName) => {
	let obj = `${folderPath}${fileName}`;

	// create `.webp`
	let _webpPath = obj.replace("_2x", "").split(".")[0] + ".webp";
	gm(obj).setFormat('webp').write(_webpPath, (err) => {
		if (err) throw new Error(err);
		console.log(colors.get("FgCyan"), `${_webpPath}生成成功`);
	})

	gm(obj).size( function (err, size) {
		let _width = 0.64 * size.width;
		this.resize(_width);

		// create `_1x.`
		let _1xfilename = fileName.replace("_2x", "_1x");
		let _1xpath = `${folderPath}${_1xfilename}`;
		this.write(_1xpath, (err) => {
			if (err) throw new Error(err);
			console.log(colors.get("FgCyan"), `${_1xpath}生成成功`);
		})

		// create `base64` && handle `<img>` in `html` file to replace `base64`
		let _minW = 0.2 * size.width,
			_minfilename = fileName.replace("_2x", "_min"),
			_minpath = `${folderPath}${_minfilename}`;
		this.resize(_minW).colors(8).blur(7,3).toBuffer("jpg", function (err, buffer) {
			if (err) {
				console.log(colors.get("FgRed"), err);
				return false;
			}

			let base = '"images/' + _minfilename + '":"data:image/png;base64,' + buffer.toString("base64") + '"';
			baseArr.push(base);
			if (baseArr.length == imgArr.length) {
				let _obj = `var baseObj = { ${baseArr.join(",\r\n")} }`;
				let _basePath = folderPath.replace("images/", "base64.json");
				fs.appendFile(_basePath, _obj, (err) => {
					if (err) {
						console.log(colors.get("FgRed"), err);
						return false;
					}
					console.log(colors.get("BgCyan"), "生成base64.json文件")
				})

				// finally , replace
				eval(_obj);
				for (let i = 0; i < htmlArr.length; i++) {
					let path = folderPath.replace("images/", htmlArr[i]);
					renderBase64(path, baseObj);
				}
			}
		})
	})
}

/**
 * img replace to base64
 * if exist html file, Replace the pictures of _min in the IMG label in the HTML file into Base64
 * param {String} path: file path
 * param {String}
 */
let renderBase64 = (path, baseObj) => {
	fs.readFile(path, {
		encoding: "utf-8"
	}, (err, data) => {
		if (err) {
			console.log(colors.get("FgRed"), err)
			return false;
		}

		let str = data.replace(/src=[\'\"]?([^\'\"]*)[\'\"]?/gi, (data, match) => {
			return match.indexOf("_min.png") > -1 ? `src="${baseObj[match]}"` : `src="${match}"`
		});
		fs.writeFile(path, str, (err) => {
			if (err) {
				console.log(colors.get("FgRed"), err)
				return false;
			}
			console.log(colors.get("FgCyan"), `${path} 已替换图片`);
		})
	})
}



module.exports = fsExistSync