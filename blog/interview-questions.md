### 网络

- TCP/IP协议

  > 三次握手
  >
  > 1. 客户端发送一个含有sync标记的数据包给服务器
  > 2. 服务器收到之后，发送一个含有sync/ack标记的数据包给客户端
  > 3. 客户端发送含有ack标记的数据包给服务器
  >
  > 然后开始通信
  >
  > 四次挥手
  >
  > 1. 客户端发送一个fin标记的数据包给服务器
  > 2. 服务器收到之后，发送一个ack标记的数据包给客户端
  > 3. 服务器所有数据传输完成之后，发送一个fin标记的数据包给客户端
  > 4. 客户端收到之后，发送一个ack标记的数据包给服务器
  >
  > 通信结束

- 缓存

  > 强制缓存「200(from cache)」缓存在本地，不会从服务端请求。优先级：cache-control > expired
  >
  > 协商缓存「304」缓存在缓存服务器或者是本地，向服务器确认是否请求缓存。  优先级：Etag >  last-modified  if-modified-since
  >
  > Etag用于标记文件是否被修改过，Etag优于last-modified的地方有：
  >
  > 1. 文件内容内有被修改，只有文件的修改时间有变化，Etag还是能很好的进行缓存
  > 2. last-modified只能识别秒级别的文件修改操作，小于秒级别的操作无法识别

  参考文档：https://www.cnblogs.com/wonyun/p/5524617.html

- https

  > https是套了一层SSL/TSL协议的http。相比于http，https数据传输多了一层SSL/TSL。https使用了对称加密和非对称加密的混合加密机制。
  >
  > https数据传输过程：
  >
  > 1. 客户端和服务器协商加密组件和协议版本
  > 2. 服务端发送一个含有一个用于加密对称秘钥的公钥的证书给客户端
  > 3. 客户端收到证书之后，验证证书的有效性，取出公钥
  > 4. 用公钥加密对称加密的秘钥，发送给服务器
  > 5. 服务器用非对称加密的秘钥解密，得要对称加密的秘钥
  > 6. 服务器和客户端之前使用对称加密之后的数据进行通信

  参考文档：《图解http》

- http2.0 

  > 多路复用，通过单个http2连接发起多个请求。
  >
  > 服务端推送
  >
  > 头部使用新的压缩方式HPACK，传输使用二进制格式来传输
  >
  > 二进制分帧 

- websocket

- 状态码

  > 200 请求成功 、301资源被永久移动、 302资源被临时移动 、304缓存、400请求参数错误、 403禁止请求 、404无法找到资源 、500服务器内部错误、 502无效请求

- post请求与get请求的区别

  > 1. post请求的数据在请求体中，get请求的数据在url上。安全性上有一定的区别
  > 2. post请求的数据大小没有限制，get请求的数据大小受浏览器和服务器的限制。
  > 3. get请求只能进行url编码，post请求支持多种编码方式
  > 4. get请求会被缓存下来，post请求则不会
  > 5. GET历史参数保留在浏览器历史中。POST参数不会保存在浏览器历史中
  > 6. 最大的区别是两者有语义上的区别，GET幂等，POST不幂等

  参考文档：https://www.zhihu.com/question/28586791

- 网络请求的发送流程

  > 1. 创建对象XMLHttpRequest/ActiveObject对象
  > 2. open send onreadystatechange readystate（0对象被创建、1调用open方法、2调用send方法、3loading状态、4下载完成 ）status 兼容性 xdomainrequest

### 抽象语法树 babel插件

### 网页性能优化

1. 网络

> http1.1协议中，浏览器客户端在同一时间，针对同一域名下的请求有一定数量限制。超过限制数目的请求会被阻塞。所以针对这个可以使用css sprite ，或者采用多个cdn域名来较少请求限制的束缚
>

2. 页面渲染加载

### webpack优化

- 通过`CommonsChunkPlugin`将通用的代码打包到一起，减少打包提交，也能利用浏览器缓存，提高浏览器文件的加载速度。
- 通过配置externals，将第三方库通过script标签从cdn上引入，减少打包体积
- 通过dll，对依赖的第三方库建立索引，减少打包体积
- 选择不同的`devtool`配置
- 业务代码异步加载，减少打包提交「require.ensure」
- 对使用的第三方库，按需引入
- `happypack`插件
  参考资料
  https://segmentfault.com/a/1190000005969643
  https://www.cnblogs.com/imwtr/p/7801973.html

