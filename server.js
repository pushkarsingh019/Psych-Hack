const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { Router } = require('express');
const lodash = require('lodash');
const req = require('express/lib/request');

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
let morningReflection = [];
let eveningReflection = [];
let questionReflection = [];

let postChoice = "";
let displayPostChoice = "";

let stoicQuestion = "How can I rekindle my principles and start living today?";

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
    res.render('dashboard', {
        displayPostChoice : displayPostChoice,
        posts : posts,
        morningReflection : morningReflection,
        eveningReflection : eveningReflection,
        questionReflection : questionReflection,
    });
})

app.get('/fail', function(req,res){
    res.render('fail');
})

app.get('/compose', function(req,res){
    res.render('compose', {postChoice : postChoice, stoicQuestion : stoicQuestion});
})

app.get('/choice', function(req, res){
    res.render('choice')
})

// Learn more post routing functions 

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

app.get('/morning-reflection/:reflectionDay', function(req, res){
    let morningReflectionDay = req.params.reflectionDay;
    morningReflectionDay = String(lodash.lowerCase(morningReflectionDay));
    // console.log("tpyed morning reflection title ->" + morningReflectionDay);

    morningReflection.forEach(function(reflection){

        let storedReflectionDay = reflection.day;

        storedReflectionDay = String(lodash.lowerCase(storedReflectionDay));

        if(storedReflectionDay == morningReflectionDay ){
            res.render("mReflection", {reflection : reflection} )
        }

    

    })

})

app.get('/evening-reflection/:eReflectionDay', function(req, res){
    // res.send("routing is reaching the get server");

    let reflectionTitle  = req.params.eReflectionDay;
    reflectionTitle = String(lodash.lowerCase(reflectionTitle));

    // console.log("Typed title --> " + reflectionTitle);

    eveningReflection.forEach(function(reflection){
        let storedEveningReflection = reflection.day;
        storedEveningReflection = String(lodash.lowerCase(storedEveningReflection));
        // console.log("Stored title --> " + storedEveningReflection);

        if(storedEveningReflection == reflectionTitle){
            res.render('eReflection', {reflection : reflection});
        }
    })

})

app.get('/stoic-reflection/:question', function(req, res){
    let stoicQuestion = req.params.question;
    stoicQuestion = String(lodash.lowerCase(stoicQuestion));

    questionReflection.forEach(function(stoicReflection){
        let storedStoicQuestion = stoicReflection.question;
        storedStoicQuestion = String(lodash.lowerCase(storedStoicQuestion));

        if(stoicQuestion == storedStoicQuestion){
            res.render('questionAnswer', {stoicReflection : stoicReflection});
        }
        else{
            res.render('404');
        }
    })

    // res.send("route is working");

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
            // console.log(morningReflection);
            break;


        case "evening":
            // console.log("evening summary")
            let day = postObj.day;
            let threeAmazing = postObj.threeAmazingthings;
            let betterDay = postObj.betterDay;

            eveningReflection.push({
                day : day,
                threeThings : threeAmazing,
                betterDay :  postObj.betterDay
            })

            // console.log(eveningReflection)

            break;
        case "free":
            // console.log("free writing");

            let postTitle = postObj.title;
            let postContent = postObj.post

            posts.push({
                title : postTitle,
                content : postContent
            })
            break;
        case "question":
            // console.log("Stoic relfection question");

            let stoicAnswer = postObj.stoicAnswer;

            questionReflection.push({
                question: stoicQuestion,
                answer : stoicAnswer
            })

            // console.log(questionReflection);

            break;
        default:
            console.log("something went wrong")
    }

    // console.log(posts);x
    res.redirect('dashboard')
})

app.post('/morning', function(req, res){
    postChoice = "morning"
    res.redirect('compose')
})

app.post('/evening', function(req, res){
    postChoice = "evening"
    res.redirect('compose')
})

app.post('/free', function(req,res){
    postChoice = "free"
    res.redirect('compose');
})

app.post('/reflection', function(req,res){
    postChoice = "question";
    res.redirect('compose')
})

app.post('/morningPosts', function(req, res){
    displayPostChoice = "morning"
    res.redirect('dashboard')
})

app.post('/eveningPosts', function(req,res){
    displayPostChoice = "evening";
    res.redirect("dashboard")
})

app.post('/freePosts', function(req, res){
    displayPostChoice = "journal";
    res.redirect('dashboard')
})

app.post('/reflectionPosts', function(req, res){
    displayPostChoice = "reflection";
    res.redirect('dashboard');
})





// Listen

app.listen(PORT, function(){
    console.log("4.100 we are go for launch" + "\n...\n...\n..." + "\nGo for section 7 of 4.100");
});
