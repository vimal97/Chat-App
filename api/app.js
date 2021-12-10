const { request } = require('express')
const http = require("http")
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));
const port = 3000
const admin = require("./enrollAdmin")
const user = require("./registerUser")
const invoke = require("./invoke")
const query = require("./query")
var pdf = require("pdf-creator-node");
const fs = require("fs")

// endpoint for enrolling Admin - this is called once
app.post('/enrollAdmin', async (req, res) => {
  console.log("\n - Enrolling admin")
  var result = await admin.enrollAdmin()
  res.send(result)
})

// endpoint for registering Broker and Client
app.post('/enrollUser', async (req, res) => {
  console.log("\n - Enrolling user")
  var userName = req.body.userName
  var orgName = req.body.orgName
  var result = await user.registerUser(userName, orgName)
  res.send(result)
})

// endpoint for invoking all transactions - CreateChat and UpdateChat
app.post('/invoke', async (req, res) => {
  console.log("\n - Invoke triggered")
  var userName = req.body.userName
  var channelName = req.body.channelName
  var chaincodeName = req.body.chaincodeName
  var functionName = req.body.functionName
  var args = req.body.args
  var result = await invoke.invokeChaincode(userName, channelName, chaincodeName, functionName, args)
  res.send(result)
})

// endpoint for querying data from blockchain - QueryAllChats, QueryChat
app.post('/query', async (req, res) => {
  console.log("\n - Query operation")
  var userName = req.body.userName
  var channelName = req.body.channelName
  var chaincodeName = req.body.chaincodeName
  var functionName = req.body.functionName
  var args = req.body.args
  var result = await query.queryChaincode(userName, channelName, chaincodeName, functionName, args)
  res.send(result)
})

// endpoint for downloading all the chats, only admin is allowed to perform this operations
app.get('/downloadChats', async (req, res) => {
  console.log("\n - Download chats by admin")
  var userName = req.query.userName
  var channelName = req.query.channelName
  var chaincodeName = req.query.chaincodeName
  var functionName = "QueryAllChats"
  var args = ["admin@gmail.com"]
  var result = await query.queryChaincode(userName, channelName, chaincodeName, functionName, args)
  if(result.success == true){
    var html = fs.readFileSync("./pdfs/template.html", "utf8");
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm"
    }
    var datetime = new Date();
    datetime = datetime.toISOString().slice(0,10)
    var document = {
      html: html,
      data: {
        chats: JSON.parse(result.data),
      },
      path: `./pdfs/${datetime}.pdf`,
      type: "",
    };
    await pdf.create(document, options)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
        res.download(`./pdfs/${datetime}.pdf`)

  } else {
    res.send(result.message)
  }
})

app.listen(port, () => {
  console.log(`**********************************************\nChating app listening at http://localhost:${port}\n\n**********************************************\n`)
})