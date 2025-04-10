const express=require("express");
const { body } = require("express-validator");
const userController=require("../controllers/User.controller");
const router=express.Router();
router.post("/login",[body("username").trim().isLength({min:3}),body("password").trim().isLength({min:4})],userController.login);
router.post("/register",[body("email").trim().isEmail(),body("username").trim().isLength({min:3}),body("password").trim().isLength({min:4})],(req,res)=>{});
router.post("/logout",(req,res)=>{});
router.get("/getProfile",(req,res)=>{});
module.exports=router;