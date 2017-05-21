'use strict';
const http=require('http');
const url=require('url');
const myModule=require('./myModule.js');
const fs=require('fs');
const path=require('path');
var Promise = require('es6-promise').Promise;

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


function fileAccess(filepath){
  return new Promise((resolve,reject)=>{
    fs.access(filepath,fs.F_OK , error=>{
      if (!error){
        resolve(filepath);
      }
      else{
        reject(error);
      }
    })
  });
}

function fileReader(filepath){
  return new Promise((resolve,reject)=>{
    fs.readFile(filepath,(error,content)=>{
      if(!error){
        resolve(content);

      }else{
        reject(error);
      }
    });
  })
}

function streamFile(filepath){
  return new Promise((resolve,reject)=>{
    let fileStream=fs.createReadStream(filepath);

    fileStream.on('open',()=>{
      resolve(fileStream);

    });

    fileStream.on('error',()=>{
      reject(error);
    });

  })
}


function webserver(req,res){
  let baseURI=url.parse(req.url);
  let filepath=baseURI.pathname === '/' ? './index.htm' : baseURI.pathname;
  let contentType=mimes[path.extname(filepath)];

  fileAccess(filepath)
    .then(fileReader)
    .then(content=> {
      res.writeHead(200,{'Content-Type':contentType});
      res.end(content,'utf-8');

    })
    .catch(error=>{
      res.writeHead(404);
      res.end(JSON.stringify(error));

    })


}

http.createServer(webserver).listen(3000,()=>{
    console.log('Webserver running on port 3000');

});
