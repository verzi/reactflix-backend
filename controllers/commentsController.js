var Comments = require('../models/CommentModel');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var jwtSecretPassword = 'Secret Password';
/**
 * List comments
 */
let index = (req, res) =>
{      
    Comments.find(function(err,listComments)
    {
        res.status(200).send(listComments);
        //si hay error
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });        
};

/**
 * Get comment by _id
 */
let view = (req, res) =>
{
    //Is it a valid ObjectId?
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(422).send();
    }

    Comments.findOne({_id:req.params.id},function(err,comments)
    {
        if (err){
            res.status(500).send(err);
            console.log(err);
        }

        if (comments){
            res.status(200).send(comments);
        } else {
            res.status(404).send();
        }
    })     
};

/**
 * Add comment
 */
let add = (req, res) =>
{
    var token = req.headers['authorization']
    if(!token){
        res.status(401).send({
          error: "Please, sign in"
        })
        return;
    }

    token = token.replace('Bearer ', '')

    jwt.verify(token, jwtSecretPassword, function(err, user) {
      if (err) {
        res.status(401).send({
          error: 'Token inválido'
        })
      } else {
            let newComment = Comments(preProcessRecord(req.body, ['_id', 'datetime']));
            
            newComment.save().then(
                (newComment)=>
                {
                    res.status(201).send(newComment);
                },
                (err)=>
                { 
                    res.status(500).send(err);
                    console.log(err);
                }
            ) 
      }
    });
};

let remove = (req,res) =>
{
    Comments.deleteOne({_id:req.params.id}, function(err)
    {
        res.status(204).send();  
        (err)=>
        { 
            res.status(500).send(err);
            console.log(err);
        }      
    });
};

let edit = (req,res) =>
{          
    let editedComment = preProcessRecord(req.body, ['_id', 'datetime']);
    
    Comments.findOneAndUpdate(
        {
            _id:req.params.id
        },
        {
            $set : editedComment
        },
        {
            new : true
        },
        function(err, updatedComment)
        {
            res.status(200).send(updatedComment);
            (err)=>
                { 
                    res.status(500).send(err);
                    console.log(err);
                }
        }
    );  
};

/**
 * List user comments for movie
 */
let getUserCommentsOnMovie = (req, res) =>
{      
    Comments.find({movieId:req.params.movieId, "user._id":req.params.userId},function(err,listComments)
    {
        res.status(200).send(listComments);
        //si hay error
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });        
};

/**
 * List user comments for movie
 */
let getMovieComments = (req, res) =>
{      
    Comments.find({movieId:req.params.movieId}).sort({datetime: -1}).exec(function(err,listComments)
    {
        res.status(200).send(listComments);
        //si hay error
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });
};

let preProcessRecord = (data, ignoreFields) => {
    let record = {};
    for (var dataProp in data){
        if (typeof Comments.schema.obj[dataProp] !== 'undefined' && ignoreFields.indexOf(dataProp) === -1){
            record[dataProp] = data[dataProp];
        }
    }
    return record;
}

module.exports = {index, view, add, edit, remove, getUserCommentsOnMovie, getMovieComments};