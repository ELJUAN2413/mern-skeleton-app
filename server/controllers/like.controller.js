import Like from '../models/like.model';
import merge from 'lodash/merge';
import errorHandler from './../helpers/dbErrorHandler';
import formidable from 'formidable';
import fs from 'fs';
import {extend} from 'lodash';
import defaultlimage from '../../client/assets/images/profile-pic.png';
import { Photo } from '@material-ui/icons';

const create = async (req, res) => {
  const like = new Like(req.body);
  try {
    await like.save();
    return res.status(200).json({
      message: 'Successfully like!'
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const list = async (req, res) => {
  try {
    let likes = await Like.find().select('reaccion user updated created');
    res.json(likes);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const likeById = async (req, res, next, id) => {
  try {
    let like = await Like.findById({_id: id});
    populate('following','_id name')
    .populate('followers','_id name')
    .exec();
    if(!like) {
      return res.status(400).json({
        error: 'like not found'
      });
    }
    req.profile = like;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve like"
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  req.reaccion = 'ss';
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
      let like= req.profile;
      like = extend(like, fields);
      like.updated = Date.now();

      if(files.photo){
        like.photo.data = fs.readFileSync(files.photo.filepath);
        like.photo.contentType = files.photo.type;
      }
      await like.save();
      like.hashed_password ='';
      like.salt = '';
      res.json({like});
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
    let like = req.profile;
    console.log('like to remove', like);
    let deletedLike = await like.deleteOne();
    deletedLike.hashed_password = '';
    deletedLike.salt = '';
    res.json(deletedLike);
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
    const result = await Like.findByIdAndUpdate(
      req.body.followId,
      {$push:{followers:req.body.liketId}},
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
    await Like.findByIdAndUpdate(
      req.body.likeId,
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
    const result = await Like.findByIdAndUpdate(
      req.body.unfollowId,
      {$pull:{followers:req.body.likeId}},
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
    await Like.findByIdAndUpdate(
      req.body.likeId,
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
  likeById,
  update,
  defaultPhoto,
  addFollowers,
  addFollowing,
  removeFollower,
  removeFollowing
};
