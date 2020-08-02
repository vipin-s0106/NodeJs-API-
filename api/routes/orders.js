const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');

// const Order = require('../models/order')
// const Product = require('../models/product')
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controller/order');


router.get('/', checkAuth, OrderController.get_all_orders)

router.post('/',checkAuth, OrderController.create_order)

router.get('/:orderID',OrderController.get_order)

router.delete('/:orderID',checkAuth,OrderController.delete_order)

module.exports = router