var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

var routes = {
  '/a': function(req,res){
    res.end(JSON.stringify(req.query))
  },
  '/b': function(req,res){
    res.end('match /b')
  },
  '/a/c': function(req,res){
    res.end('match /a/c')
  },
  '/search': function(req,res){
    res.end('username = ' + req.body.username + ',password = ' + req.body.password)
  }
}

var server = http.createServer(function(req,res){
  routePath(req,res)
})

console.log('visit http://localhost:8080')
server.listen(8080)


function routePath(req,res){
  var pathObj = url.parse(req.url,true)
  var routFn = routes[pathObj.pathname]
  if(routFn){
    console.log(pathObj)
    //get
    req.query = pathObj.query
    //post 
    var body = ''
    req.on('data',function(chunk){
      body += chunk
    }).on('end',function(){
      req.body = parseBody(body)
      routeFn(req,res)
    })
  }else{
    staticRoot(path.join(__dirname,'static'),req,res)
  }
}

function staticRoot(staticPath, req, res){
  var pathObj = url.parse(req.url,true)
  filePath = path.join(staticPath,pathObj.pathname)
  fs.readFile(filePath,'binary',function(err,fileContent){
    if(err){
      res.writeHead(404,'not found')
      res.write('<h1>404 Not Found</h1>')
      res.end()
    }else{
      res.writeHead(200,'Ok')
      res.write(fileContent,'binary')
      res.end()
    }
  })
}

function parseBody(body){
  //console.log(body)
  var obj = {}
  body.split('&').forEach(function(str){
    obj[str.split('=')[0]] = str.split('=')[1]
  })
  return obj
}





