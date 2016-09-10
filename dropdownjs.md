#### `bootstrap`插件的事件绑定机制
在`bootstrap`中,如果通过特定的`html`结构,能够自动绑定和触发其相应的组件的事件,这主要得益于`bootstrap`组件都是自执行的,也就是在`js`首次加载的时候就会通过特定的选择器来绑定事件.
```javascript
+function($){
  // 通过jQuery的事件委托机制和事件命名进行绑定事件
  // ===================================
  $(document)
    //关闭所有的下拉菜单
    .on('click.bs.dropdown.data-api', clearMenus)
    //对下拉菜单中的form表单阻止冒泡
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    //切换下拉菜单的打开与关闭
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    //给下拉的按钮绑定键盘事件
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    //给下拉的菜单绑定键盘事件
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)
}(jQuery);
```
因为`bootstrap`组件在初始化的时候绑定事件的时候用到了事件的命名空间`data-api`所以如果如果不需要该事件,可以手动删除该事件
```javascript
$(document).off('click.data-api')
```
这样在删除该`click`事件时,不会影响到自定义的`click`事件.但是不会再触发`bootstrap`的默认事件了.

通过事件命名空间的方式绑定事件,还有一个好处是:可以手动触发其相关的事件
```javascript
$('#dropdownMenu').trigger('click.data-api')
```
#### `dropdown.js`源码分析
```javascript
//一个自执行的函数('+'将函数定义转化为表达式)
+function ($){
  var backdrop = '.dropdown-backdrop' //下拉时背景,但是这个一般在移动端使用
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }
  /*********内部方法*********/
  //获取下拉菜单的父级元素
  function getParent($this) {};
  //清理所有的下拉菜单(关闭)
  function clearMenus(e) {}
  /****************************/
  /*******外部方法************/
  //切换下拉菜单的开关
  Dropdown.prototype.toggle = function (e) {}
  //利用按键进行控制下拉菜单
  Dropdown.prototype.keydown = function (e) {}
  /*************************/

  // 定义dropdown插件
// ==========================
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown
  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown
  // 防冲突处理
  // ====================
  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }
  // 初始化绑定事件
  // ===================================
  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)
  Dropdown.VERSION = '3.3.7'
  }(Jquery);
```
以上是dropdown插件基本骨架,接下来主要分析下他主要的两个内部方法和两个外部方法
###### getParent()
```javascript
  function getParent($this) {
    //如果有`data-target`属性,那么该元素为其父元素
    var selector = $this.attr('data-target')
    //没有设置`data-target`
    if (!selector) {
      //是否有`href`属性,有的话,该元素指定为其父元素
      selector = $this.attr('href')
      //对url进行处理
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }
    var $parent = selector && $(selector)
    //返回其父级元素
    return $parent && $parent.length ? $parent : $this.parent()
  }
```
##### clearMenus()
这里用到了jQuery的[$.event](http://www.cnblogs.com/ip128/p/4570394.html)
```javascript
  function clearMenus(e) {
   if (e && e.which === 3) return  //这个具体什么作用还未知 - -
   $(backdrop).remove() //移除背景
   //遍历所有的`dropdown`,并关闭
   $(toggle).each(function () {
     var $this         = $(this)
     var $parent       = getParent($this)
     //对应事件的目标DOM元素
     var relatedTarget = { relatedTarget: this }
     //若菜单为关闭状态,直接返回
     if (!$parent.hasClass('open')) return
     //判断点击的时候为下拉菜单中的input和textarea,不关闭菜单
     if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return
     //关闭前,触发hide事件(暴露在外的方法:hide.bs.dropdown)
     $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
     //用于判断是否已经调用过event.preventDefault()函数。
     if (e.isDefaultPrevented()) return
     $this.attr('aria-expanded', 'false')
     //关闭后,触发hidden事件(暴露在外的方法:hidden.bs.dropdown)
     $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
   })
  }
```
##### toggle()
```javascript
  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)
    //处于禁用状态,直接返回
    if ($this.is('.disabled, :disabled')) return
    //获取其父级元素
    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')
    //关闭所有打开的下拉菜单
    clearMenus()

    if (!isActive) {
      //支持ontouchstart属性,且不是导航栏中的下拉菜单
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // 如果是移动端,我们使用`backdrop`,因为移动设备不支持事件委托
        // .dropdown-backdrop {
        //   position: fixed;
        //   top: 0;
        //   right: 0;
        //   bottom: 0;
        //   left: 0;
        //   z-index: 990;
        // }
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }
      //对应事件的目标DOM元素
      var relatedTarget = { relatedTarget: this }
      //打开前,触发show事件(暴露在外的方法:show.bs.dropdown)
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      //isDefaultPrevented()用于判断是否已经调用过event.preventDefault()函数。
      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus') //触发了button的focus事件
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')  //切换open class类
      //打开前,触发shown事件(暴露在外的方法:shown.bs.dropdown)
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }
    //阻止默认事件
    return false
  }
```
##### keydown()
```javascript
  Dropdown.prototype.keydown = function (e) {
    //38:↑ 40:↓ 27:ESC 32: 空格键
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault() //阻止默认事件
    e.stopPropagation() //阻止冒泡

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')
    // 未打开且不是ESC键 或者 已打开且是ESC键
    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      //如果是ESC键,触发focus事件 (我觉得应该不用触发focus事件)
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    //下拉菜单中可见且不是禁用状态下`a`标签
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return
    //当前元素相对于`a`标签的位置  
    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    //若index为负时,将index置为0(一般不会出现,针对特殊情况处理)  
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }
```
