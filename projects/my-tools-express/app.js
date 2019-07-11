var express = require('./lib/express')
var path = require('path')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mimeType = require('./lib/mime')


var app = express()


app.use(urlencodedParser)
app.use(mimeType)
app.use(express.static(path.join(__dirname, 'static')))
//设置模板引擎目录
app.set('views', path.join(__dirname, 'views'))

//中间件
app.use(function(req, res, next) {
  console.log('middleware 1')
  next()
})

app.use(function(req, res, next) {
  console.log('middleware 2')
  next()
})

//动态路由
app.use('/hello', function(req, res){
  console.log('/hello..')
  res.send('hello world')
})

app.use('/getWeather', function(req, res){
  res.send({url:'/getWeather', city: req.query.city})
})

app.use('/search', function(req, res){
  res.send(req.body)
})

//模板引擎
app.use('/about', function(req, res){
  res.render('about.html', {
    title: 'Resume',
    name: 'Jiang',
    age: '25',
    intro: 'https://github.com/Yongyan-Jiang/resume'
  })
})

app.use(function(req, res){
  res.send(404, 'haha Not Found')
})


module.exports = app