var express = require('express');
var router = express.Router();
const UserModel=require('../../models/UserModel')
const {secret}=require('../../config/config')
const md5=require('md5') //单向加密
//注册
router.get('/reg', async function (req, res) {
  try {
   res.render('auth/reg')
  } catch (error) {
    console.error(error);
    res.status(500).send('读取失败~~~');
  }
});

router.post('/reg', async function (req, res) {
    try {
        //可加入表单验证
        const newAccount = await UserModel.create({...req.body,password:md5(req.body.password)});
        res.render('success',{msg:'注册成功',url:'/login'})
        console.log(req.body)
    } catch (error) {
      console.error(error);
      res.status(500).send('注册失败~~~');
    }
  });

  router.get('/login', async function (req, res) {
    try {
     res.render('auth/login')
    } catch (error) {
      console.error(error);
      res.status(500).send('登录失败~~~');
    }
  });
  router.post('/login', async function (req, res) {
    try {
     let {username,password}=req.body
     const user = await UserModel.findOne({username:username,password:md5(password)})
     if(!user){
        return res.send('账号或密码错误~~~')
     }
     //写入session
     req.session.username=user.username
     req.session._id=user._id
     res.render('success',{msg:'登录成功',url:'/account'})
    } catch (error) {
      console.error(error);
      res.status(500).send('登录失败~~~');
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
