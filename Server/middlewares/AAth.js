const jwt=require("mongoose");
const UserModel=require("../models/UserModel");
const logoutModel=require("../models/Logout");
module.exports.validateUser=async(req,res,next)=>{
    const token=req.cookies.token||req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(400).json({success:false,msg:"No token found."});
    }
    else{
        try{
            const loggedOut=await logoutModel.findOne({token});
            if(loggedOut)res.status(400).json({success:false,msg:"User logged out."});
            else{
                const decoded=jwt.verify(token,process.env.PASS);
                const user=UserModel.findById(decoded._id);
                if(user){
                    req.user=user;
                    next();
                }
                else{
                    res.status(400).json({success:false,msg:"User not found"});
                }
            }
        }
        catch(e){
            if(e.name==='TokenExpiredError'){
                res.status(400).json({success:false,msg:"Session Expired"});
            }
            res.status(500).json({success:false,msg:"Internal Server Error"});
        }
    }
}