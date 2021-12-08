const { request } = require('express')
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

// endpoint for enrolling admin - this is called once
app.post('/enrollAdmin', async (req, res) => {
  console.log("\n - Enrolling admin")
  var result = await admin.enrollAdmin()
  res.send(result)
})

// endpoint for registering normal user
app.post('/enrollUser', async (req, res) => {
  console.log("\n - Enrolling user")
  var userName = req.body.userName
  var orgName = req.body.orgName
  var result = await user.registerUser(userName, orgName)
  res.send(result)
})

// endpoint for invoking transactions
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

// endpoint for querying data from blockchain
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

app.listen(port, () => {
  console.log(`Chating app listening at http://localhost:${port}`)
})