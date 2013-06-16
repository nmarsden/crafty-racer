var express = require('express');
var app = express();
app.use(express.static(__dirname + '/build'));
app.use(express.favicon("build/assets/images/favicon.ico"));

app.listen(process.env.PORT || 5000);
