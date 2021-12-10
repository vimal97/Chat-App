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
// const pdf = require("pdfkit")
var pdf = require("pdf-creator-node");
const fs = require("fs")

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
    // const doc = new pdf.PDFDocument();
    // var datetime = new Date();
    // datetime = datetime.toISOString().slice(0,10)
    // doc.pipe(fs.createWriteStream(`./pdfs/${datetime}.pdf`))
    // doc.font("Helvetica")
    //    .fontSize(12)
    //    .text(JSON.stringify(JSON.parse(result.data), null, 4), 20, 20)
    // doc.end()
    // res.download(`./pdfs/Resume.pdf`)

    var html = fs.readFileSync("./pdfs/template.html", "utf8");
    var options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
      header: {
          height: "45mm",
          contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
      },
      footer: {
          height: "28mm",
          contents: {
              first: 'Cover page',
              2: 'Second page', // Any page number is working. 1-based index
              default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
              last: 'Last Page'
          }
      }
    };
    console.log("test ---", result.data)
    var document = {
      html: html,
      data: {
        chats: JSON.stringify(result.data),
      },
      path: "./pdfs/output.pdf",
      type: "",
    };
    pdf.create(document, options)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
        res.download(`./pdfs/output.pdf`)

  } else {
    res.send(result.message)
  }
})

app.listen(port, () => {
  console.log(`Chating app listening at http://localhost:${port}`)
})