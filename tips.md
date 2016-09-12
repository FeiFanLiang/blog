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
#### ~~可以进行取整
```javascript
~~12.23 //12
~~-23.423 //-23
//相当于parseInt()
```
