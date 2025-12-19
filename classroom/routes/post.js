const express = require("express");
const router = express.Router();

// index 
router.get("/", (req,res) =>{
    res.send("GET for post");
});

// show 
router.get("/:id", (req,res) =>{
    res.send("gert  for post");
});

// post 
router.post("/:id", (req,res) =>{
    res.send("post for post");
});

// delete
router.delete("/:id", (req,res) =>{
    res.send("delete for post");
});





