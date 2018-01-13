# imageAutoprefixer
Images are processed automatically, such as 1X, 2x, webp, Base64, etc. based on the requirements, and can also automatically turn the pictures on the page into Base64 format.

[Blog Link](http://daceyu.com/2018/01/14/imageAutoFixer/)

## Version

___v1.1___

## Support

根据已有`2x`图，自动生成`1x`图、`webp`格式图片、`base64`格式`json`文件，自动替换`html`代码中的图片为`base64`

## Run

```javascript
node imageAutoPreFixed.js
```

## Configure

config.js中

```javascript
module.exports = {
    pathroot: './dist/'
};
```

在此处，`pathroot`配置的是项目相对`imageAutoFixed.js`的相对路径，例如项目`b`就是`./dist/b`

## RequireMent

约定：

1.  项目下需要有一个`images`文件夹

2.  需要操作的图片对象命名格式为`*_2x.png`或者`*_2x.jpg`等等

3.  如果需要自动将`html`中的图片替换为`base64`，那么引入图片需要如下：

    ```html
    <img src="images/*_min.png">
    ```

    当然，会自动生成一份`json`文件，你也可以选择手动替换。



如有疑问或者有更好的idea，可以邮件我(daceyu@aliyun.com)一起探讨，谢谢！

