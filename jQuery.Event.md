在学习`bootstrap`的插件源码时,发现在里面很多地方都用运用到了`jQuery.Event()`这个方法.但是去api查的时候,却并没有找到这个方法,然后去[官网文档](https://api.jquery.com/category/events/event-object/)搜索了下,才发现这个方法.

这个方法可以自定义一个事件,并用`trigger`方法去触发
```javascript
//Create a new jQuery.Event object without the "new" operator.
var e = jQuery.Event( "click" );

// trigger an artificial click event
jQuery( "body" ).trigger( e );
```
也可以给自定义的方法加上一些特定参数
```javascript
// Create a new jQuery.Event object with specified event properties.
var e = jQuery.Event( "keydown", { keyCode: 64 } );

// trigger an artificial keydown event with keyCode 64
jQuery( "body" ).trigger( e );
```
`event`这个对象的属性,在跨浏览器中,支持的一些属性
- target
- relatedTarget
- pageX
- pageY
- which
- metaKey

`event`其他的一些属性,会因为事件的不同而不同:

`altKey`, `bubbles`, `button`, `buttons`, `cancelable`, `char`, `charCode`, `clientX`, `clientY`, `ctrlKey`, `currentTarget`, `data`, `detail`, `eventPhase`, `key`, `keyCode`, `metaKey`, `offsetX`, `offsetY`, `originalTarget`, `pageX`, `pageY`, `relatedTarget`, `screenX`, `screenY`, `shiftKey`, `target`, `toElement`, `view`, `which`

在`bootstrap`的插件中,他使用这个方法主要用`relatedTarget`这个属性,用来记录上一次操作的`DOM`元素.因为`relatedTarget`这个属性,在原生的事件中只有`mouseover`和`mouseout`两个事件中是支持的,其他事件都没有这个属性,bootstrap用一种巧妙的方法,给一些其暴露在外面的方法加上这一属性,下面通过几个简单的例子来看下.

`demo`的`html`代码
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>jQuery.event demo</title>
    <style>
      li{
        height: 30px;
        line-height: 30px;
        margin-bottom: 1px;
        font-size: 20px;
        background-color: #e2e2e2;
        cursor: pointer;
      }
      .active{
        background-color: #666;
      }
    </style>
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
  </head>
  <body>
    <ul>
      <li class="active">1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
    </ul>
  </body>
</html>
```
首先我们来看下`mouseover`和`mouseout`事件默认的`relatedTarget`属性
```javascript
  $('li').mouseout(function(event){
    console.log("鼠标离开的标签"+$(event.target).html());
    console.log("鼠标离开后,鼠标在的标签:"+ $(event.relatedTarget).html());
  });
```
从这个例子中可以看到，原生事件中的`relatedTarget`属性是`ul`标签，虽然有这个属性，但是其实并不是我们想要的，我们想到的应该是我鼠标移开前的`DOM`元素才对，即在这个例子中应该是`li`标签才对．所以我们对这个进行改造，使他达到我们所需要的效果．

这时，这需要用到`jQuery.event`这个方法了，去指定`relatedTarget`这个属性
```javascript
  $('li').on('mouseover',function(){
    //在鼠标移入时，定义一个事件
    var e = $.Event('testmouseout',{
      //指定`relatedTarget`的值为上一个`DOM`元素
      relatedTarget:$('.active')[0]
    });
    $(this).addClass('active').siblings('li').removeClass('active');
    $(this).trigger(e);
  });
  $('li').on('testmouseout',function(event){
    console.log("鼠标离开的标签"+$(event.target).html());
    console.log("鼠标离开后,鼠标在的标签:"+ $(event.relatedTarget).html());
  })
```
下面我们来看下`click`这些没有`relatedTarget`这个属性的，该怎么处理，其实和上面那个例子一样

先来看`click`默认的`relatedTarget`属性
```javascript
  $('li').click(function(event){
    $(this).addClass('active').siblings('li').removeClass('active');
    console.log("当前点击的标签: " + $(event.target).html());
    console.log("click等事件是没有relatedTarget属性的: "+ event.relatedTarget);
  })
```
从结果可以看到，`click`确实没有这个属性

然后我们对其进行改造下
```javascript
  $('li').on('click',function (){
    var e = $.Event('myclick',{
      relatedTarget: $('.active')[0]
    })
    $(this).addClass('active').siblings('li').removeClass('active');
    $(this).trigger(e);
  });
  $('li').on('myclick',function(event){
    console.log("当前点击的标签: " + $(event.target).html());
    console.log("上一个点击的标签: " + $(event.relatedTarget).html());
  });
```
这样就达到了我们所期望的啦～～～

以上的例子都是简化后的，具体`bootstrap`是如何使用的，可以参考他的[源码](https://github.com/twbs/bootstrap/blob/v3.3.7/js/tab.js)，或则我在看源码时的一些分析．[带有注释的源码](https://github.com/zimplexing/understanding-bootstrap/blob/master/tab.md)
