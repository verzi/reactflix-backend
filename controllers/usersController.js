var Users = require('../models/UserModel');
var Comments = require('../models/CommentModel');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

/**
 * List users
 */
let index = (req, res) =>
{      
    Users.find(function(err,listUsers)
    {
        res.status(200).send(listUsers);
        //si hay error
        (err)=>{
            res.status(500).send(err);
            console.log(err);
        }
    });        
};

/**
 * Get user by _id
 */
let view = (req, res) =>
{
    //Is it a valid ObjectId?
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(422).send();
    }

    Users.findOne({_id:req.params.id},function(err,users)
    {
        if (err){
            res.status(500).send(err);
            console.log(err);
        }

        if (users){
            res.status(200).send(users);
        } else {
            res.status(404).send();
        }
    })     
};

/**
 * Add user
 */
let add = (req, res) =>
{
    var newUser = Users(preProcessRecord(req.body, ['_id']));
    
    newUser.save().then(
        (newUser)=>
        {
            res.status(201).send(newUser);
        },
        (err)=>
        { 
            res.status(500).send(err);
            console.log(err);
        }
    ) 
};

/**
 * Login user
 */
let login = (req, res) =>
{
    Users.findOne({username:req.body.username, password:req.body.password},function(err,users)
    {
        if (err){
            res.status(401).send({
                error:'Nombre de usuario o contraseña inválidos'
            });
            console.log(err);
        }

        if (users){
            tokenData = {
                id: users._id,
                firstname: users.firstname,
                lastname: users.lastname,
                username: users.username,
                email: users.email
            }
            let token = jwt.sign(tokenData, 'Secret Password', {
                expiresIn: 60 * 60 * 24
            });
            res.status(200).send({token, userProfile: tokenData});
        } else {
            res.status(401).send({
                error:'Nombre de usuario o contraseña inválidos'
            });
        }
    })
};

let remove = (req,res) =>
{
    Users.deleteOne({_id:req.params.id}, function(err)
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
    let editedUser = preProcessRecord(req.body, ['_id', 'username', 'email']);
    
    Users.findOneAndUpdate(
        {
            _id:req.params.id
        },
        {
            $set : editedUser
        },
        {
            new : true
        },
        async function(err, updatedUser)
        {
            console.log(updatedUser);
            Comments.updateMany({ 
                "user._id" : updatedUser._id 
            }, {
                "$set":{
                    user: {
                        _id: updatedUser._id,
                        firstname: updatedUser.firstname,
                        lastname: updatedUser.lastname
                    }
                }, 
            },
            (err, writeResult) => {
                console.log(err);
            });

            await res.status(200).send(updatedUser);
            (err)=>
                { 
                    res.status(500).send(err);
                    console.log(err);
                }
        }
    );  
};

let preProcessRecord = (data, ignoreFields) => {
    let record = {};
    for (var dataProp in data){
        if (typeof Users.schema.obj[dataProp] !== 'undefined' && ignoreFields.indexOf(dataProp) === -1){
            record[dataProp] = data[dataProp];
        }
    }
    return record;
}

module.exports = {index, view, add, edit, remove, login};