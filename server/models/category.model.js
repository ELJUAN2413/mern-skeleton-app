import mongoose from 'mongoose';
import crypto from 'crypto';
const CategorySchema = new mongoose.Schema([{
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  description: {
    type: String,
    required: 'description is required'


  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
}]);
export default mongoose.model('Category', CategorySchema);