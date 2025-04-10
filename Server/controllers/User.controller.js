const { validationResult } = require("express-validator");
const UserModel=require("../models/UserModel");
const mailer=require("../controllers/Mailer")
module.exports.login=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({success:false,msg:"Not all fields are submitted!",errors:errors.array()});
    }
    else{
        const {username,password}=req.body;
        try{
            const user=await UserModel.findOne({username:username});
            if(!user){
                res.status(404).json({success:false,msg:"No user found with this username."});
            }
            else{
                if(user.VerifyPass(password)){
                    const token=user.GenerateToken();
                    res.cookie("token",token);
                    res.status(200).json({success:true,token:token,user:user});
                }
                else{
                    res.status(400).json({success:false,msg:"Wrong Password"})
                }
            }
        }
        catch(e){
            res.status(500).json({success:false,msg:"Internal server error"});
        }
    }
}
module.exports.register=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())res.status(400).json({success:false,msg:"Not all fields are submitted."});
    else{
        const {username,email,password}=req.body;
        try{
            const user=await UserModel.findOne({email:email});
            if(user){
                res.status(400).json({success:false,msg:"User Already Exists."});
            }
            else{
                if(await mailer.SendOtp(email,username,password,)){

                }
            }
        }
        catch(e){

        }
    }
}