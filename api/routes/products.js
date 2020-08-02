const express = require('express');
const router = express.Router();

var dateFormat = require('dateformat');
//multer required to parse the multipart form data
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const ProductController = require('../controller/product')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        cb(null,dateFormat(new Date(), "dd_mm_yyyy_h_MM_ss_")+file.originalname);
    }

});

const filefilter = (req,file,cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const upload = multer({
    // dest:'uploads/'
    storage:storage,
    fileFilter:filefilter
})


router.get('/', ProductController.get_all_products);

router.post('/',checkAuth,upload.single('productImage'), ProductController.create_product);

router.get('/:productID',ProductController.get_product)

router.patch('/:productID',checkAuth,ProductController.update_product)

router.delete('/:productID',checkAuth,ProductController.delete_product);

module.exports = router;