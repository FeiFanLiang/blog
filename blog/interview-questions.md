## 网络

### TCP/IP协议

 三次握手

1. 客户端发送一个含有sync标记的数据包给服务器
2. 服务器收到之后，发送一个含有sync/ack标记的数据包给客户端
3. 客户端发送含有ack标记的数据包给服务器

 然后开始通信

 四次挥手

1. 客户端发送一个fin标记的数据包给服务器
2. 服务器收到之后，发送一个ack标记的数据包给客户端
3. 服务器所有数据传输完成之后，发送一个fin标记的数据包给客户端
4. 客户端收到之后，发送一个ack标记的数据包给服务器

 通信结束

### 缓存

 强制缓存「200(from cache)」缓存在本地，不会从服务端请求。优先级：cache-control > expired

 协商缓存「304」缓存在缓存服务器或者是本地，向服务器确认是否请求缓存。  优先级：Etag >  last-modified  if-modified-since

 Etag用于标记文件是否被修改过，Etag优于last-modified的地方有：

1. 文件内容内有被修改，只有文件的修改时间有变化，Etag还是能很好的进行缓存
2. last-modified只能识别秒级别的文件修改操作，小于秒级别的操作无法识别

参考文档：https://www.cnblogs.com/wonyun/p/5524617.html

### https

 https是套了一层SSL/TSL协议的http。相比于http，https数据传输多了一层SSL/TSL。https使用了对称加密和非对称加密的混合加密机制。

 https数据传输过程：

1. 客户端和服务器协商加密组件和协议版本
2. 服务端发送一个含有一个用于加密对称秘钥的公钥的证书给客户端
3. 客户端收到证书之后，验证证书的有效性，取出公钥
4. 用公钥加密对称加密的秘钥，发送给服务器
5. 服务器用非对称加密的秘钥解密，得要对称加密的秘钥
6. 服务器和客户端之前使用对称加密之后的数据进行通信

参考文档：《图解http》

### http2.0 

