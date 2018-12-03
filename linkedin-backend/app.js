var express = require('express');
const path = require('path');
var app = express();
var fs=require('file-system');
var session = require("express-session");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var users = require("./routes/users");
var applications = require("./routes/applications");
const multer = require("multer");
var jobs = require("./routes/jobs.js");
var search = require("./routes/search");
var uploadresume = require('./routes/uploadResume');
const redis = require('redis');

const url = "http://localhost:3000";
//const url = "hosting url";
app.use(cors({ origin: url, credentials: true }));

app.use(function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', url);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//redis client
// let client = redis.createClient(6379,'127.0.0.1');
// client.on('connect', function(){
//   console.log('connected to redis');
// })

app.use("/users", users);
app.use("/apply", applications);
app.use("/applications", applications);
app.use("/jobs", jobs);
app.use("/search", search);
app.use('/apply', applications);
app.use('/uploadresume', uploadresume);

app.get("/start", (request, response) => {
  response.status(200).json({
    msg: "Welcome to Linkedin"
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("req body " + JSON.stringify(req.body))
    console.log("applicant id passed in destination : " + req.body.applicant_id);
    console.log("selected file  : " + req.body.selectedFile);
    var currentFolder = 'public/resumeFolder/'+req.body.applicant_id+'/';
    fs.mkdir(currentFolder, function(err){
      if(!err) {
        console.log("no error : " + err);
        cb(null , currentFolder);
      } else {
         console.log("error : " + err);
        cb(null , currentFolder);
      }
    });
  },
  filename: function(req, file, cb){
  console.log("File to be uploaded : " + file.originalname);
  filename=Date.now()+'-'+file.originalname;
  cb(null, filename);
  }
});

const upload = multer({
  storage:storage,
  limits: {
    fileSize :1024*1024*5
  }
 });
app.post('/uploadresume', upload.single('selectedFile'), function(req, res, next){
  console.log("applicant id in uploadPhoto " + req.body.applicant_id)
  console.log("Filename " + filename)
    console.log("Inside photo upload Handler");
    res.writeHead(200,{
         'Content-Type' : 'text/plain'
        })
      res.end(JSON.stringify(filename))
});
var server = app.listen(3001, () => {
  console.log("Linkedin server has started to listen at http://localhost:3001");
});
