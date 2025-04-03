var express = require('express');
var router = express.Router();
const UserModel=require('../../models/UserModel')
const jwt=require('jsonwebtoken')
const md5=require('md5'); //单向加密
const { token } = require('morgan');
const {secret}=require('../../config/config')


  router.post('/login', async function (req, res) {
    try {
     let {username,password}=req.body
     const user = await UserModel.findOne({username:username,password:md5(password)})
     if(!user){
      return res.json({
        code:'2002',
        msg:'用户名或密码错误~~~',
        data:null
      })
     }
     let token=jwt.sign({
      username:user.username,
      _id:user._id
     },secret,{
      expiresIn:60*60*24*7
     })
     res.json({
      code:'0000',
      msg:'登录成功',
      data:token
     })
     res.render('success',{msg:'登录成功',url:'/account'})
    } catch (error) {
      res.json({
        code:'2001',
        msg:'数据库读取失败~~~',
        data:null
      })
      
    }
  });

  router.post('/post', async function (req, res) {
    try {
     req.session.destroy(()=>{
        res.render('success',{msg:'退出成功',url:'/login'})
     })
    } catch (error) {
      console.error(error);
      res.status(500).send('登录失败~~~');
    }
  });
module.exports = router;
