在学习react时，按照官方demo写时遇到的一些问题及概念

如果看的是一些中文文档的话，因为react还处在更新中，可能所看到的文档并不是最新的。那么可能会遇到这样的问题

1. 在较老的版本中（<0.14）中官方的示例中还有tansfromJSX这个文件，并且只有react.js。在较新的版本中（>=0.14）中，引入了react.js react-dom.js原先用来转化jsx语法也改成了babel。具体原因可以看[这里](http://www.oschina.net/news/66873/react-0-14)。

2. 在跟着写demo时，可能会遇到出现没有预期的效果（直接复制官方的代码除外），当出现问题的时候首先想到的就是打断点，调试，但是打开chrome想开始调试，情况与自己想象的完全不一样，断点打了，没用！！居然没进来！！！这个问题肯定会困扰刚接触react的初学者。我当时也纳闷了好久。不急，研究下官方的demo代码：

 ```javascript
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>React Tutorial</title>
  <script src="https://npmcdn.com/react@15.3.1/dist/react.js"></script>
  <script src="https://npmcdn.com/react-dom@15.3.1/dist/react-dom.js"></script>
  <script src="https://npmcdn.com/babel-core@5.8.38/browser.min.js"></script>
  <script src="https://npmcdn.com/jquery@3.1.0/dist/jquery.min.js"></script>
  <script src="https://npmcdn.com/remarkable@1.6.2/dist/remarkable.min.js"></script>
</head>
<body>
  <div id="content"></div>
  <script type="text/babel" src="scripts/example.js"></script>
  <script type="text/babel">
    // To get started with this tutorial running your own code, simply remove
    // the script tag loading scripts/example.js and start writing code here.
  </script>
</body>
</html>
 ```
代码中直接引入babel，并在脚本中设置type="text/babel"，这样处理来转化脚本中jsx语法。此时你虽然看到浏览器中加载的是自己写的代码，但是实际上运行的并不是我们看到的代码，而是经过babel转化成浏览器可识别的普通的js语法的js。所以在文件中直接打断点并不会生效。

其实解决这个问题也简单，如果我们引用的是babel转化好的js，那么我们直接在上面打断点不就行了么。按照这个思路，先去[babel官网](http://babeljs.io/)瞧一眼。
- 安装`babel-cli`（建议全局安装）
```
$ npm install -g babel-cli
```
- 安装`babel-preset-react`（全不全局安装无所谓）
```
$ npm install --save-dev babel-preset-react
```
-  在项目根目录新建`.babelrc`，并写入：
```
{
  "presets": ["react"]
}
```
接下来就根据自己需要查看babel命令行的[用法](http://babeljs.io/docs/usage/cli/)了
为了我们能在自己写的代码中打断点，而不是在转化后的文件中打断点，毕竟我们对自己写的比较熟悉嘛，鬼知道babel把我们自己写的文件转成什么样了
所以使用这个命令行
```
babel public\scripts\example.jsx -w -o public\scripts\example-compiled.js --source-maps
```
这样我们在html中可以直接引入转化好的文件了
```
<script type="text/javascript" src="scripts/example-compiled.js"></script>
```
在chrome中你也可以尽情的打断点了。

3.[jsx](http://www.css88.com/archives/tag/jsx%E8%AF%AD%E6%B3%95)是什么，为什么会有.jsx文件。
在我理解中.jsx实际和js文件没有差别，只是作为用了jsx语法的js文件，用来做一定的区别，这样在编辑器中能够进行语法的高亮。
