const express = require('express');
const router = express.Router();

//to convert body string to json
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

//get models
const Student = require('../models/Student');

//get body request validator
const {body, validationResult} = require('express-validator');

//api's
router.get("/", async (req,res)=>{
    try{
        const students = await Student.find();
        console.log(students);
        res.status(200).json({
            status: "success",
            data: students
        });
    }catch(error){
        console.log(error);
        res.status(400).json({
            status: "error",
            message: error
        })
    }
});

router.get("/:id", async (req,res)=>{
    // console.log(req.params.id);
    try{
        const student = await Student.find({id: req.params.id});
        //console.log(student);
        if(student.length > 0){
            res.status(200).json({
                status: "success",
                data: student
            });
        }
        else{
            res.status(404).json({
                status: "failed",
                message: "user not exists"
            })
        }

    }catch(error){
        res.status(404).json({
            status: "error",
            message: error.message
        })
    }
});

router.post("",
body('name').isLength({min: 1}),
body('currentClass').isLength({min:1}),
body('division').isLength({min:1}),
async (req, res)=>{
    try{
        //checking bady req fields
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: "error",
                message: "Body field cannot empty"
            });
        }
        //get values from body
        const {name,currentClass,division} = req.body;
        // console.log(name+" "+currentClass+" "+division);

        //generating unique id
        let id = await Student.find({},{id:1,_id:0}).sort({id:-1}).limit(1);
        let new_id=0;
        if(id.length>0){
            new_id = id[0].id + 1;
        }
        
        // post data in db
        const student = await Student.create({
            id: new_id,
            name: name,
            currentClass: currentClass,
            division: division
        })
        // console.log(student);

        res.status(200).json({
            status: "success",
            data: {id: new_id}//student.id}
        });
    }
    catch(err){
        res.status(400).json({
            status: "error",
            message: err
        })
    }
});

router.put("/:id",
body("name").isLength({min:1})
,async (req,res)=>{
    try{
        //check name in body form  is valid
        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).json({
                status: "error",
                message: "All feild required"
            });
        }
        //check id in params is valid
        const checkId = await Student.find({},{id:1,_id:0}).sort({id:-1}).limit(1);
        console.log(checkId[0].id < req.params.id);
        if(checkId.length <= 0){
            return res.status(400).json({
                status: "error",
                message: `Student with this ${req.params.id} not exists`
            });
        }
        if(Number(checkId[0].id) < Number(req.params.id)){
            return res.status(400).json({
                status: "error",
                message: "Invalid id"
            });
        }

        //update name for id
        const student =  await Student.updateOne({id: req.params.id},{$set: {name: req.body.name}})
        
        if(student.modifiedCount < 1){
            return res.status(400).json({
                status: "error",
                message: "Fail to update name"
            });
        }

        
        res.status(200).json({
            status: "success",
            message: student
        })

    }catch(error){
        res.status(400).json({
            status: "failed",
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res)=>{
    try{
        
        const student = await Student.deleteOne({id: req.params.id})
        if(student.deletedCount < 1){
            return res.status(400).json({
                status: "failed",
                message: "No student exists of this id"
            });
        }
        res.status(200).json({
            status: "success",
            message: student
        });

    }catch(error){
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
})

//export router
module.exports = router;
