const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(__dirname));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('home')
})

app.get('/login', function(req, res){
    res.render('auth')
})

app.get('/signup', function(req,res){
    res.render('signup');
})

app.post('/login', function(req, res){
    console.log(req.body);
})

app.post('/signup', function(req,res){
    console.log("route is working")

    res.render('auth');
})

app.listen(PORT, console.log("Connected at Port " + PORT));