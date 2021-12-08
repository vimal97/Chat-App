const { request } = require('express')
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));
const port = 3000
const admin = require("./enrollAdmin")
const user = require("./registerUser")

// endpoint for enrolling admin - this is called once
app.post('/enrollAdmin', async (req, res) => {
    var result = await admin.enrollAdmin()
    res.send(result)
})

// endpoint for registering normal user
app.post('/enrollUser', async (req, res) => {
    var userName = req.body.userName
    var orgName = req.body.orgName
    var result = await user.registerUser(userName, orgName)
    res.send(result)
})

app.listen(port, () => {
  console.log(`Chating app listening at http://localhost:${port}`)
})