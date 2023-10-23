import mongoose from 'mongoose';
import crypto from 'crypto';
const CommentSchema = new mongoose.Schema([{
  comment: {
    type: String,
    trim: true,
    required: 'comment is required'
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
  like:[{type:mongoose.Schema.ObjectId,ref:'comment'}]
}]);
export default mongoose.model('Comment', CommentSchema);