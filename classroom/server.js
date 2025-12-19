const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionoptions = {
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true
};

app.use(session(sessionoptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.use("/users", users);

app.get("/register", (req,res) =>{
    let{name} = req.query;
    if(!name){
         req.flash("error","user not registered!");
    }else{
        req.session.name = name;
        req.flash("success","user registred successfully!");
    }
    req.session.save(() => {
        res.redirect("/hello");
    });
});

 app.get("/hello", (req,res)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("page", {name: req.session.name});
 });
    
    



    // app.get("/reqcount", (req,res)=>{
    //     if(req.session.count){
    //         req.session.count++;
    //     }else{
    //         req.session.count=1;
    //     }
       
    //     res.send(`You sent a request ${req.session.count} times`);
    // });

// app.get("/test", (req,res)=>{
//     res.send("test successful!");
// });

app.listen(3000, () =>{
    console.log("server is listening to 3000");
});