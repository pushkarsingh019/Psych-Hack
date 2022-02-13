const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(__dirname));
app.set('view engine', 'ejs');

// Variables

let users  = [
    {
        user : "admin",
        password : "5083"
    },
]

// Functions

function authenticate(username, password){
    let flag = 0;
    username = username.toLowerCase();
    // password = password.toLowerCase();

    console.log("Entered details -->" + username + "password -->  " + password );

    for(let index = 0; index<users.length; index++){
        if(users[index].user === username && users[index].password === password){
            flag = 1;
            break;
        }
        else{
            flag = 0;
        }
    }

    return flag;
}

// routing

app.get('/', function(req, res){
    res.render('home')
})

app.get('/login', function(req, res){
    res.render('auth')
})

app.get('/signup', function(req,res){
    res.render('signup');
})

app.get('/dashboard', function(req, res){
    res.render('dashboard');
})

app.get('/fail', function(req,res){
    res.render('fail');
})

// post methods

app.post('/login', function(req, res){
    let loginObj = JSON.parse(JSON.stringify(req.body));

    let enteredEmail = loginObj.email;
    let enteredPass = loginObj.password;

    const auth = authenticate(enteredEmail, enteredPass);

    if(auth === 1){
        res.redirect('dashboard')
    }
    else if(auth === 0){
        res.redirect('fail')
    }
    else{
        res.send("something went wrong");
    }

})

app.post('/signup', function(req,res){
    let obj = JSON.parse(JSON.stringify(req.body));
    let userEmail = obj.email;
    let userPass = obj.password;

    // making sure everything is in lowercase
    userEmail = userEmail.toLowerCase();
    // userPass = userPass.toLowerCase();

    users.push({
        user : userEmail,
        password : userPass
    })

    console.log(users);

    res.render('auth');
})

app.listen(PORT, console.log("Connected at Port " + PORT));