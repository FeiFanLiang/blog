##  接入第三方登录之Github

###  OAuth协议

​	简单的来理解就是一个授权协议，具体可以参考[帮你深入理解OAuth2.0协议](http://www.open-open.com/lib/view/open1392863557428.html)，这篇文章比较详细有趣的减少了OAuth2.0协议。有兴趣的可以拜读一下。但是如果只想接入github登录的话，这个懂没懂都没有太大关系，知道下有这个东西~~



### 最简单的准备工作

​	在自己的github页面点击自己的头像，然后在`settings->Developer settings->OAuth application`中创建一个application。这边需要自己小心注意填的就是两个URL了，`Homepage URL`这个很容理解，就是自己的应用的首页了~还有一个是`Authorization callback URL`这个url的作用是，等会我们请求github的接口，返回成功之后，浏览器会重定向到这个地址，所以这个比较重要~



###  Github的授权过程

1. **获取code**

   发送一个获取`code`码的`get`请求，请求地址：`GET https://github.com/login/oauth/authorize`

   这个请求的具体参数`client_id` `redirect_uri` `scope` `state` `allow_signup`

   具体参数的含义可以参见[这里](https://developer.github.com/v3/oauth/)的官方文档。

   - `client_id`：创建应用之后，`github`会自动生成一个`client_id和client_secret`两个字段，这个两个很重要，之后还需要用到。
   - `redirect_url`：这个是在向github发送这个请求code成功之后，github会自动跳转到这个链接，注意：这个链接不是github访问这个链接，是浏览器重定向到这个链接，所以这个链接是`内网ip`或者是`localhost`之类的都是可以的，调试很方便。但是这个`url`需要与在创建应用的时候写的`callback url`一致。
   - `scope`：是我们请求授权的范围，也就是我们需要获取授权用户的哪些信息，需要在这边定义好。

2. **获取access_token**

   发送一个`post`请求到`https://github.com/login/oauth/access_token`

   这个请求的具体参数为`client_id` `client_secret` `code` `redirect_url` `state`

   这几个参数都比较简单，与第一个请求就差了请求方式的不同，多了一两个不同的参数，但是这些参数我们都能拿到，如果还缺，那就去前面在看看了~~~这边需要注意的也没啥了。- 。-

3. **最后就是获取我们想要的数据啦~**

   发送一个`get`请求到`https://api.github.com/user`，参数就是我们上一步获取到的`access_token`了，然后就可以静静的等我们需要的数据返回了~~~

### 注意 注意 注意

-  在请求数据（第三步）的时候，需要设置请求头`'User-Agent': '你的应用名或者是你的github用户名'`
-  第一步请求code的时候，如果用get请求，在没有登录github的情况下会返回github的登录页，在你的域名下！你的域名下！你的域名下！然并卵，并不能登录，只是一个静态页面而已。

