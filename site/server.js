'use strict';

var express = require("express");
var app = express();
var path = __dirname + '/public/';

app.use(express.static(path));

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
