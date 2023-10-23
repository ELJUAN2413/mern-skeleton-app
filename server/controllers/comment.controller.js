import Comment from '../models/comment.model';
import merge from 'lodash/merge';
import errorHandler from './../helpers/dbErrorHandler';
import formidable from 'formidable';
import fs from 'fs';
import {extend} from 'lodash';
import defaultlimage from '../../client/assets/images/profile-pic.png';
import { Photo } from '@material-ui/icons';

const create = async (req, res) => {
  const comment = new Comment (req.body);
  try {
    await comment.save();
    return res.status(200).json({
      message: 'Successfully comment!'
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const list = async (req, res) => {
  try {
    let comments = await Comment.find().select('comment user updated created');
    res.json(comments);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const commentById = async (req, res, next, id) => {
  try {
    let comment = await Comment.findById({_id: id});
    populate('following','_id name')
    .populate('followers','_id name')
    .exec();
    if(!comment) {
      return res.status(400).json({
        error: 'Comment not found'
      });
    }
    req.profile = comment;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve comment"
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  req.comment = 'ss';
  return res.json(req.profile);
};

const update = async (req, res) => {
  const form= new formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, async (err,fields,files)=> {
    try{
      if(err) {
        return res.status(400).json({
          error:'Photo could not be uploaded'
        });
      }
      let comment= req.profile;
      comment = extend(comment, fields);
      comment.updated = Date.now();

      if(files.photo){
        user.photo.data = fs.readFileSync(files.photo.filepath);
        user.photo.contentType = files.photo.type;
      }
      await comment.save();
      comment.hashed_password ='';
      comment.salt = '';
      res.json({user});
    }catch (err) {
      return res.status(400).json({
        error:errorHandler.getErrorMessage('error',err)
      });
    }
  });
};

const remove = async (req, res, next) => {
  try {
    console.log('deleted');
    let user = req.profile;
    console.log('comment to remove', comment);
    let deletedComment = await comment.deleteOne();
    deletedComment.hashed_password = '';
    deletedComment.salt = '';
    res.json(deletedComment);
  } catch(err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const defaultPhoto = (req, res) => {
  return res.sendFile(`${process.cwd()}${defaultImage}`);
};


const addFollowers = async (req,res)=>{
  try{
    const result = await Comment.findByIdAndUpdate(
      req.body.followId,
      {$push:{followers:req.body.commentId}},
      {new:true}
    )
    .populate('following','id_name')
    .populate('followers','id_name')
    .exec();
    result.hashed_password=undefined;
    result.salt=undefined;
    res.json(result);
  } catch (err){
    return res.status(400).json({
      erro:errorHandler.getErrorMessage(err)
    });
  }
};
const addFollowing= async (req,res,next)=>{
  try{
    await Comment.findByIdAndUpdate(
      req.body.commentId,
      {$push:{following:req.body.followId}});
      next();
  }catch(err){
    return res.status(400).json({
      error:errorHandler.getErrorMessage(err)
    });
  }
};
const removeFollower = async (req,res)=>{
  try{
    const result = await Comment.findByIdAndUpdate(
      req.body.unfollowId,
      {$pull:{followers:req.body.commentId}},
      {new:true}
    )
    .populate('following','_id name')
    .populate('followers','_id name')
    .exec();
    res.json(result);
  }catch (err){
    return res.status(400).json({
      erro:errorHandler.getErrorMessage()
    });
  }
};

const removeFollowing = async (req,res,next)=>{
  try{
    await Comment.findByIdAndUpdate(
      req.body.commentId,
      {$pull:{following:req.body.unfollowId}});
      next();
  }catch(err){
    return res.status(400).json({
      erro:errorHandler.getErrorMessage()
    });
  }
};

export default {
  create,
  list,
  read,
  remove,
  commentById,
  update,
  defaultPhoto,
  addFollowers,
  addFollowing,
  removeFollower,
  removeFollowing
};