### 模块化

### 跨域

1.   不同源的文档之间的通信

     > postMessage跨域
     >
     > window.name
     >


2. 不同源的客户端和服务器的通信

   > jsonp
   >
   > nginx代理跨域
   >
   > nodejs中间件代理跨域
   >
   > websocket
   >
   > 跨域资源共享（CORS）
   >
   > >   **简单请求**
   > >
   > >   请求方式：HEAD POST GET
   > >
   > >   请求体是以下几种：
   > >
   > >   - Accept
   > >   - Accept-Language
   > >   - Content-Language
   > >   - Last-Event-ID
   > >   - Content-Type：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` 
   > >
   > >   **非简单请求**
   > >
   > >   会先发送一个预请求（options），服务请验证之后，再发送实际请求
   > >
   > >   **cookie的携带**
   > >
   > >   需要遵循同源策略，并且客户端和服务器都需要进行设置


​	参考文档：

​	http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html

​	http://www.ruanyifeng.com/blog/2016/04/cors.html

### css

- 常用布局（flex，grid，圣杯布局，双飞翼布局）
- 盒模型
- 常见的居中方式
- 定位
- BFC
- 清浮动
- 页面重绘重排

### js

- es6
  - 装饰器原理

    > 用于增强类和类方法功能，但是不能用于方法，因为方法存在变量提升。原理是利用了es5的defineproperty属性。

  - async await原理

  - promise原理

    > Promise 是一种对异步操作的封装，可以通过独立的接口添加在异步操作执行成功、失败时执行的方法。
    >
    > 一个promise对象一般有三种状态`pending` `fulfilled(reslove)` `rejected`，三种状态只能从pending向其他两种方式转化，并且不可逆。
    >
    > 参考文档：https://tech.meituan.com/promise-insight.html

- 事件机制

- 事件循环（setTimeout，nextTick，promise，await）

- 闭包

- 继承

- 常用设计模式（单例，观察者）

### vue

- 数据双向绑定原理

  > `vue`中实现是通过`defineProperty`属性实现的，还可以通过`es6`的`proxy`属性来实现数据的双向绑定
  >
  > 1. 将`data`对象通过`defineProperty`重写`getter`和`setter`对`data`中的数据进行劫持,实现对数据变化的监听
  > 2. 数据变化之后，对html模板进行更新
  > 3. 一个watcher，订阅data属性值变化的通知，并执行回调函数，更新模板

- emit 实现原理

- computed与watch的却别，及computed的实现原理

- 生命周期

  > `beforeCreate`  事件的初始化，生命周期的开始
  >
  > `created` 对data数据做响应式处理之后 
  >
  > `beforeMount` template模板编译，初始化render函数 之后
  >
  > `mounted` 挂载dom节点之后，能够通过this.$el获取组件dom
  >
  > `beforeUpdate` 数据变化之后，虚拟dom渲染并且未添加到dom节点之前
  >
  > `updated` 更新后的dom片段挂载完成
  >
  >  `beforeDestroy` this.$destroy() 方法调用之后 
  >
  > `destroyed` 销毁事件监听、 之后

- diff原理

- router页面切换原理

  > hash模式：通过使用修改`window.loacation.hash`和修改`window.location.replace`来实现`this.$router.push`和`this.$router.replace`的。
  >
  > history模式：通过使用修改`history.pushState`和修改`history.replaceState`来实现`this.$router.push`和`this.$router.replace`的。

### web安全防范

- xss（跨站脚本攻击）

  >  xxs全称是跨站脚本攻击，是注入攻击的一。分为反射型XSS，存储型XSS。是因为攻击者在页面上插入恶意的js代码，导致用户在浏览页面时，执行恶意代码，达到攻击的目的。
  >
  >  **防御方法**： 从输入到输出都需要过滤、转义。

- csrf（跨站请求伪造）

  > csrf全称是跨站请求伪造，是攻击者盗用用户的身份，已用户的名义发送请求。
  >
  > **防御方法**：
  >
  > 1. 使用合理的接口定义方式，比如使用restful风格的接口定义。不使用get请求用于数据的增删改操作
  > 2. 设置cookie、session的生命周期
  > 3. 使用验证码
  > 4. referer验证，校验请求的来源
  > 5. 客户端的请求都携带一个token令牌用作身份校验。

### 项目中遇到的问题

多人协作git提交

### 最满意的项目