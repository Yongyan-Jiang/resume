var Helpers = {
  isToBottom: function($viewport, $content) {
    return $viewport.height() + $viewport.scrollTop() + 30 > $content.height() 
  }
}


var Paging = {
  init: function(){
    this.$tabs = $('footer>div')
    this.$pages = $('main>section')
    this.bind()
  },
  bind: function(){
    var _this = this
    this.$tabs.on('click', function(){
      var $this = $(this)
      var index = $this.index()
      $this.addClass('active')
           .siblings().removeClass('active')
      _this.$pages.eq(index).fadeIn().siblings().fadeOut()
    })
  }
}


var RepoBoard= {
  init: function(){
    var _this = this
    this.$container = $('#repo-board')
    this.$content = this.$container.find('.container')
    this.page = 1
    this.count = 30
    this.isFinished = false
    this.isLoading = false
    this.bind()
    this.getData(function(result){
      _this.renderData(result.data)
      _this.page++
    })
  },
  bind: function(){
    var _this = this
    this.$container.on('scroll', function(){
      console.log(_this.isLoading)
      if(Helpers.isToBottom(_this.$container, _this.$content) && !_this.isFinished && !_this.isLoading){
        _this.getData(function(result){
          _this.renderData(result.data)
          _this.page++
          if(_this.page * _this.count > result.data.total_count ) {
            _this.isFinished = true
          }
        })
      }
    })
  },
  getData: function(callback){
    var _this = this
    this.isLoading = true
    this.$container.find('.loading').show(400)
    $.ajax({
      url: 'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc',
      data: {
        page: this.page
      },
      dataType: 'jsonp'
    }).done(function(ret){
      _this.isLoading = false
      _this.$container.find('.loading').hide(400)
      callback(ret)
    })
  },
  renderData: function(data){
    var _this = this
    data.items.forEach(function(item, index){
      var $node = _this.createNode(item, (_this.page-1)*_this.count+index+1)
      _this.$content.append($node)    
    })
  },
  createNode: function(subject, index){
    var $node = $(`<div class="item">
<a href="https://github.com/TryGhost/Ghost">
<div class="order"><span>1</span></div>
<div class="detail">
<h2>Ghost</h2>
<div class="description">Knockout makes it easier to create rich, responsive UIs with JavaScript</div>
<div class="extra"><span class="star-count">4196</span>star</div>  
</div>
</a>
</div>`)
    $node.find('.order span').text(index)
    $node.find('a').attr('href', subject.html_url)    
    $node.find('.detail h2').text(subject.name)  
    $node.find('.detail .description').text(subject.description)
    $node.find('.detail .collection').text(subject.collect_count)  
    $node.find('.detail .star-count').text(subject.stargazers_count ) 
    return $node
  }
}


var UserBoard = {
  init: function(){
    var _this = this
    this.$container = $('#user-board')
    this.$content = this.$container.find('.container')
    this.page = 1
    this.count = 30
    this.isFinished = false
    this.isLoading = false
    this.bind()
    this.getData(function(result){
      _this.renderData(result.data)
      _this.page++
    })
  },
  bind: function(){
    var _this = this

    this.$container.on('scroll', function(){
      console.log(_this.isLoading)
      if(Helpers.isToBottom(_this.$container, _this.$content) && !_this.isFinished && !_this.isLoading){
        console.log('to bottom')
        _this.getData(function(result){
          _this.renderData(result.data)
          _this.page++
          if(_this.page * _this.count > result.data.total_count ) {
            _this.isFinished = true
          }
        })
      }
    })
  },
  getData: function(callback){
    var _this = this
    this.isLoading = true
    this.$container.find('.loading').show(400)
    $.ajax({
      url: 'https://api.github.com/search/users?q=followers:>1000+location:china+language:javascript',
      data: {
        page: this.page
      },
      dataType: 'jsonp'
    }).done(function(ret){
      _this.isLoading = false
      _this.$container.find('.loading').hide(400)
      callback(ret)
    })
  },
  renderData: function(data){
    var _this = this
    data.items.forEach(function(item, index){
      var $node = _this.createNode(item, (_this.page-1)*_this.count+index+1)
      _this.$content.append($node)    
    })
  },
  createNode: function(subject, index){
    var $node = $(`<div class="item">
<a href="https://github.com/TryGhost/Ghost">
<div class="cover"><img src="" alt=""></div>
<div class="detail">
<h2>Ghost </h2>
</a>
</div> `)
    $node.find('.cover img').attr('src', subject.avatar_url )
    $node.find('a').attr('href', subject.html_url )    
    $node.find('.detail h2').text(subject.login )  
    return $node
  }

}

var Search = {
  init: function() {
    this.page = 1
    this.count = 30
    this.isFinished = false
    this.isLoading = false
    this.$container = $('#search')
    this.$content = this.$container.find('.container')
    this.bind()
  },

  bind: function() {
    var _this = this
    this.$container.find('.search-area .button').on('click', function(){
      _this.getData(function(result){
        _this.renderData(result.data)
      })
    })
    console.log(this.$container.find('.search-area input'))
    this.$container.find('.search-area input').on('keyup', function(e){
      if(e.key === 'Enter') {
        _this.getData(function(result){
          _this.renderData(result.data)
        })
      }
    })

    this.$container.on('scroll', function(){
      console.log(_this.isLoading)
      if(Helpers.isToBottom(_this.$container, _this.$container.find('.wrap')) && !_this.isFinished && !_this.isLoading){
        console.log('to bottom')
        _this.getData(function(result){
          _this.renderData(result.data)
          _this.page++
          if(_this.page * _this.count > result.data.total_count) {
            _this.isFinished = true
          }

        })
      }
    })
  },

  getData: function(callback){
    var _this = this
    var keyword = this.$container.find('.search-area input').val()
    this.isLoading = true
    $.ajax({
      url: `https://api.github.com/search/repositories?q=${keyword}+language:javascript&sort=stars&order=desc&page=${_this.page}`,
      dataType: 'jsonp'
    }).done(function(ret){
      _this.isLoading = false
      callback(ret)
    })
  },

  renderData: function(data){
    var _this = this
    data.items.forEach(function(item, index){
      var $node = _this.createNode(item, (_this.page-1)*_this.count+index+1)
      _this.$content.append($node)    
    })
  },
  createNode: function(subject, index){
    var $node = $(`<div class="item">
<a href="https://github.com/TryGhost/Ghost">
<div class="order"><span>1</span></div>
<div class="detail">
<h2>Ghost </h2>
<div class="description">Knockout makes it easier to create rich, responsive UIs with JavaScript</div>
<div class="extra"><span class="star-count">4196</span> star</div>  
</div>
</a>
</div> `)
    $node.find('.order span').text(index)
    $node.find('a').attr('href', subject.html_url)    
    $node.find('.detail h2').text(subject.name)  
    $node.find('.detail .description').text(subject.description)
    $node.find('.detail .collection').text(subject.collect_count)  
    $node.find('.detail .star-count').text(subject.stargazers_count ) 
    return $node
  }
}


var App = {
  init: function(){
    Paging.init()
    RepoBoard.init()
    UserBoard.init()
    Search.init()
  }
}

App.init()