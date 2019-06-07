var WaterFall = {

  init: function( $ct ){
    this.$ct = $ct;
    this.arrColHeight = [];
    this.bind();
    this.start();
  },

  bind: function(){
    var me = this,
        timer = null;
    $(window).on('resize', function(){
      if(timer){
        clearTimeout(timer)
      }
      timer = setTimeout(function() {
        me.start()
      }, 200)
    })
  },

  start: function($nodes){
    var me = this;
    this.$items = this.$ct.find('.item');
    if(this.$items.length ===0) return;
    this.itemWidth = this.$items.outerWidth(true);
    this.$ct.width('auto');
    this.colNum = Math.floor( this.$ct.width() / this.itemWidth );
    this.$ct.width(this.itemWidth*this.colNum);
    if(this.arrColHeight.length === 0 || !$nodes){
      this.arrColHeight = [];
      for(var i=0; i<this.colNum; i++){
        this.arrColHeight[i] = 0;
      }	
    }
    if($nodes){
      //console.log(this.arrColHeight.length)
      $nodes.each(function(){
        var $item = $(this);
        $item.find('img').on('load', function(){
          me.placeItem( $item );
          me.$ct.height( Math.max.apply(null, me.arrColHeight) );
        })
      });	
    }else{
      this.$items.each(function(){
        var $item = $(this);
        me.placeItem( $item );
      });
      console.log(me.arrColHeight);
      me.$ct.height( Math.max.apply(null, me.arrColHeight) );	
    }
    
  },

  placeItem: function( $el ) {
    // 1. 找到arrColHeight的最小值，得到是第几列
    // 2. 元素left的值是 列数*宽度
    // 3. 元素top的值是 最小值
    // 4. 放置元素的位置，把arrColHeight对应的列数的值加上当前元素的高度
    var obj = this.getIndexOfMin(this.arrColHeight),
        idx = obj.idx,
        min = obj.min;
    $el.css({
      left: idx * this.itemWidth,
      top: min
    });
    this.arrColHeight[idx] += $el.outerHeight(true);
  },

  getIndexOfMin: function( arr ){
    var min = arr[0],
      idx = 0;
    for(var i = 1; i< arr.length; i++){
      if(min > arr[i]){
        min = arr[i];
        idx = i;
      }
    }
    return {min: min, idx: idx};
  }
}