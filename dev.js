/*
  Information:
    - Solid-js 
    - Babeljs
    - Nodejs API
    - http web server.
*/

//import { WebSocketServer } from 'ws';
import http from 'http';
import fs,{readFileSync} from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Babel from '@babel/standalone';
import solid from 'babel-preset-solid';
import fetch from 'node-fetch';

const PORT = process.env.PORT || 1337;
const __dirname = dirname(fileURLToPath(import.meta.url));
Babel.registerPreset("solid", solid());

function checkFileExistsSync(filepath){
  let flag = true;
  try{
    fs.accessSync(filepath, fs.constants.F_OK);
  }catch(e){
    flag = false;
  }
  return flag;
}

function textToBase64(params){
	return Buffer.from(params).toString('base64');//note it think of nodejs in vscode IDE, this is brower api
}

async function queryDB(){
	let result;
	let query;

	query = `INFO FOR DB;`;
	result = await fetchQuerySQL(query)
	//console.log(result)
	console.log(result[0].result.sc)
	console.log(result[0].result.tb)
}

async function fetchQuerySQL(query){
	let response = await fetch('http://localhost:8000/sql',{
		method:'POST',
		headers:{
			"Authorization": 'Basic ' + textToBase64('root'+':'+'root') ,
			"NS": "test",
			"DB": "test",
			"Content-Type":"application/json"
		},
		body:query
	})
	let data = await response.json();
	return data;
}

async function tokenQuerySQL(token, query){
  let response = await fetch(`http://localhost:8000/sql`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'NS': 'test', // Specify the namespace
      'DB': 'test', // Specify the database
      "Authorization": 'Bearer ' + token ,
    },
    body: query,
  })

  let data = await response.json();
  //console.log(data);
  return data;
}

async function setupUser(){
	let result;
	let query;
//SET UP SCHEMA
query = `
DEFINE TABLE user SCHEMALESS
  PERMISSIONS
    FOR select, update WHERE user = $auth.id,
    FOR create, delete NONE;
DEFINE INDEX idx_email ON user COLUMNS email UNIQUE;
DEFINE FIELD created ON TABLE user TYPE datetime VALUE $before OR time::now();
DEFINE FIELD updated ON TABLE user TYPE datetime VALUE time::now();
--DEFINE FIELD pass ON TABLE user TYPE string;
--DEFINE FIELD email ON TABLE user TYPE string;
--DEFINE FIELD alias ON TABLE user TYPE string;
--DEFINE FIELD role ON TABLE user TYPE string;
`;
result = await fetchQuerySQL(query)
console.log(result)

// USER ACCESS SCOPE
query = `
DEFINE SCOPE allusers
	SESSION 14d
	SIGNUP ( CREATE user SET email = $email, pass = crypto::argon2::generate($pass), alias = $alias, role = "allusers" )
	SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass) );`;
result = await fetchQuerySQL(query)
console.log(result)
}


async function setupToDoList(){
  let data;
  let query;

//query = `DEFINE TABLE todolist SCHEMALESS;`;//set up table without permission for testing. Else error no table.
//data = await fetchQuerySQL(query)
//console.log(data)

/*
query = 
`DEFINE TABLE todolist SCHEMALESS
  PERMISSIONS
    FOR select WHERE user = $auth.id,
    FOR create, update
      WHERE user = $auth.id,
    FOR delete
      WHERE user = $auth.id;
`;
*/
/*
query = 
`USE NS test DB test;
DEFINE TABLE todolist SCHEMALESS
  PERMISSIONS NONE;
`;
*/
query = 
`USE NS test DB test;
DEFINE TABLE todolist SCHEMALESS;
`;
data = await fetchQuerySQL(query)
console.log(data)

query = `USE NS test DB test;
DEFINE FIELD update ON TABLE todolist TYPE datetime VALUE $before OR time::now();
DEFINE FIELD created ON TABLE todolist TYPE datetime VALUE time::now();
`;
data = await fetchQuerySQL(query)
console.log(data)

}

async function setUpDatabase(){
  await setupUser();
  await setupToDoList();
}

setUpDatabase();

function headerJS(response,text){
  //response.writeHead(200, {'Content-Type': 'text/javascript'});
  response.writeHead(200, {'Content-Type': 'text/javascript','Content-Length':text.length});
  response.write(text);
  response.end();
}

var server = http.createServer(function(request, response) {

  //check for url 

  if(request.url == "/"){
    //console.log("INDEX...")
    fs.readFile('./index.html',function (err, data){
      response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
      response.write(data);
      response.end();
    });
    return;
  }

  if(request.url == "/test.jsx"){
    //console.log("INDEX...")
    //var input = 'const getMessage = () => <div>"Hello World";</div>';
    var input = 'const getMessage = () => "Hello World";';
    var output = Babel.transform(input,{presets: ["solid"]}).code;
    console.log(output)
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    response.write(output);
    response.end();
    return;
  }

  if(request.url.endsWith(".jsx")){
    //console.log("found jsx")
    //console.log(request.url)
    try{
      let output = readFileSync(join(__dirname, request.url));
      //console.log(output.toString())
      output = Babel.transform(output.toString(),{presets: ["solid"]}).code;
      headerJS(response, output)
      return;
    }catch(e){
      console.log(e)
    }
  }

  if(request.url.endsWith(".js")){
    //console.log("found css")
    //console.log(request.url)
    try{
      //let output = readFileSync(join(__dirname, request.url));
      fs.readFile(join(__dirname, request.url),function (err, data){
        headerJS(response, data)
      });
      return;
    }catch(e){
      console.log(e)
    }
  }

  if(request.url.endsWith(".css")){
    //console.log("found css")
    //console.log(request.url)
    try{
      //let output = readFileSync(join(__dirname, request.url));
      fs.readFile(join(__dirname, request.url),function (err, data){
        response.writeHead(200, {'Content-Type': 'text/css','Content-Length':data.length});
        response.write(data);
        response.end();
      });
      return;
    }catch(e){
      console.log(e)
    }
  }
  
  if(request.url.indexOf("/components/") == 0){
    //console.log(request.url)
    //console.log(request.url.indexOf("/components/"))
    let ext = ".jsx";
    let checkJSX = checkFileExistsSync(join(__dirname, request.url)+".jsx")
    if(checkJSX){
      ext = ".jsx";
    }
    let checkJS = checkFileExistsSync(join(__dirname, request.url)+".js")
    if(checkJS){
      ext = ".js";
    }
    console.log("EXT:", ext)
    if(checkJSX){
      try{
        let output = readFileSync(join(__dirname, request.url+ext));
        //console.log(output.toString())
        output = Babel.transform(output.toString(),{presets: ["solid"]}).code;
        headerJS(response, output)
        return;
      }catch(e){
        console.log(e)
      }
    }
    if(checkJS){
      try{
        //let output = readFileSync(join(__dirname, request.url));
        fs.readFile(join(__dirname, request.url+ext),function (err, data){
          headerJS(response, data)
        });
        return;
      }catch(e){
        console.log(e)
      }
    }

  }

  response.end("Error");
});

server.listen(PORT, function() {
  console.log((new Date()) + `\nServer is listening on port http://localhost:${PORT}`);
});