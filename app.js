const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

mongoose.connect(
    'mongodb://127.0.0.1:27017/eatpanda',
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
     }
);
mongoose.Promise = global.Promise;

//this is for logging the request in terminal
app.use(morgan('dev')) 
//making static folder upload public so it can be accessible
app.use(express.static('uploads'))
//passing the request to below middleware in order to parse the body request
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//handle the cors origin
//as of now put as all access 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','http://localhost:3000');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    if (req.method === 'OPTIONS'){
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({})
    }
    next();
})



//Routes which handle request
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

//below middleware to handle the not found routes
app.use((req,res,next) =>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});


module.exports = app;