1. HTTP/2 采用**二进制格式传输数据**，而非 HTTP/1.x 的文本格式。二进制格式在协议的解析和优化扩展上带来更多的优势和可能。
2. HTTP/2 对**消息头采用 HPACK 进行压缩传输**，能够节省消息头占用的网络的流量。而 HTTP/1.x 每次请求，都会携带大量冗余头信息，浪费了很多带宽资源。头压缩能够很好的解决该问题。
3. **多路复用**，直白的说就是所有的请求都是通过一个 TCP 连接并发完成。HTTP/1.x 虽然通过 [pipeline](http://en.wikipedia.org/wiki/HTTP_pipelining) 也能并发请求，但是多个请求之间的响应会被[阻塞](http://en.wikipedia.org/wiki/Head-of-line_blocking)的，所以 [pipeline](http://en.wikipedia.org/wiki/HTTP_pipelining) 至今也没有被普及应用，而 HTTP/2 做到了真正的并发请求。同时，流还支持优先级和流量控制。
4. **服务端推送**：服务端能够更快的把资源推送给客户端。例如服务端可以主动把 JS 和 CSS 文件推送给客户端，而不需要客户端解析 HTML 再发送这些请求。当客户端需要的时候，它已经在客户端了。

### websocket

 是一种基于tcp协议的服务器推送技术

 没有同源性限制

 是一种长连接。

### 状态码

100继续、200 请求成功 、202已接收请求，但未处理、204请求无实体内容、301资源被永久移动、 302资源被临时移动 、304缓存、400请求参数错误、 403禁止请求 、404无法找到资源 、500服务器内部错误、 502无效请求

### post请求与get请求的区别

1. post请求的数据在请求体中，get请求的数据在url上。安全性上有一定的区别
2. post请求的数据大小没有限制，get请求的数据大小受浏览器和服务器的限制。
3. get请求只能进行url编码，post请求支持多种编码方式
4. get请求会被缓存下来，post请求则不会
5. GET历史参数保留在浏览器历史中。POST参数不会保存在浏览器历史中
6. 最大的区别是两者有语义上的区别，GET幂等，POST不幂等

参考文档：https://www.zhihu.com/question/28586791

### 网络请求的发送流程

1. 创建对象XMLHttpRequest/ActiveObject对象
2. open send onreadystatechange readystate（0对象被创建、1调用open方法、2调用send方法、3loading状态、4下载完成 ）status 兼容性 xdomainrequest

## 抽象语法树

1. 解析：词法解析和语法解析
2. 转化
3. 生成代码，深度优先遍历ATS

参考资料：https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md

## 网页性能优化

### 网络方面

1. http1.1协议中，浏览器客户端在同一时间，针对同一域名下的请求有一定数量限制。超过限制数目的请求会被阻塞。所以针对这个可以使用css Sprites ，或者采用多个cdn域名来较少请求限制的束缚

### 页面渲染方面

1. 头部加载css，页面底部加载js，方式js加载阻塞页面的渲染
2. 使用压缩过的css和js文件
3. js可以份模块按需加载
4. 使用gzip压缩，减小带宽
5. 设置静态资源的缓存（cache-control，expires，etag，last-modified）

## webpack优化

- 缩小文件的搜索范围,优化loader的`test`，`include`，`exclude`，尽量减少extentions配置，引入模块时尽量把后缀带上


- 通过`CommonsChunkPlugin`将通用的代码打包到一起，减少打包提交，也能利用浏览器缓存，提高浏览器文件的加载速度。

- 通过配置externals，将第三方库通过script标签从cdn上引入，减少打包体积

- 通过dll，对依赖的第三方库建立索引，减少打包体积

- 选择不同的`devtool`配置

- 业务代码异步加载，减少打包提交「require.ensure」

- 对使用的第三方库，按需引入

- `happypack`插件

  参考资料：
  https://segmentfault.com/a/1190000005969643

  https://www.cnblogs.com/imwtr/p/7801973.html

  http://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-1%E7%BC%A9%E5%B0%8F%E6%96%87%E4%BB%B6%E6%90%9C%E7%B4%A2%E8%8C%83%E5%9B%B4.html

## webpack运行原理

webpack在打包过程中，主要分为以下3个阶段

1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
2. 编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。
3. 输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

文件发生变化时，重新执行步骤2、步骤3。

常见的几个event hooks：

`before-run`、`run`、`watch-run`、`before-compile`、`compile`、`compilation`、`emit`、`after-emit`

参考资料：

https://webpack.js.org/api/compiler/

http://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/

## 模块化

![](https://raw.githubusercontent.com/zimplexing/zzZ/master/images/modules.png)

### 循环加载

commonjs在处理循环加载的时候，由于是同步的，只能拿到已执行代码的结果的。

es6在代码编译阶段就会对import生成一个模块的引用，只要能够保证代码执行的时候能够取值。

参考资料：

http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html

http://es6.ruanyifeng.com/#docs/module-loader#%E5%BE%AA%E7%8E%AF%E5%8A%A0%E8%BD%BD

https://github.com/zimplexing/zzZ/issues/23

## require机制

```
require(X) from module at path Y
1. If X is a core module,
   a. return the core module
   b. STOP
2. If X begins with '/'
   a. set Y to be the filesystem root
3. If X begins with './' or '/' or '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
4. LOAD_NODE_MODULES(X, dirname(Y))
5. THROW "not found"

LOAD_AS_FILE(X)
1. If X is a file, load X as JavaScript text.  STOP
2. If X.js is a file, load X.js as JavaScript text.  STOP
3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
4. If X.node is a file, load X.node as binary addon.  STOP

LOAD_INDEX(X)
1. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
3. If X/index.node is a file, load X/index.node as binary addon.  STOP

LOAD_AS_DIRECTORY(X)
1. If X/package.json is a file,
   a. Parse X/package.json, and look for "main" field.
   b. let M = X + (json main field)
   c. LOAD_AS_FILE(M)
   d. LOAD_INDEX(M)
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. let DIRS=NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_AS_FILE(DIR/X)
   b. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS
```

参考文档：

http://www.ruanyifeng.com/blog/2015/05/require.html

https://nodejs.org/api/modules.html#modules_require

## 跨域

1.   不同源的文档之间的通信

     postMessage跨域

     window.name



2. 不同源的客户端和服务器的通信

   jsonp

   nginx代理跨域

   nodejs中间件代理跨域

   websocket

   跨域资源共享（CORS）

   **简单请求**

   请求方式：HEAD POST GET

   请求体是以下几种：

    - Accept

    - Accept-Language

    - Content-Language

    - Last-Event-ID

    - Content-Type：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` 

    **非简单请求**

    会先发送一个预请求（options），服务请验证之后，再发送实际请求

   **cookie的携带**

   需要遵循同源策略，并且客户端和服务器都需要进行设置


​	参考文档：

​	http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html

​	http://www.ruanyifeng.com/blog/2016/04/cors.html

## css

### 两栏布局

1. 两部分都设置float，右侧自适应部分的宽度使用calc方法计算所得
2. 右侧部分设置float，并设置margin-left，并清除浮动
3. 左侧绝对定位，右侧设置margin-left
4. 使父容器形成BFC，左侧部分浮动，右侧也形成一个BFC，使其不会和浮动元素重叠
5. flex布局
6. grid布局

参考文档：https://segmentfault.com/a/1190000010698609

### css中的百分比

**相对于父元素宽度的：**

> [max/min-]width、left、right、text-indent、padding、margin 等；

**相对于父元素高度的：**

> [max/min-]height、top、bottom 等；

**相对于主轴长度的：**

> flex-basis 等；

**相对于继承字号的：**

> font-size 等；

**相对于自身字号的：**

> line-height 等；

**相对于自身宽高的：**

> border-radius、background-size、border-image-width、transform: translate()、transform-origin、zoom、clip-path 等；

**相对于行高的：**

> vertical-align 等；

### 常见的居中方式

- 垂直居中
   + `line-height`用于居中行内元素
   + flex布局，使用`align-items: center;`属性
   + 绝对定位，top的 `tranlateY` 和 `height/2` 来进行定位
   + 设置`table-cell`,然后使用 `vertical-algin:middle`「=」
 - 左右居中
    + `margin: auto 0`来居中宽度固定的元素
    + 绝对定位，top的 `tranlateX` 和 `weight/2` 来进行定位
    + 行内元素通过`text-align:center`居中
    + flex布局，使用`justify-content:center`属性进行水平居中

### BFC

BFC：块级格式化上下文，它是指一个独立的块级渲染区域，只有Block-level BOX参与，该区域拥有一套渲染规则来约束块级盒子的布局，且与区域外部无关

**BFC的触发条件：**

  - 根元素
  - float的值不为none
  - overflow的值不为visible
  - display的值为inline-block、table-cell、table-caption
  - position的值为absolute或fixed

**BFC特性**

  - BFC会阻止垂直外边距（margin-top、margin-bottom）折叠
  - BFC不会重叠浮动元素 (用于解决布局基本的两栏或三栏布局)
  - BFC可以包含浮动 （用于解决父容器塌陷的问题）

**清除浮动**

  - 子元素浮动之后，将父容器设置为BFC（overflow:hidden）
  - clear: both

参考资料：http://www.cnblogs.com/dojo-lzz/p/3999013.html

### 页面重绘重排	

页面渲染一般主要分为dom树渲染和style树渲染，最后是render树。

页面请求成功之后，浏览器会先根据html和样式文件分别渲染DOM Tree和style Tree，如果在渲染过程中，有js的加载的话，会阻塞两颗树的渲染过程，因为js中有可能会存在对dom节点的操作或者是对样式的修改，两颗树渲染成功之后，会合成render tree，render tree中包含了所有页面上占有空间的元素。

如果页面频繁进行重排的话，页面就会出现卡顿等现象。重排必然导致重绘。代码中尽量避免在短时间内多次重排页面。

以下情况会导致页面的重排

1. 添加或删除可见的dom元素
2. 元素位置发生改变
3. 元素的尺寸发生变化
4. 元素的内容发现变化
5. 浏览器窗口发生变化
6. 页面初始化
7. 获取页面布局信息（获取各种宽高）

### css3 动画

```css
// css永久动画
@keyframes go {
  0% {
    transform: translateX(0)
  }
  50% {
    transform: translateX(180px)
  } 
  100% {
    transform: translateX(0)
  }
}
div {
  animation: go infinite linear
}
//js永久动画可以通过requestAnimationFrame来实现
```
## javascript

### 类型判断

typeof   Object.prototype.toString.call() instanceof 

```javascript
// 隐性转化时，对象会先调用valueOf 和 toString 方法
[] == false          // true
{} == false          // false
undefined == null    // true
undefined === null   // false
NaN === NaN          // false
-0 === +0            // true
```
### 对象内置方法

`keys` `assgin` `values` `create`  `defineProperty` `definepProperties`  `isPropertyOf` `hasOwnProperty` `toString` `valueOf` `propertyIsEnumerable`

### es6

- #### 装饰器原理

  用于增强类和类方法功能，但是不能用于方法，因为方法存在变量提升。原理是利用了es5的defineproperty属性。

- #### async await原理

- #### promise原理

  Promise 是一种对异步操作的封装，可以通过独立的接口添加在异步操作执行成功、失败时执行的方法。

  一个promise对象一般有三种状态`pending` `fulfilled(reslove)` `rejected`，三种状态只能从pending向其他两种方式转化，并且不可逆。

  参考文档：https://tech.meituan.com/promise-insight.html

### 事件流

事件流描述的是从页面中接收事件的顺序，事件流分为三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。在捕获阶段，事件从文档的根节点向触发事件的dom节点传递，传递到事件触发节点后，开始冒泡阶段，从当前节点向文档的更节点传递。

> **html事件处理程序**
>
> 在html标签上进行绑定事件，事件的回调函数中的this指向的是全局对象window
>
> **dom0级事件处理程序**
>
> 通过获取dom节点对象引用后绑定事件。通过这种方式绑定的事件，同一个dom节点同一个时间只能注册一次，后边注册的会覆盖前面的。事件的回调只能在冒泡阶段被触发。this指向当前节点对象的引用
>
> **dom2级事件处理程序**
>
> 通过addEventListener绑定事件。通过第三个参数可以指定事件处理程序在冒泡阶段或者捕获阶段触发。默认是在冒泡阶段触发事件处理程序。this也是指向绑定事件的节点对象的引用。

target和currentTarget的区别：currentTarget用于和this相等，是指绑定事件处理程序的那个元素，target是指触发事件处理程序的那个元素。不是在事件委托的情况下，三者是相同的。

### 事件循环（setTimeout，nextTick，promise，await）

​	因为js是单进程的，所以也就有了事件循环这一机制。在主进程上执行的一般被称为执行栈，用于执行异步任务的一般称为任务队列。任务队列中，一般又分为   marcotask（宏任务）和mircotask（微任务），一般全局的执行栈可以理解为第一个宏任务，js脚本首先会执行宏任务，在执行宏任务的过程中，会有异步任务（回调函数），这些异步任务会生成一个任务队列。在这些异步任务中同样有宏任务和微任务之分，其中的微任务会在当前宏任务执行完之后执行，也就说在在新的宏任务执行前执行，其中的宏任务会成为“新”的一个执行栈（主进程的执行栈清空之后，会读取任务队列），这样就形成了一个循环，也就是事件循环。

 	上述的宏任务一般包括：setTimeout，setInterval，I/O任务，setImmediate，ui渲染。微任务一般包括process.nextTick，Promise。其中对于多个setTimeout，setInterval，会被合并到同一个宏任务中，process.nextTick在Promise之前执行，其中promise的then才属于微任务，new promise是同步的，直接执行。

参考资料：
https://juejin.im/entry/58d3f7a944d9040068600c49
http://www.ruanyifeng.com/blog/2014/10/event-loop.html

### 闭包

闭包是在外部能够访问函数内部的变量的函数。

缺点：因为闭包会对能够访问的变量一直存在着引用关系，所以js的垃圾回收机制无法将该变量回收，可能会导致内存溢出。

场景：1、创建私有变量 2、构建单例模式 3、函数柯里化 4、缓存数据

### 对象的创建

#### *工厂模式*

```javascript
function factory (name, age) {
  var o = {
    name: name,
    age: age,
    getAge: function () {
      return this.age
    }
  };
  return o
}
```

#### *构造函数模式*

```javascript
function Person (name, age) {
  this.name = name;
  this.age = age;
  this.getAge = function () {
    return this.age
  }
} 
var person = new Person('zinplexing', 25)
// 1. 新建一个对象
// 2. 将新建的对象的作用域指向构造函数
// 3. 执行构造函数
// 4. 返回新建对象
```

#### *原型模式*

```javascript
function Person () {}
Person.prototype.name = 'zhangx'
Person.prototype.getName = function () {
  return this.name
}
```

#### *组合模式*

```javascript
function Person (name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.getAge = function () {
	return this.age;  
}  
```

#### *寄生构造模式*

```javascript
function Person(name, age) {
  var o = {
    name: name,
    age: age,
    getAge: function(){
      return this.age
    }
  }
  return o
}
```

### **继承**

#### *原型链继承*	

```javascript
// 继承的属性值都是共享
b.prototype = new a()
```

#### *借用构造函数继承*

```javascript
Function B () {
	A.call(this)
}
```

####  *组合继承*

```javascript
// 方法继承通过原型链继承，属性继承通过借用构造函数继承	
```

#### *原型式继承*

```javascript
  function object(obj){
    function F(){}
    F.prototype = obj
    return new F()
  }
  // Object.create()也能实现该效果
```

####  *寄生式继承*

```javascript
function B(obj){
  var clone = object(obj)
  clone.xx = function () {}
  return clone
}
```

####  *寄生组合式继承*

```javascript
function inheritPrototype (A, B) {
  var prototype = object(A.prototype) 
  B.prototype = prototype
  B.prototype.constrctor = B
}
```
### ES5的继承和ES6的继承区别



### this指向

### 常用设计模式（单例，观察者）

### 节流和防抖函数

## 基本算法

### 排序算法

### 大数据量相加

思路：两个相加的数据转成字符串，每位数字分别相加。

### 括号匹配

思路：遍历整个字符串，用一个数组缓存左括号，当匹配到右括号时，与缓存数组的最后一个括号进行匹配，如果不匹配，则直接返回括号匹配失败，如果匹配成功，那么删除当前匹配的括号，继续遍历。

### 数遍历DFS BFS

### 二分法

```javascript
function binarySearch (arr, target, startIndex, endIndex) {
  var mid = Math.floor((startIndex + endIndex) / 2)
  if (arr[mid] > target) {
    binarySearch(arr, target, startIndex, mid)
  } else if (arr[mid] < target) {
    binarySearch(arr, target, mid, endIndex)
  } else {
    return mid
  }
}
```
## vue

### 数据双向绑定原理

`vue`中实现是通过`defineProperty`属性实现的，还可以通过`es6`的`proxy`属性来实现数据的双向绑定

1. 将`data`对象通过`defineProperty`重写`getter`和`setter`对`data`中的数据进行劫持,实现对数据变化的监听，并每个属性都维护了一个订阅器`dep`，用户存储订阅该属性变化的订阅者「依赖收集」。
2. 模板的编译函数，用于解析vue的指令，将模板渲染成html模板
3. 一个watcher「订阅者」，订阅data属性值变化的消息，并执行回调函数，更新模板

![](https://raw.githubusercontent.com/DMQ/mvvm/master/img/2.png)

参考文档： https://github.com/DMQ/mvvm

### emit on once off原理

利用了观察者订阅者模式，事件都放在`vm`实例的`_event`对象上

### computed/watch

`computed`会缓存起来，`watch`不会被缓存

**watch**

遍历`watch`对象的所有属性，对`watch`的属性做响应式处理，即对每个属性的订阅器添加一个订阅者（`watcher`），改订阅者的回调就是`watch`的`handler`

**computed**

1. 与watch一样，对computed的属性做响应式处理，但是watch的参数expFun是自定义的getter，回调函数cb是noop。
2. 模板的中的指令订阅某计算属性时，就会触发vue的数据双向绑定机制，computed的某个属性的订阅器中增加一个订阅器（模板指令）
3. 触发该属性的getter，那么就会去获取该属性依赖的数据，则会触发依赖数据的getter，依赖数据将该计算属性作为订阅者加入到自己的订阅器中。
4. 当计算数据依赖的数据发生变化时，依赖数据会对自己订阅器中的订阅者发送消息，触发订阅者「步骤1中的watch」的update方法，将dirty更新为true，重新计算新的值（watcher.get() --> this.getter.call(vm, vm)，这里的getter就是自定义的expFun），导致该属性的变化
5. 触发「步骤2中的watch」，更新视图

参考文档：https://github.com/banama/aboutVue/blob/master/vue-observe.md

### 生命周期

`beforeCreate`  事件的初始化，生命周期的开始

`created` 对data数据做响应式处理之后 

`beforeMount` template模板编译，初始化render函数 之后

`mounted` 挂载dom节点之后，能够通过this.$el获取组件dom

`beforeUpdate` 数据变化之后，虚拟dom渲染并且未添加到dom节点之前

`updated` 更新后的dom片段挂载完成

 `beforeDestroy` this.$destroy() 方法调用之后 

`destroyed` 销毁事件监听、 之后

### diff原理

### router页面切换原理

**hash模式**

通过使用修改`window.loacation.hash`和修改`window.location.replace`来实现`this.$router.push`和`this.$router.replace`的。

**history模式**

通过使用修改`history.pushState`和修改`history.replaceState`来实现`this.$router.push`和`this.$router.replace`的。

## web安全防范

### xss（跨站脚本攻击）

xxs全称是跨站脚本攻击，是注入攻击的一。分为反射型XSS，存储型XSS。是因为攻击者在页面上插入恶意的js代码，导致用户在浏览页面时，执行恶意代码，达到攻击的目的。

**防御方法**： 从输入到输出都需要过滤、转义。

### csrf（跨站请求伪造）

csrf全称是跨站请求伪造，是攻击者盗用用户的身份，已用户的名义发送请求。

**防御方法**：

1. 使用合理的接口定义方式，比如使用restful风格的接口定义。不使用get请求用于数据的增删改操作
2. 设置cookie、session的生命周期
3. 使用验证码
4. referer验证，校验请求的来源
5. 客户端的请求都携带一个token令牌用作身份校验。

## 项目中遇到的问题

多人协作git提交

大数据量大树组件的性能问题

vuex的参数问题

## 最满意的项目

图片存储
日历复制黏贴
树表格的穿梭框
