import Post from '../models/post.model';
import merge from 'lodash/merge';
import errorHandler from '../helpers/dbErrorHandler';
import formidable from 'formidable';
import fs from 'fs';
import {extend} from 'lodash';

const create = async (req, res) => {
  const post = new Post (req.body);
  try{
    await post.save();
    return res.status(200).json({
      message:'create perfect'
    });
  }catch (err) {
    return res.status(400).json({
      error:errorHandler.getErrorMessage(err)
    });
  }
};

const list = async (req, res)=> {
  try{
    let posts = await Post.find().select('titulo description photo updated created');
    res.json(posts);
  }catch (err) {
    return res.status(400).json({
      error:errorHandler.getErrorMessage(err)
    })
  }
};

const postById = async (req, res, next, id) => {
  try {
    let post = await Post.findById({_id: id});
    if(!post) {
      return res.status(400).json({
        error: 'post not found'
      });
    }
    req.profile= post;
    next();
  }catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve post"
    });
  }
};
const read = (req , res)=> {
  req.titulo = 'ss';
  req.description = 'ss';
  return res.json(req.profile);
};
const update = async (req , res , next)=> {
  try {
    let post = req.profile;
    post = merge(post, req.body);
    post.updated = Date.now();
    await post.save();
    res.json(post);
  }catch  (err){
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};
const remove = async (req , res , next) => {
  try{
    console.log('deleted');
    let post= req.profile;
    console.log('post to remove',post);
    let deletedPost = await post.deleteone();
    res.json(deletedPost);
  }catch(err){
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
    const result = await Post.findByIdAndUpdate(
      req.body.followId,
      {$push:{followers:req.body.postId}},
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
    await Post.findByIdAndUpdate(
      req.body.postId,
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
    const result = await Post.findByIdAndUpdate(
      req.body.unfollowId,
      {$pull:{followers:req.body.postId}},
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
    await Post.findByIdAndUpdate(
      req.body.postId,
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
  postById,
  update,
  defaultPhoto,
  addFollowers,
  addFollowing,
  removeFollower,
  removeFollowing
};
