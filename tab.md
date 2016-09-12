插件主体结构都差不多,在[dropdown](https://github.com/zimplexing/understanding-bootstrap/blob/master/dropdownjs.md)插件中我已经写过一些解析了.
```javascript
+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }
  //版本号
  Tab.VERSION = '3.3.7'
  //动画过度时间
  Tab.TRANSITION_DURATION = 150
  //外部方法,显示tab标签与面板
  Tab.prototype.show = function () {}
  //切换导航的样式
  Tab.prototype.activate = function (element, container, callback) {}

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab
  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }

  // TAB DATA-API
  // ============
  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }
  //初始化时,绑定默认事件
  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

```
##### show()
这边涉及到trigger的使用方法可以参考 [官网API](http://api.jquery.com/trigger/#trigger-event-extraParameters)
```javascript
Tab.prototype.show = function () {
  var $this    = this.element
  //排除是下拉菜单的ul标签
  var $ul      = $this.closest('ul:not(.dropdown-menu)')
  var selector = $this.data('target')

  if (!selector) {
    selector = $this.attr('href')
    selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
  }
  //如果点击的标签是当前显示的标签页,则直接返回,不进行切换
  if ($this.parent('li').hasClass('active')) return
  //前一个显示的tab标签
  var $previous = $ul.find('.active:last a')
  //绑定`hide.bs.tab`这个事件
  var hideEvent = $.Event('hide.bs.tab', {
    relatedTarget: $this[0]  //将当前触发事件的元素设置为relatedTarget
  })
  //绑定`show.bs.tab`这个事件
  var showEvent = $.Event('show.bs.tab', {
    relatedTarget: $previous[0] //将触发事件的前一个有`active`的a标签设置为relatedTarget
  })
  //前一个tab标签触发隐藏事件(hide.bs.tab)
  $previous.trigger(hideEvent)
  //当前tab标签触发显示事件(show.bs.tab)
  $this.trigger(showEvent)
  //如果showEvent和hideEvent已经调用了阻止默认事件,则直接返回
  if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

  var $target = $(selector)
  //给当前tab标签添加active类
  this.activate($this.closest('li'), $ul)
  //切换与tab对应的面板(panel)
  this.activate($target, $target.parent(), function () {
    $previous.trigger({
      type: 'hidden.bs.tab',
      relatedTarget: $this[0]
    })
    $this.trigger({
      type: 'shown.bs.tab',
      relatedTarget: $previous[0]
    })
  })
}
```
##### activate()
这个方法用于标签的`.active`的操作
```javascript
Tab.prototype.activate = function (element, container, callback) {
  //选择含有.active的子元素(这边可以理解为上一个有.active的标签)
  var $active    = container.find('> .active')
  //判断是否使用动画(只有在面板切换时,才会有动画效果)
  var transition = callback
    && $.support.transition
    && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

  function next() {
    $active
      .removeClass('active')
      //去除下拉菜单中的.active
      .find('> .dropdown-menu > .active')
        .removeClass('active')
      .end()
      //针对tab标签
      .find('[data-toggle="tab"]')
        .attr('aria-expanded', false)

    element //这个是当前要切换的标签(tab或者panel)
      .addClass('active')
      //针对tab标签
      .find('[data-toggle="tab"]')
        .attr('aria-expanded', true)

    if (transition) {
      //重新绘制页面
      element[0].offsetWidth // reflow for transition
      element.addClass('in')
    } else {
      element.removeClass('fade')
    }
    //点击的元素为下拉菜单的选项时,给其加上.active
    if (element.parent('.dropdown-menu').length) {
      element
        .closest('li.dropdown')
          .addClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)
    }
    //若有回调函数,则执行回调函数
    callback && callback()
  }
  //判断时候有动画,若有动画则执行动画,否则直接next()
  $active.length && transition ?
    $active
      .one('bsTransitionEnd', next)
      .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
    next()

  $active.removeClass('in')
}
```
