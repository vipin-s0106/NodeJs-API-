const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth')

const UserController = require('../controller/user')



router.post('/login',UserController.login)

router.post('/signup',UserController.signup)

router.get("/:userId",checkAuth,UserController.get_user)

router.delete("/:userId",checkAuth,UserController.delete_user)

module.exports = router;