var Exposure = {

  init: function($target, handler) {

    this.$c = $(window)
    this.$target = $target
    this.handler = handler

    this.bind()
    this.checkShow()
  },

  bind: function() {

    var me = this,
        timer = null,
        interval = 100;

    $(window).on('scroll', function(e) {
      //用户鼠标滚轮滚动一次，有多次事件响应。下面的 setTimeout 主要是为性能考虑，只在最后一次事件响应的时候执行 checkshow
      if(timer){
        clearTimeout(timer)
      }
      timer = setTimeout(function() {
        me.checkShow()
      }, interval)
    })
  },

  checkShow: function() {
    var me = this;
    this.$target.each(function() {
      var $cur = $(this);
      if ( me.isShow($cur) ) {
        me.handler(this);
        $cur.data('loaded', true);
      }
    });
  },

  isShow: function($el) {

    var scrollH = this.$c.scrollTop(),
        winH = this.$c.height(),
        top = $el.offset().top;

    if (top < winH + scrollH) {
      return true;
    } else {
      return false;
    }
  },

  hasLoaded: function($el) {
    if ($el.data('loaded')) {
      return true;
    } else {
      return false;
    }
  }

}