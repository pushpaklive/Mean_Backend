var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://pushpak:pushpak1@ds227119.mlab.com:27119/mytasklist_pushpak', ['tasks'])
router.get('/tasks', function (req, res, next) {
    //We will receive tasks collection from previous url as we are adding array of
    //collections we want to use and here we are passing tasks
    db.tasks.find(function (err, tasks) {
        if (err)
            res.send(err);
        res.json(tasks);
    });
});


//Get Single task
router.get('/task/:id', function(req, res, next){
    db.tasks.findOne({ _id : mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err)
         res.send(err);
        res.json(task);
    });
});

//Save a task : Using a post request here
router.post('/task', function(req, res, next){
    //Extracting the task values submitted from form we will create in UI
    var task = req.body;
    //validation for form values
    if(!task.title || (task.isDone + '')){
        res.status(400).json("Bad Data!!");
    }
    else{
        db.tasks.save(task, function(err, task){
          if(err){
              res.send(err);
          }
          //We coulduse curl or something like that and we will do this in angular UI
          res.json(task);
        });
    }
});

//Delete a task
router.delete('/task/:id', function(req, res, next){
    db.tasks.remove({ _id : mongojs.ObjectId(req.params.id)}, function(err, task){
        if(err)
         res.send(err);
        res.json(task);
    });
});

//Put/Update a task - It replaces the complete resource on the server
router.put('/task/:id', function(req, res, next){
    var task = req.body;
    var updTsk = {};
    //will replace task values in updTsk here: how? below
    if(task.title)
      updTsk.title = task.title;
    
    if(task.isDone)
      updTsk.isDone = task.isDone;
    
    if(!updTsk){
        res.status(400).json({"error": "Bad data !!"});
    }
    else{
        db.tasks.update({ _id : mongojs.ObjectId(req.params.id)}, updTsk, {}, function(err, task){
            if(err)
             res.send(err);
            res.json(task);
        });
    }
    

    
});

module.exports = router;