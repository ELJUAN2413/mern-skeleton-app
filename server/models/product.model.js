import mongoose from "mongoose";
import crypto from 'crypto';
const ProductSchema = new mongoose.Schema([{
  name:{
    type: String,
    trim: true,
    required: 'Name is required'
  },
  price:{
    type:String,
    required:'Price is required'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
}]);
export default mongoose.model('Product', ProductSchema);