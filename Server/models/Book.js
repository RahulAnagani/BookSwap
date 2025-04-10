const mongoose=require("mongoose");
const BookSchema=new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    author: String,
    genre: String,
    condition: String,
    isAvailable: Boolean,
    imageUrl: String,
    location: {
        ltd:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    },
  });
  module.exports=mongoose.model("Book",BookSchema);
