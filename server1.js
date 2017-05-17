'use strict';
const http=require('http');
const url=require('url');
const myModule=require('./myModule.js');
const fs=require('fs');
const path=require('path');
let mimes={
  '.html':'text/html',
  '.css':'text/css',
  '.js':'text/javascript',
  '.gif':'image/gif',
  '.jpg':'image/jpg',
  '.png': 'image/png'
}



console.log('__dirname',__dirname);
myModule();


function webserver(req,res){
  let baseURI=url.parse(req.url);
  let filepath=baseURI.pathname === '/' ? './index.htm' : baseURI.pathname;
  console.log(filepath);
  fs.access(filepath,fs.F_OK , error=>{
    if (!error){
        fs.readFile(filepath,(error,content)=>{
          if(!error){
            let contentType=mimes[path.extname(filepath)];
            res.writeHead(200,{'Content-Type':contentType});
            res.end(content,'utf-8');

          }else{
            res.writeHead(500);
            res.end('The server cannot read the file');
          }

        });
    }
    else{
      res.writeHead(404);
      res.end('Não encontrado');
    }

  })

}

http.createServer(webserver).listen(3000,()=>{
    console.log('Webserver running on port 3000');

});
