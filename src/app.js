var express  = require("express");

var app = express();

app.use(('/dashboard'),(req,res) => {
    res.send("Hello from dashboard");
})

app.use(('/profile'),(req,res) => {
    res.send("Hello from profile");
})

app.use(('/admin'),(req,res) => {
    res.send("Hello from admin");
})

app.use(('/'),(req,res) => {
    res.send("Hello from Home");
})

app.listen(7777);