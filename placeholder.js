/**
 * 兼容ie8,9 placeholder  Placeholder
 * @date 2016-06-08
 */
+function($) {
    'use strict';

    var Placehoder = function(element, option) {
        this.$element = $(element).find('[placeholder]').length ? $(element).find('[placeholder]') : $(element);
        this.options = $.extend({}, Placehoder.DEFAULTS, option);
        this.init();
    };

    Placehoder.DEFAULTS = {
        height: '100%',
        fontSize: '12px',
        color: '#aaa'
    };

    // 检测浏览器input是否支持 placeholder 属性
    function check() {
        return 'placeholder' in document.createElement('input');
    };

    // 进行兼容性处理
    Placehoder.prototype.init = function() {
        var _this = this;
        if (check()) return;
        // 遍历el元素下的所有input、textarea，添加 placeholder
        this.$element.each(function(index, element) {
            console.log(this);
            var $this = $(this),
                txt = $this.attr('placeholder');
            if ($this.val()) return;
            // 为input、textarea包含一层父级元素
            $this.wrap($('<div class="placeholder"></div>')
                .css({
                    position: 'relative',
                    zoom: '1',
                    border: 'none',
                    background: 'none',
                    padding: 'none',
                    margin: 'none',
                    display:'inline-block',
                    height: _this.options.height,
                    lineHeight: _this.options.lineHeight
                }));

            // 计算 input、textarea 的元素属性，为span做定位用
            var pos = $this.position(),
                h = $this.outerHeight(true) + 'px',
                paddingleft = $this.css('padding-left');
            // 在IE9以下版本中显示 placeholder 文字
            var $holder = $('<span class="placeholder-text"></span>')
                .text(txt)
                .css({
                    position: 'absolute',
                    left: pos.left,
                    top: pos.top,
                    height: h,
                    lineHeight: h,
                    paddingLeft: paddingleft,
                    fontSize: _this.options.fontSize,
                    color: _this.options.color
                })
                .appendTo($this.parent());

            if($this[0].tagName === 'TEXTAREA') $holder.css('lineHeight','2');


            // input、textarea获取焦点则隐藏 placeholder 文字，失去焦点则显示
            $this.on('focusin', function() {
                $holder.hide();
            })
            $this.on('focusout', function() {
                if (!$this.val()) {
                    $holder.show();
                }
            })

            // input、textarea点击则隐藏placeholder文字
            $holder.on('click.pl', function() {
                $holder.hide();
                $this.focus();
            })
        });
    };

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this),
                options = typeof option == 'object' && option,
                data = $this.data('bs.placeholder');
            if (!data) $this.data('bs.placeholder', (data = new Placehoder(this, options)))

            if (typeof option === 'string') data[option]();
        });
    }

    var old = $.fn.placeholder;

    $.fn.placeholder = Plugin;

    $.fn.placeholder.noConflict = function() {
        $.fn.placeholder = old;
        return this;
    };

    $(document).on('ready.pl', function(){
        $("input[placeholder],textarea[placeholder]").placeholder();
    });

}(jQuery);
