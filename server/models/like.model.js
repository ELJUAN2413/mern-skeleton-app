import mongoose from "mongoose";
import crypto from 'crypto';
const LikeSchema = new mongoose.Schema([{
  reaccion:{
    type:String,
    trim:true,
    required: 'like is required'
  },
  user: {
    type: String,
    required: 'id is required'
  },

  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,

  like:[{type:mongoose.Schema.ObjectId,ref:'like'}]
}]);
export default mongoose.model('Like', LikeSchema);