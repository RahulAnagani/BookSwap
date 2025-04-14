const { validationResult } = require("express-validator");
const bookModel=require("../models/Book");
const userModel=require("../models/UserModel");
const Book = require("../models/Book");
const mapController=require("./Map.controller")
module.exports.addBook=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({success:false,msg:"Not all fields are correct!",e:errors});
    }
    else{
        try{
            const {author,title,genre,condition,isAvailable,location,imageUrl,key}=req.body;
            let coords={
                ltd:0,
                lng:0
            }
            if(location!=="Not available"){
                coords=await mapController.getCoords(location);
            }
            const newBook=new bookModel({
                author,title,genre,condition,isAvailable,location:coords,
                owner:req.user._id,
                imageUrl,
                key
            });
            await newBook.save();
            const user=await userModel.findByIdAndUpdate(req.user._id,{$push:{books:newBook._id}},{new:true});
            res.status(200).json({success:true,msg:"Successfully added a book",user:user});
        }
        catch(e){
            console.log(e)
            res.status(500).json({success:false,msg:"Internal server error"});
        }
    }
}
module.exports.removeBook=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({success:false,msg:"Not all fields are correct!"});
    }
    else{
        try{
            const {bookId}=req.body;
            const user=await userModel.findByIdAndUpdate(req.user._id,{$pull:{books:bookId}},{new:true});
            res.status(200).json({success:true,msg:"Successfully removed a book",user:user});
        }
        catch(e){
            console.log(e)
            res.status(500).json({success:false,msg:"Internal server error"});
        }
    }
}

module.exports.getBooks=async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try{
        const allBooks=await bookModel.find().skip(skip).limit(limit);
        const total = await bookModel.countDocuments();
        res.status(200).json({
            success: true,
            data: allBooks,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBooks: total
          });
    }
    catch(e){
        res.status(500).json({success:false,msg:"Internal server error"})
    }
}