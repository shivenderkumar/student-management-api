//for createing server
const express = require('express');
const app = express();
const port = 8080;
const studentArray = require('./InitialData')
// app.use(express.urlencoded());

//for accessing and connect mongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/blog_app');

//get router
const studentRouter = require('../routers/router');
app.use("/api/student",studentRouter);

const Student = require('../models/Student');
app.get("*", async (req,res)=>{
    res.send("Page not found!!")
    //inserting default data in db
    //add some preloaded to mongoDB
    // try{
    //     const students = await Student.insertMany(
    //         studentArray
    //     );

    //     res.status(200).json({
    //         status: "success",
    //         students
    //     });

    // }catch(error){
    //     res.status(400).json({
    //         status: "error",
    //         message: error.message
    //     });
    // }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
module.exports = app;   

// Parse JSON bodies (as sent by API clients)
//app.use(express.json());
