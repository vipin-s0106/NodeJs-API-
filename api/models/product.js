const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String, rquired:true},
    price: {type:Number, rquired:true},
    productImage:{type:String,required:true}
});

module.exports = mongoose.model('Product', productSchema)