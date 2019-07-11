var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

function staticRoot(staticPath, req, res){
  var pathObj = url.parse(req.url,true)
  if(pathObj.pathname === '/'){
    pathObj.pathname += 'index.html'
  }

  var filePath = path.join(staticPath,pathObj.pathname)

  fs.readFile(filePath,'binary',function(err,fileContent){
    if(err){
      console.log('404')
      res.writeHead(404,'not found')
      res.end('<h1>404 Not Found</h1>')
    }else{
      console.log('ok')
      res.writeHead(200,'OK')
      res.write(fileContent,'binary')
      res.end()
    }
  })
}

var server = http.createServer(function(req,res){
  staticRoot(path.join(__dirname,'static'), req, res)
})

console.log('visit http://localhost:8080')
server.listen(8080)


