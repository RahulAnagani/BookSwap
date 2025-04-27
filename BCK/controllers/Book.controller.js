const { validationResult } = require("express-validator");
const bookModel=require("../models/Book");
const userModel=require("../models/UserModel");
const requestModel=require("../models/Requests");
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

module.exports.bookRadius=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())return res.status(400).json({success:false,msg:"Not all feilds are submitted"});
    try{
        const {lat,lng,radius}=req.body;
        const books=await bookModel.find({
            location:{
                $geoWithin:{
                        $centerSphere:[[Number(lat),Number(lng)],radius/6371]
                }
            }
        });
        return res.status(200).json({success:true,data:books});
    }
    catch(e){
        console.log(e)
        return res.status(500).json({success:false,msg:"Internal SErver error"});
    }
}

module.exports.getBooks=async(req,res)=>{
    try{
        const allBooks=await bookModel.find();
        const total = await bookModel.countDocuments();
        res.status(200).json({
            success: true,
            data: allBooks,
          });
    }
    catch(e){
        console.log(e)
        res.status(500).json({success:false,msg:"Internal server error"})
    }
}



const getLocationName = async (ltd, lng) => {
    const apiKey = process.env.openCageApi;
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${ltd}+${lng}&key=${apiKey}`
    );
    const data = await response.json();
    return data.results[0]?.formatted || 'Location not found';
  };

module.exports.checkAvailability=async(req,res)=>{
    const errors=(validationResult(req));
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,msg:"Not all fields are submitted"});
    }
    else{
        try{
            const {okey}=req.query;
            const q="/works/"+okey;
            const exact=await bookModel.find({key:q}).populate("owner");
            const existing=await requestModel.find({toUser:req.user._id}).populate("fromBook").populate("fromUser","username").populate("toBook");
            const availability=[];
            const existingRequests=[];
            if(exact){
                for (const e of exact) {
                  if (e.isAvailable) {
                    availability.push({
                      owner: {
                        username: e.owner.username,
                      },
                      location: {
                        coords: e.location,
                        locationName: await getLocationName(e.location.ltd, e.location.lng),
                      },
                      bookId:e._id
                    });
                  }
                }
                for(const e of existing){
                    if(e.fromBook&&e.fromBook.key===q){
                        existingRequests.push(e);
                    }
                }
                return res.status(200).json({ success: true, availability:availability,existingRequests:existingRequests});
            }
            else{
                return res.status(200).json({success:true,availability:availability});
            }
        }catch(e){

            console.log(e);
            return res.status(500).json({success:false,msg:"Internal server error"});
        }
    }
}