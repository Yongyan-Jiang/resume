var http = require('http')

var server = http.createServer(function (req,res){
  setTimeout(function(){
    res.setHeader('Content-Type','text/html; charset=utf-8')
    res.writeHead(404,'Not Found')
    res.write('<html><head><meta charset ="utf-8"/></head>')
    res.write('<body>')
    res.write('<h1>hello world</h1>')
    res.write('</body>')
    res.write('</html>')
    res.end()
  },2000)
})

server.listen(8080)





