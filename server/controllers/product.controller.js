import Product from '../models/product.model';
import merge from 'lodash/merge';
import ErrorHandler from './../helpers/dbErrorHandler';
import {json} from 'body-parser';

const create = async (req, res)=>{
 const product = new Product (req.body);
  try{
    await product.save();
    return res.status(200).json({
      message:  'product create perfect!'
    });
}catch (err){
  return res.status(400).json({
    error:ErrorHandler.getErrorMessage(err)
  });
}
};

const list= async (req, res)=>{
  try{
    let products = await Product.find().select('name price updated created');
    res.json (products);
  }catch (err){
    return res.status('400').json({
    error:errorHandler.getErrorMessage(err)
    })
  }
};

const  productById = async (req, res, next , id) => {
  try{
    let product = await Product.findById({_id: id});
    if(!product) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }
    req.profile=product;
    next();
  }catch (err){
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve product"
    });
  }
};

const read = (req , res)=> {
  req.name = 'ss';
  req.price = 'ss';
  return res.json(req.profile);
};

const update = async (req ,res, next) => {
  try{
    let product = req.profile;
    product = merge(product, req.body);
    product.update = Date.now();
    await product.save();
    res.json(product);
  }catch (err) {
    console.log(err);
    return res.status(400).json({
      error:errorHandler.getErrorMessage(err)
    });
  }
};

const remove = async (req , res , next) => {
  try{
    console.log('deleted');
    let product= req.profile;
    console.log('product to remove',product);
    let deletedProduct = await product.deleteone();
    res.json(deletedProduct);
  }catch(err){
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};
export default {
  create,
  list,
  read,
  remove,
  update,
  productById
};
