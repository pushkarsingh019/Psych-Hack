const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { Router } = require('express');
const lodash = require('lodash');

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

let posts = [];

// Functions

function authenticate(username, password){
    let flag = 0;
    username = username.toLowerCase();
    // password = password.toLowerCase();

    // console.log("Entered details -->" + username + "password -->  " + password );

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
    res.render('home', {posts : posts});
})

app.get('/login', function(req, res){
    res.render('auth')
})

app.get('/signup', function(req,res){
    res.render('signup');
})

app.get('/dashboard', function(req, res){
    res.render('dashboard', {posts : posts});
})

app.get('/fail', function(req,res){
    res.render('fail');
})

app.get('/compose', function(req,res){
    res.render('compose');
})

app.get('/posts/:entryTitle', function(req, res){
    let requestedTitle = req.params.entryTitle;
    requestedTitle = String(lodash.lowerCase(requestedTitle));

    posts.forEach(function(post) {
        let storedTitle = post.title;
        storedTitle = String(storedTitle);
        storedTitle = String(lodash.lowerCase(storedTitle));

        // console.log("Requested Title -->" + requestedTitle + " Stored Title --> " + storedTitle);

        if(storedTitle === requestedTitle){
            let postText = post.content;
             res.render("post", {requestedTitle : requestedTitle , postText : postText, post : post});
        }
    })
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

    // console.log(users);

    res.render('auth');
})

app.post('/compose', function(req,res){
    const postObj = JSON.parse(JSON.stringify(req.body));


    let postTitle = postObj.title;
    let postContent = postObj.post;

    // console.log(postObj);

    switch(postChoice){

        case "morning":
            // console.log("morning summary")

            let postDay = postObj.day;
            let gratitudeAnswer = postObj.gratitude;
            let greatDay = postObj.great;
            let highlightDay = postObj.highlight;

            morningReflection.push({
                day : postDay,
                gratitude : gratitudeAnswer,
                great : greatDay,
                highlight : highlightDay
            })
            console.log(morningReflection);
            break;


        case "evening":
            // console.log("evening summary")
            let threeAmazing = postObj.threeAmazingthings;
            let betterDay = postObj.betterDay;

            eveningReflection.push({
                threeThings : threeAmazing,
                betterDay :  postObj.betterDay
            })

            console.log(eveningReflection)

            break;
        case "free":
            // console.log("free writing");

            let postTitle = postObj.title;
            let postContent = postObj.post;
    }


    posts.push({
        title : postTitle,
        content : postContent
    })

    // console.log(posts);x
    res.redirect('dashboard')
})





// Listen

app.listen(PORT, console.log("Connected at Port " + PORT));