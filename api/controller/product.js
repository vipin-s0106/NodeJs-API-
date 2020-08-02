const Product = require('../models/product');
const mongoose = require('mongoose');

exports.get_all_products = (req,res,next) =>{
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                products: result.map(doc => {
                    return {
                        name:doc.name,
                        price:doc.price,
                        productImage:doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://'+req.headers.host+'/products/'+doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        })
}

exports.create_product = (req,res,next) =>{
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path
    })
    product
        .save()
        .then(result =>{
            res.status(201).json({
                message:'Created Product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id : result._id,
                    request: {
                        type:'GET',
                        url: 'http://'+req.headers.host+'/products/'+result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
}

exports.get_product = (req,res,next) => {
    const id = req.params.productID;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc){
                res.status(200).json(doc)
            }else{
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error:err})
        });
}

exports.update_product = (req,res,next) => {
    const id = req.params.productID;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps)
    Product.update({_id:id},{$set:updateOps})
        .exec()
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
}

exports.delete_product = (req,res,next) => {
    const id = req.params.productID;
    Product.remove({_id:id})
        .exec()
        .then(result =>{
            if (result){
                res.status(200).json(result)
            }else{
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error:err
            })
        });
}