##### show()
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
  //
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

  this.activate($this.closest('li'), $ul)
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
