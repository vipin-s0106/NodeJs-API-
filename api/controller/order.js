const mongoose = require('mongoose');

const Order = require('../models/order')
const Product = require('../models/product')

exports.get_all_orders = (req,res,next) =>{
    Order.find()
        .populate('product')
        .exec()
        .then(docs => {
            res.status(200).json({
                count : docs.length,
                orders: docs.map( doc =>{
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://'+req.headers.host+'/orders/'+doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({error:err});
        })
}

exports.create_order = (req,res,next) =>{
    Product.findById(req.body.productId)
        .then(product => {
            if (!product){
                return res.status(404).json({
                    message:"Product Not Found"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity:req.body.quantity,
                product: req.body.productId
        
            });
            return order.save()
        })
        .then(result =>{
            res.status(201).json({
                message:"Order Created",
                request:{
                    type: 'GET',
                    url: 'http://'+req.headers.host+'/orders/'+result._id
                },
                createdOrder: result
            });
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            })
        })
}

exports.get_order = (req,res,next) =>{
    Order.findById(req.params.orderID)
        .populate('product')
        .exec()
        .then(order => {
            if (!order){
                return res.status(404).json({
                    message:"Order not found"
                })
            }
            res.status(200).json({
                Order:{
                    _id:order._id,
                    quantity:order.quantity,
                    product:order.product
                },
                request:{
                    type:'GET',
                    desc:"Get All Orders",
                    url: 'http://'+req.headers.host+'/orders'
                }
            })
        })
        .catch(err =>{
            res.status(500).json({
                error:err
            })
        })
}

exports.delete_order = (req,res,next) =>{
    Order.remove({_id:req.params.orderID})
        .exec()
        .then(result =>{
            res.status(200).json({
                message:'Order Deleted',
                request:{
                    type:"POST",
                    desc:"Create new Order",
                    body:{
                        "productId":"product_id",
                        "quantity":"value"
                    }
                }
            })
        })
        .catch()
}