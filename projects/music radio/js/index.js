var EventCenter = {
  on: function(type, handler){
    $(document).on(type, handler)
  },
  fire: function(type, data){
    $(document).trigger(type, data)
  } 
}

var Footer = {
  init: function(){
    this.$footer = $('footer')
    this.$ul = this.$footer.find('ul')
    this.$box = this.$footer.find('.box')
    this.$leftBtn = this.$footer.find('.icon-left')
    this.$rightBtn = this.$footer.find('.icon-right')
    this.isToEnd = false
    this.isToStart = true
    this.animate = false
    this.bind()
    this.render()
  },

  bind: function(){
    var _this = this
    $(window).resize(function(){
      _this.setStyle()
    }) 
    
    this.$rightBtn.on('click',function(){
      if (_this.animate) return
      var itemWidth = _this.$box.find('li').outerWidth(true)
      var rowCount = Math.floor(_this.$box.width()/itemWidth)
      if(!_this.isToEnd){
        _this.animate = true
        _this.$ul.animate({
          left: '-=' + rowCount*itemWidth
        },400,function(){
          _this.animate = false
          _this.isToStart = false
          if(parseFloat(_this.$box.width()) - parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.css('width')) ){
            _this.isToEnd = true
          }
        })
      }
    })
    
    this.$leftBtn.on('click',function(){
      if (_this.animate) return
      var itemWidth = _this.$box.find('li').outerWidth(true)
      var rowCount = Math.floor(_this.$box.width()/itemWidth)
      if(!_this.isToStart){
        _this.animate = true
        _this.$ul.animate({
          left: '+=' + rowCount*itemWidth
        },400,function(){
          _this.animate = false
          _this.isToEnd = false
          if(parseFloat(_this.$ul.css('left')) >= 0 ){
            _this.isToStart = true
          }
        })
      }
    })

    this.$footer.on('click','li',function(){
      $(this).addClass('active')
             .siblings().removeClass('active')
      EventCenter.fire('select-album',{
        channelId: $(this).attr('data-channel-id'),
        channelName: $(this).attr('data-channel-name')
      })
    })
  },

  render(){
    var _this = this
    $.getJSON('//jirenguapi.applinzi.com/fm/getChannels.php')
      .done(function(ret){
        console.log(ret)
        _this.renderFooter(ret.channels)
      }).fail(function(){
        console.log('error')
      })
  },

  renderFooter: function(channels){
    console.log(channels)
    var html = ''
    channels.forEach(function(channel){
      html += '<li data-channel-id='+channel.channel_id+' data-channel-name='+channel.name+'>'
            + '  <div class="cover" style="background-image:url('+channel.cover_small+')"></div>'
            + '  <h3>'+channel.name+'</h3>'
            + '</li>'
    })
    this.$ul.html(html)
    this.setStyle()
  },

  setStyle: function(){
    var count = this.$ul.find('li').length
    var width = this.$ul.find('li').outerWidth(true)
    this.$ul.css({
      width: count*width + 'px'
    })
  }
}


var Fm = {
  init: function(){
    this.$container = $('#page-music')
    this.audio = new Audio()
    this.audio.autoplay = true
    this.bind()
  },
  
  bind: function(){
    var _this = this
    EventCenter.on('select-album',function(e,channeObj){
      _this.channelId = channeObj.channelId
      _this.channelName = channeObj.channelName
      _this.loadMusic()
    })

    this.$container.find('.btn-play').on('click',function(){
      var $btn = $(this)
      if($btn.hasClass('icon-play')){
        $btn.removeClass('icon-play').addClass('icon-pause')
        _this.audio.play()
      }else{
        $btn.removeClass('icon-pause').addClass('icon-play')
        _this.audio.pause()
      }
    })

    this.$container.find('.btn-next').on('click',function(){
      _this.loadMusic()
    })

    this.audio.addEventListener('play',function(){
      clearInterval(_this.statusclock)
      _this.statusclock = setInterval(function(){
        _this.updateStatus()
      },1000)
    })
    this.audio.addEventListener('pause',function(){
      clearInterval(_this.statusclock)
    })
  },

  loadMusic(){
    console.log('loadMusic...')
    var _this = this
    $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php',{channel: 'this.channelId'}).done(function(ret){
    //console.log(ret)
    _this.song = ret['song'][0] 
    _this.loadLyric()
    _this.setMusic() 
    })    
  },

  loadLyric(){
    var _this = this
    $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php', {sid: this.song.sid}).done(function(ret){
      //console.log(ret.lyric)
      var lyric = ret.lyric
      var lyricObj = {}
      lyric.split('\n').forEach(function(line){
        var times = line.match(/\d{2}:\d{2}/g)
        var str = line.replace(/\[.*\]/g,'')
        if ( Array.isArray(times) ){
          times.forEach(function(time){
            lyricObj[time] = str
          })
        }
      })
      _this.lyricObj = lyricObj
    })
  },

  setMusic(){
    console.log('setMusic...')
    //console.log(this.song)
    this.audio.src = this.song.url
    $('.bg').css('background-image','url('+this.song.picture+')')
    this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-pause')
    this.$container.find('.aside figure').css('background-image','url('+this.song.picture+')')
    this.$container.find('.tag').text(this.channelName)
    this.$container.find('.detail h1').text(this.song.title)
    this.$container.find('.detail .author').text(this.song.artist)
  },

  updateStatus(){
    var min = Math.floor(this.audio.currentTime/60)
    var sec =  Math.floor(this.audio.currentTime%60) + ''
    sec = sec.length===2 ? sec : '0'+sec
    this.$container.find('.current-time').text(min + ':' + sec)
    this.$container.find('.bar-progress').css('width',this.audio.currentTime/this.audio.duration*100 + '%')
    var line = this.lyricObj['0'+min+':'+sec]
    if(line){
      this.$container.find('.lyric p').text(line).boomText()
    }
  }
}

$.fn.boomText = function(type){
  type = type || 'rollIn'
  //console.log(type)
  this.html(function(){
    var arr = $(this).text().split('').map(function(word){
      return '<span class="boomText">'+ word + '</span>'
    })
    return arr.join('')
  })
  
  var index = 0
  var $boomTexts = $(this).find('span')
  var clock = setInterval(function(){
    $boomTexts.eq(index).addClass('animated ' + type)
    index++
    if(index >= $boomTexts.length){
      clearInterval(clock)
    }
  }, 300)
}


Footer.init()
Fm.init()