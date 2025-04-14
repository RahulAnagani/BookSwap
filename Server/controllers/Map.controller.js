import { validationResult } from "express-validator";

export const getLocations=async(req,res)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()===false)return res.status(400).json({success:false,msg:"Not all fields are submitted."});
    try{
        const {location}=req.query;
        const response=await fetch(`https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${location}&key=${process.env.MAP_API_KEY}`);
        if(!response.ok){
            throw new Error("Error in fetching the data");
        }
        const data=await response.json();
        const responseData=data.predictions.slice(0,5).map((e,i)=>{
            return {description:e.description,place_id:e.place_id}
        })
        return res.status(200).json({success:true,data:responseData});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({success:false,msg:"Internal SErver error"});
    }
}
export const getCoords=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,msg:"All fields are not submitted"});
    }
    else{
        
    }
}