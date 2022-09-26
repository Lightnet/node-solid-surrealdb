

// https://stackoverflow.com/questions/25625412/chrome-extension-content-security-policy-executing-inline-code
//import html from "solid-js/html";
import h from "solid-js/h";
import { createSignal, onCleanup, onMount } from "solid-js";
import axios from 'axios';
//console.log(axios)
import SurrealDB from "surrealdb.js"
//console.log(SurrealDB);

export default function App(){
  const [count, setCount] = createSignal(0),
    timer = setInterval(() => setCount(count() + 1), 1000);
    onCleanup(() => clearInterval(timer));

  const [token, setToken] = createSignal('')

  function clickTest(){
    console.log("test");
  }
  // Fetch
  async function fetchRootUsers(){
    let query = "SELECT * FROM user;"
    let response = await fetch(`http://localhost:8000/sql`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'NS': 'test', // Specify the namespace
        'DB': 'test', // Specify the database
        "Authorization": 'Basic ' + btoa('root'+':'+'root')
      },
      body: query
    })
    let data = await response.json();
    console.log(data);
  }

  async function fetchSignIn(){
    console.log("sign in")
    try{
      let response = await fetch(`http://localhost:8000/signin`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          NS:'test',
          DB:'test',
          SC:'allusers',
          email:'test@test.test',
          pass:'pass'
        })
      })
      let data = await response.text();
      setToken(data)
      console.log(data);
    }catch(e){
      console.log(e)
    }
  }

  async function fetchSignUp(){
    let response = await fetch(`http://localhost:8000/signup`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        NS:'test',
        DB:'test',
        SC:'allusers',
        email:'test@test.test',
        pass:'pass'
      })
    })
    let data = await response.text();
    setToken(data)
    console.log(data);
  }

  async function fetchTokenQueryCreate(){
    let query = "SELECT * FROM user;"
    query = `CREATE todolist SET content = "Hello";`;
    console.log(token())
    let response = await fetch(`http://localhost:8000/sql`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'NS': 'test', // Specify the namespace
        'DB': 'test', // Specify the database
        //'SC': 'allusers',
        "Authorization": 'Bearer ' + token(),
      },
      body: query
    })
    let data = await response.json();
    console.log(data);
  }

  async function fetchTokenQueryList(){
    let query = "SELECT * FROM todolist;"
    //query = `CREATE todolist SET content = "Hello";`;
    console.log(token())
    let response = await fetch(`http://localhost:8000/sql`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'NS': 'test', // Specify the namespace
        'DB': 'test', // Specify the database
        //'SC': 'allusers',
        "Authorization": 'Bearer ' + token(),
      },
      body: query
    })
    let data = await response.json();
    console.log(data);
  }

  // XML
  function xmlSignUp(){
    let query = "SELECT * FROM user;"
    const xmlhttp = new XMLHttpRequest();
    const url='http://localhost:8000/signup';
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    //xmlhttp.setRequestHeader('NS', 'test');
    //xmlhttp.setRequestHeader('DB', 'test');
    //xmlhttp.setRequestHeader("Authorization", 'Basic ' + btoa('root'+':'+'root'));
    xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
      console.log(xmlhttp.status)
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //alert(xmlhttp.responseText);
        console.log(xmlhttp.responseText);
        setToken(xmlhttp.responseText)
      }
    }
    xmlhttp.send(JSON.stringify({
      NS:'test',
      DB:'test',
      SC:'allusers',
      email:'test@test.test',
      pass:'pass'
    }))
  }

  function xmlSignIn(){
    let query = "SELECT * FROM user;"
    const xmlhttp = new XMLHttpRequest();
    const url='http://localhost:8000/signin';
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    //xmlhttp.setRequestHeader('NS', 'test');
    //xmlhttp.setRequestHeader('DB', 'test');
    //xmlhttp.setRequestHeader("Authorization", 'Basic ' + btoa('root'+':'+'root'));
    xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
      console.log(xmlhttp.status)
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //alert(xmlhttp.responseText);
        console.log(xmlhttp.responseText);
        setToken(xmlhttp.responseText)
      }
    }
    xmlhttp.send(JSON.stringify({
      NS:'test',
      DB:'test',
      SC:'allusers',
      email:'test@test.test',
      pass:'pass'
    }))
  }

  function xmlQueryUser(){
    let query = "SELECT * FROM user;"
    const xmlhttp = new XMLHttpRequest();
    const url='http://localhost:8000/sql';
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.setRequestHeader('NS', 'test');
    xmlhttp.setRequestHeader('DB', 'test');
    xmlhttp.setRequestHeader("Authorization", 'Basic ' + btoa('root'+':'+'root'));
    xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
      console.log(xmlhttp.status)
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //alert(xmlhttp.responseText);
        //console.log(xmlhttp.responseText);
        console.log(JSON.stringify(JSON.parse(xmlhttp.responseText),null,2))
      }
    }
    xmlhttp.send(query)
  }

  function xmlTokenQueryCreate(){
    let query = '';
    //query = "SELECT * FROM user;"
    query = "CREATE todolist SET content = 'test';"
    //query = `SELECT * FROM todolist;`
    //query = `SELECT * FROM $auth;`
    const xmlhttp = new XMLHttpRequest();
    const url='http://localhost:8000/sql';
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.setRequestHeader('NS', 'test');
    xmlhttp.setRequestHeader('DB', 'test');
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + token());
    xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
      console.log(xmlhttp.status)
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log(`CREATE todolist SET content = "test";`);
        console.log(JSON.stringify(JSON.parse(xmlhttp.responseText),null,2))
      }
    }
    xmlhttp.send(query)
  }

  function xmlTokenQueryList(){
    let query = `SELECT * FROM todolist;`
    const xmlhttp = new XMLHttpRequest();
    const url='http://localhost:8000/sql';
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.setRequestHeader('NS', 'test');
    xmlhttp.setRequestHeader('DB', 'test');
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + token());
    xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
      console.log(xmlhttp.status)
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log("SELECT * FROM todolist;");
        console.log(JSON.stringify(JSON.parse(xmlhttp.responseText),null,2))
      }
    }
    xmlhttp.send(query)
  }

  // Axios
  function axiosQueryUser(){
    let query = "SELECT * FROM user;"
    axios.post('http://localhost:8000/sql', query, {
      headers: {
        'Content-Type': 'application/json',
        'NS':'test',
        'DB':'test',
        'Authorization': 'Basic ' + btoa('root'+':'+'root')
      },
      transformRequest: [function (data, headers) {//this is need else error 400
        // Do whatever you want to transform the data
        //console.log(data)
        return data;
      }],
    }).then(data=>{
      //console.log(data)
      console.log(data.data)
    }).catch(err=>{
      console.log(err)
      //console.log(err.code)
      //console.log(err.message)
    })
  }

  function axiosSignUp(){
    axios.post('http://localhost:8000/signup', {
      NS:'test',
      DB:'test',
      SC:'allusers',
      email:'test@test.test',
      pass:'pass'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      //transformRequest: [function (data, headers) {// not needed for signup
        // Do whatever you want to transform the data
        //console.log(data)
        //return data;
      //}],
    }).then(data=>{
      console.log(data)
      setToken(data.data)
    }).catch(err=>{
      console.log(err)
      console.log(err.code)
      console.log(err.message)
    })
  }

  function axiosSignIn(){
    axios.post('http://localhost:8000/signin', {
      NS:'test',
      DB:'test',
      SC:'allusers',
      email:'test@test.test',
      pass:'pass'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      //transformRequest: [function (data, headers) {// not needed for signin
        // Do whatever you want to transform the data
        //console.log(data)
        //return data;
      //}],
    }).then(data=>{
      console.log(data)
      setToken(data.data)
    }).catch(err=>{
      console.log(err)
      console.log(err.code)
      console.log(err.message)
    })
  }

  function axiosTokenQueryCreate(){
    let query = "CREATE todolist SET content = 'TestA';"
    axios.post('http://localhost:8000/sql', query, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token()
      },
      transformRequest: [function (data, headers) {//need to query sql
        // Do whatever you want to transform the data
        //console.log(data)
        return data;
      }],
    }).then(data=>{
      console.log(data)
    }).catch(err=>{
      console.log(err)
      console.log(err.code)
      console.log(err.message)
    })
  }

  function axiosTokenQueryList(){
    let query = "SELECT * FROM user;"
    query = "SELECT * FROM todolist;"
    axios.post('http://localhost:8000/sql', query, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token()
      },
      transformRequest: [function (data, headers) {//need to query sql
        // Do whatever you want to transform the data
        //console.log(data)
        return data;
      }],
    }).then(data=>{
      console.log(data.data)
    }).catch(err=>{
      console.log(err)
      console.log(err.code)
      console.log(err.message)
    })
  }

  // surrealdb.js
  async function surrealDBQuery(){
    const db = new SurrealDB("http://localhost:8000/rpc")
    //console.log(db)
    await db.use('test','test')
    await db.signin({
      user:"root",
      pass:"root"
    })
    let data = await db.query("SELECT * FROM user;")
    console.log(data)
    await db.close();
  }

  async function surrealDBSignIn(){
    const db = new SurrealDB("http://localhost:8000/rpc")
    //console.log(db)
    await db.use('test','test')
    await db.signin({
      NS:'test',
      DB:'test',
      SC:'allusers',
      email:'test@test.test',
      pass:'pass'
    })
    let data = await db.query("SELECT * FROM user;")
    console.log(data)
    await db.close();
  }

  async function surrealDBSignUp(){
    const db = new SurrealDB("http://localhost:8000/rpc")
    //console.log(db)
    await db.use('test','test')
    await db.signup({
      NS:'test',
      DB:'test',
      SC:'allusers',
      email:'test@test.test',
      pass:'pass'
    })
    let data = await db.query("SELECT * FROM user;")
    console.log(data)
    await db.close();
  }

  async function surrealDBCreate(){
    const db = new SurrealDB("http://localhost:8000/rpc")
    //console.log(db)
    await db.use('test','test')
    await db.signin({
      NS:'test',
      DB:'test',
      SC:'allusers',
      email:'test@test.test',
      pass:'pass'
    })
    let data = await db.query("CREATE todolist SET content = 'SDB hello!';")
    console.log(data)
    await db.close();
  }

  async function surrealDBList(){
    const db = new SurrealDB("http://localhost:8000/rpc")
    //console.log(db)
    await db.use('test','test')
    await db.signin({
      NS:'test',
      DB:'test',
      SC:'allusers',
      email:'test@test.test',
      pass:'pass'
    })
    let data = await db.query("SELECT * FROM todolist;")
    console.log(data)
    await db.close();
  }

  //onMount(()=>{
    //console.log(document)
    //document.getElementById("myButton").addEventListener("click", clickTest);
  //})

  let btnTest = h("button", {onclick:clickTest}, "Test");
  let div01 =h("div", btnTest);

  let btnfetch00 =h("button", {onclick:fetchRootUsers}, "Fetch Query User");
  let btnfetch01 =h("button", {onclick:fetchSignIn}, "Fetch Sign In");
  let btnfetch02 =h("button", {onclick:fetchSignUp}, "Fetch Sign Up");
  let btnfetch03 =h("button", {onclick:fetchTokenQueryCreate}, "Fetch Query Create");
  let btnfetch04 =h("button", {onclick:fetchTokenQueryList}, "Fetch Query List");
  let fetchQueryDiv =h("div", [btnfetch00, btnfetch01, btnfetch02, btnfetch03, btnfetch04]);

  let btnXml00 =h("button", {onclick:xmlQueryUser}, "XML Query User");
  let btnXml01 =h("button", {onclick:xmlSignIn}, "XML Sign In");
  let btnXml02 =h("button", {onclick:xmlSignUp}, "XML Sign Up");
  let btnXml03 =h("button", {onclick:xmlTokenQueryCreate}, "XML Query Create");
  let btnXml04 =h("button", {onclick:xmlTokenQueryList}, "XML Query List");
  let xmlQueryDiv =h("div", [btnXml00, btnXml01, btnXml02, btnXml03, btnXml04]);

  let btnAxios00 =h("button", {onclick:axiosQueryUser}, "Axios Query User");
  let btnAxios01 =h("button", {onclick:axiosSignIn}, "Axios Sign In");
  let btnAxios02 =h("button", {onclick:axiosSignUp}, "Axios Sign Up");
  let btnAxios03 =h("button", {onclick:axiosTokenQueryCreate}, "Axios Query Create");
  let btnAxios04 =h("button", {onclick:axiosTokenQueryList}, "Axios Query List");
  let axiosQueryDiv =h("div", [btnAxios00, btnAxios01, btnAxios02, btnAxios03, btnAxios04]);

  let btn0401 =h("button", {onclick:surrealDBQuery}, "SurrealDB Query User");
  let btn0402 =h("button", {onclick:surrealDBSignIn}, "SurrealDB Sign In");
  let btn0403 =h("button", {onclick:surrealDBSignUp}, "SurrealDB Sign Up");
  let btn0404 =h("button", {onclick:surrealDBCreate}, "SurrealDB Query Create");
  let btn0405 =h("button", {onclick:surrealDBList}, "SurrealDB Query List");
  let surrealDBDiv =h("div", [btn0401,btn0402,btn0403,btn0404, btn0405]);

  
  let el0501 =h("label", {}, " Query ");
  let el0502 =h("br", {});
  let el0503 =h("textarea", {});
  let el0504 =h("br", {});
  let el0505 =h("button", {},"Query");
  
  let queryDiv =h("div", {}, [el0501, el0502, el0503, el0504, el0505]);

  return h("div", {}
  , `count:`, count 
  , div01
  , fetchQueryDiv
  , xmlQueryDiv
  , axiosQueryDiv
  , surrealDBDiv
  , queryDiv
  );

  /*
  return (html`<div>
  <label>Count: ${count}</label>
  <div>
    <button id="myButton"> Test </button>
  </div>

  <div>
  <button id="fetchqueryuser"> Fetch Query User </button>
  <button id="fetchsigin"> Fetch Sign In </button>
  <button id="fetchsignup"> Fetch Sign In </button>
  <button id="fetchquery"> Fetch Query </button>
  </div>

  <div>
  <button id="xmlqueryuser"> XML Query User </button>
  <button id="xmlsignin"> XML Sign In </button>
  <button id="xmlsignin"> XML Sign In </button>
  <button id="xmlquery"> XML Query </button>
  </div>

  <div>
  <button id="axiosqueryuser"> Axios Query User </button>
  <button id="axiossignin"> Axios Sign In </button>
  <button id="axiossignup"> Axios Sign Up </button>
  <button id="axiosquery"> Axios Query </button>
  </div>

  <div>
    <label>Query</label><br/>
    <textarea /><br/>
    <button> set User </button>
    <button> Query </button>
  </div>
  
  </div>`);
  */
}