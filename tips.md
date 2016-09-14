#### $.contains(container, contained )
用于检测前者(DOM元素)是否包含后者(DOM元素),**两个参数都为`DOM`元素,不是`jQuery`对象**
***
#### trigger()
- 参数为事件类型 `.trigger( eventType [, extraParameters ] )`
```javascript
  $('li').on('click',function(event){
    console.log('xxxxx');
  });
  $('li').trigger('click');
  //有额外参数时
  $('li').on('click',function(event,param1,param2){
    console.log(param1 + "\n" + param2);
  });
  //只有一个参数时,可以不用数组
  $('li').trigger('click',['hello','world']);
```
- 参数为事件对象 `.trigger( event [, extraParameters ] )`
```javascript
  var  e = $.Event('hello');
  $('li').on('hello',function(){
    console.log('xxxxx');
  })
  $('li').trigger(e);
//有额外参数时,同上
```
- 参数为一个对象字面量时,其参数为event的属性
```javascript
  $('li').on('world',function(event){
    console.log(event.name); //zimplexing
  })
  $('li').trigger({
    type:"world",
    name:"zimplexing"
  })
```
***
#### 随机的是十六进制
```javascript
(Math.random().toString(16)+'000000').slice(2,8);
```
***
#### `~~`可以进行取整
```javascript
~~12.23 //12
~~-23.423 //-23
//相当于parseInt()
```
***
#### [on()](http://api.jquery.com/on/)
`.on( events [, selector ] [, data ], handler )`

一般的事件绑定,与`$().click()`没有什么区别
```javascript
  $('div').on('click',function(){
    console.log(this.tagName);
  })
```
事件委托
```javascript
  $('div').on('click','a',function(){
    console.log(this.tagName);
  })
```
事件委托,并且会进行冒泡.在冒泡的路径上与之匹配的都会触发绑定的事件(使用事件委托写的,冒泡的最顶端为直接绑定事件的元素)
```javascript
  $('li').on('click','.test',function(){
    console.log(this.tagName);
  })
```
`.on( events [, selector ] [, data ] )`

第二种传参方式
```javascript
  $('div').on({
    'click': function(){
      console.log(this.tagName);
    }
  })
```
events为对象,且进行事件委托
```javascript
  $('div').on({
    'click': function(){
      console.log(this.tagName);
    }
  },'.test')
```
阻止冒泡(只触发目标元素[当前点击的元素]绑定的事件)
```javascript
  $('div').on({
    'click': function(event){
      console.log(this.tagName);
      event.stopPropagation();
    }
  },'.test')
```
 当一个元素中绑定多个事件时,可以使用`stopImmediatePropagation()`,阻止其他事件触发
```javascript
  $('li').on('click','.test',function(event){
    console.log(this.tagName);
    event.stopImmediatePropagation()
  });
  $('li').on('click','.test',function(){
    console.log('handler1');
  });
  $('li').on('click','.test',function(){
    console.log('hanlder2');
  })
```
 阻止默认事件`event.preventDefault()`
```javascript
  $('li').on('click',function(event){
    console.log('before preventDefault');
    event.preventDefault();
  })
```
直接使用`return false`时,相当于调用了`preventDefault()`和`stopPropagation()`
```javascript
  $('div').on('click','.test',function(){
    console.log(this.tagName);
    return false;
  })
```
`handler` 传参数为`false`时
```javascript
  $( "a.disabled" ).on( "click", false );
  //相当于
  $( "a.disabled" ).on( "click", function(){
    return false;
  } );
```
`data`参数的用法,给`event`属性赋值还有可以参考`trigger()`方法
```javascript
  function greet( event ) {
    alert( "Hello " + event.data.name );
  }
  $( "li a" ).on( "click", {
    name: "Karl"
  }, greet );
```
