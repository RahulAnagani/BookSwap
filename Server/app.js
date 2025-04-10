const express=require("express");
const connectDb = require("./config/connect");
const app=express();
const cors=require("cors");
const dotenv=require("dotenv").config();
const cookieParser=require("cookie-parser");
const userRoutes=require("./routes/UserRoutes");
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use("/user",userRoutes);
app.get("/",(req,res)=>res.send("Star Start Power Star !"));

connectDb();    
module.exports=app;