const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user')


exports.login = (req,res,next) =>{
    User.find({email:req.body.email})
        .exec()
        .then(user =>{
            if (user.length < 1){
                return res.status(404).json({
                    message:"Invalid Credentials"
                })
            }
            bcrypt.compare(req.body.password,user[0].password, (err,response) =>{
                if (err){
                    return res.status(404).json({
                        message:"Invalid Credentials"
                    })
                }
                if(response){
                    const token = jwt.sign({
                        email:user[0].email,
                        userId:user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn:"1h"
                    }
                    )
                    return res.status(200).json({
                        message:'Auth successful',
                        access:token
                    })
                }
                return res.status(401).json({
                    message:"Invalid Credentials"
                })
            })
        })
        .catch(err =>{
            res.status(500).json({
                error:err
            })
        })
}

exports.signup = (req,res,next) => {
    User.find({email:req.body.email})
        .exec()
        .then(user =>{
            if (user.length >= 1){
                res.status(409).json({
                    message:"Already Regsitered Mail"
                });
            }else{
                bcrypt.hash(req.body.password, 10, (err,hash) => {
                    if(err){
                        res.status(500).json({
                            error:err
                        });
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password:hash
                        });
                        user.save()
                            .then(result =>{
                                res.status(201).json({
                                    message:"User created",
                                    createdUser:{
                                        _id:result._id,
                                        email:result.email
                                    }
                                })
                            })
                            .catch(err =>{
                                res.status(500).json({
                                    error:err
                                }) 
                            })
                    }
                });
            
            }
        })
}

exports.get_user = (req,res,next) => {
    User.findById({_id:req.params.userId})
        .select('_id email __v')
        .exec()
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({
                error:err
            })
        })
}

exports.delete_user = (req,res,next) => {
    User.remove({_id:req.params.userId})
        .exec()
        .then(result =>{
            res.status(200).json({
                message:"User has been successfully deleted"
            })
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({
                error:err
            })
        })
}