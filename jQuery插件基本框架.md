之前对于jquery插件都是出于半懂不懂的状态,特别是数据存储那块,一直没懂到底为什么要这么做.花了2个小时,慢慢理了下整个插件的运行方式.终于搞懂了插件的原理
```javascript
(function($){
  //构造函数
  var Demo = function(element,option){
    //这边两个参数是从 new Demo(this,option) 中传过来的
    this.$element = $(element);
    //这里用来合并默认参数和用户自定义参数
    this.options = $.extend({},this.defaults,option);
  };
  // 默认参数
  Demo.defaults = {
    say:'hello world'
  };
  //内部方法
  function internalFuc(){
    console.log('这是内部方法');
    //这边可以获取到合并后的options
    console.log(this.options);
  }
  //外部方法
  Demo.prototype.externalFnc = function (a,b) {
    console.log('这是外面方法');
    //这边可以获取到合并后的options
    console.log(this.options);
    if(a && b)  console.log('两个参数相加得: 'a+b);
  };

  function Plugin = function(option,params){
    return this.each(function(){
      var $this = $(this),
          data = $this.data('bs.demo');
          // options = typeof option === 'object' && option;
      //插件初始化后,将其对象存储起来,下次使用插件的时候,判断data时候有数据,如果有数据,则不需要重新初始化插件.若没有数据,则初始化插件
      //这边构造函数中一般可以传入参数(this,option),this指向的是当前遍历的DOM元素,option是外部调用该插件时,传入的自定义参数 <==> 和默认参数想对应,用来覆盖默认参数
      if(!data) $this.data('bs.demo',(data = new Demo(this,option)));
      //option为字符串时,即插件暴露在外面的方法名,直接调用.需要指定其作用域,和需要的参数
      if(typeof option === 'string') data[option].call($this,params);
    })
  }
  //将`demo`这个原型方法赋值给`old`,做一个备份,防止有其他插件名称也为`demo`,而造成冲突
  var old = $.fn.demo
  //对`demo`的原型方法赋值
  $.fn.demo             = Plugin
  //重新将`$.fn.demo`的`Constructor`指向为插件的构造函数`Demo`,因为`Constructor`可以被认为的修改掉
  $.fn.demo.Constructor = Demo
  //防止命名冲突
  $.fn.demo.noConflict = function () {
    $.fn.demo = old
    return this
 }
}(jQuery));
```
