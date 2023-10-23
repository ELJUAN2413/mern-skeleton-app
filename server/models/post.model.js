import mongoose from "mongoose";
import crypto from 'crypto';
const PostSchema = new mongoose.Schema([{
  titulo:{
    type:String,
    trim:true,
    required: 'titulo is required'
  },
  description: {
    type: String,
    required: 'description is required'
  },
  photo:{
    type:String
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
}]);

export default mongoose.model('Post', PostSchema);
