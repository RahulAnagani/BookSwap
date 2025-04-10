const mongoose=require("mongoose");
const connectDb=async()=>{
    try{
        const uri=process.env.URI;
        const connection=await mongoose.connect(uri);
        console.log("Successfully connected to the dataBase: ",connection.connection.host);
    }
    catch(e){
        console.log("Error in connecting dataBase: ",e);
    }
}
module.exports=connectDb