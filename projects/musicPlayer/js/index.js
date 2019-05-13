var musicList = [
  {
    src: 'http://cloud.hunger-valley.com/music/玫瑰.mp3',
    title: '玫瑰',
    author: '贰佰',
    img: 'http://cloud.hunger-valley.com/17-9-22/28212907.jpg'
  },
  {
    src: 'http://cloud.hunger-valley.com/music/ifyou.mp3',
    title: 'IF YOU',
    author: 'Big Bang',
    img: 'http://cloud.hunger-valley.com/17-9-22/87786461.jpg'
  }
]

var cover = document.querySelector('.cover')
var backBtn = document.querySelector('.musicbox .back')
var playBtn = document.querySelector('.musicbox .play')
var forwardBtn = document.querySelector('.musicbox .forward')
var titleNode = document.querySelector('.musicbox .title')
var authorNode = document.querySelector('.musicbox .author')
var timeNode = document.querySelector('.musicbox .time')
var progressBarNode = document.querySelector('.musicbox .progress .bar')
var progressNowNode = document.querySelector('.musicbox .progress-now')
var musicListContainer = document.querySelector('.musicbox .list')

var timer
var music = new Audio()
music.autoplay = true
var musicIndex = 0

getMusic(function(list){
  list = musicList 
  setPlaylist(list)
  loadMusic(list[musicIndex])
})

playBtn.onclick = function() {
  var icon = this.querySelector('.fa')
  if (icon.classList.contains('fa-play')) {
    music.play()
  } else {
    music.pause()
  }
  icon.classList.toggle('fa-play')
  icon.classList.toggle('fa-pause')
}

forwardBtn.onclick = loadNextMusic
backBtn.onclick = loadLastMusic
music.onended = loadNextMusic
music.shouldUpdate = true

music.onplaying = function() {
  timer = setInterval(function() {
    updateProgress()
  }, 1000)
  console.log('play')
}

music.onpause = function() {
  console.log('pause')
  clearInterval(timer)
}

music.ontimeupdate = updateProgress
progressBarNode.onclick = function(e) {
  var percent = e.offsetX / parseInt(getComputedStyle(this).width)
  music.currentTime = percent * music.duration
  progressNowNode.style.width = percent * 100 + "%"
}

musicListContainer.onclick = function(e){
  if(e.target.tagName.toLowerCase() === 'li'){
    for(var i = 0; i < this.children.length; i++){
      if(this.children[i] === e.target){
        musicIndex = i
      }
    }
    console.log(musicIndex)
    loadMusic(musicList[musicIndex])
  }
}

function setPlaylist(musiclist){
  var container = document.createDocumentFragment()
  musiclist.forEach(function(musicObj){
    var node = document.createElement('li')
    node.innerText = musicObj.author + '-' + musicObj.title
    console.log(node)
    container.appendChild(node)
  })
  musicListContainer.appendChild(container)
}

function loadMusic(songObj) {
  music.src = songObj.src
  titleNode.innerText = songObj.title
  authorNode.innerText = songObj.author
  cover.style.backgroundImage = 'url(' + songObj.img + ')'
  for(var i = 0; i < musicListContainer.children.length; i++){
    musicListContainer.children[i].classList.remove('playing')
  }
  musicListContainer.children[musicIndex].classList.add('playing')
}

function loadNextMusic() {
  musicIndex++
  musicIndex = musicIndex % musicList.length
  loadMusic(musicList[musicIndex])
}

function loadLastMusic() {
  musicIndex--
  musicIndex = (musicIndex + musicList.length) % musicList.length
  loadMusic(musicList[musicIndex])
}

function updateProgress() {
  var percent = (music.currentTime / music.duration) * 100 + '%'
  progressNowNode.style.width = percent
  var minutes = parseInt(music.currentTime / 60)
  var seconds = parseInt(music.currentTime % 60) + ''
  seconds = seconds.length == 2 ? seconds : '0' + seconds
  timeNode.innerText = minutes + ':' + seconds
}

function getMusic(callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('get', '/music.json', true)
  xhr.onload = function() {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      callback(JSON.parse(this.responseText))
    }else {
      console.log('获取数据失败')
    }
  }
  xhr.onerror = function(){
    console.log('网络异常')
  }
  xhr.send()
}
