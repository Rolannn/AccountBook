const express = require('express');
const AccountModel = require('../../models/AccountModel')
const moment=require('moment')
const jwt=require('jsonwebtoken')
const util = require('util');
const verifyToken = util.promisify(jwt.verify); // 让 jwt.verify() 变成支持 await
const checkTokenMiddleware=require('../../Middlewares/checkTokenMiddleware')
const router = express.Router();

router.get('/account', checkTokenMiddleware,async function (req, res, next) {
  try {
    // 查询数据库
    const accounts = await AccountModel.find().sort({ time: -1 });

    // 返回数据
    res.json({
      code: '0000',
      msg: '读取成功',
      data: accounts
    });

  } catch (error) {
    console.error(error);
    res.json({
      code: '1001',
      msg: '读取失败~~',
      data: null
    });
  }
});

   
//不再返回html，而是返回Json数据
// router.get('/account/create', function(req, res, next) {
//   res.render('create')
// });

router.post('/account', checkTokenMiddleware,async (req, res) => {
  try {
    const newAccount = await AccountModel.create({
      ...req.body,
      time: moment(req.body.time).toDate()
    });
    res.json({
        code:'0000',
        msg:'创建成功',
        data:newAccount
    })
   
  } catch (error) {
    console.error(error);
    res.json({
        code:'1002',
        msg:'创建失败~~',
        data:null
    })
  }
});


router.delete('/account/:id', checkTokenMiddleware,async (req, res) => {
  try {
    // 获取 params 的 id 参数
    let id = req.params.id;

    // 执行删除操作
    const result = await AccountModel.deleteOne({ _id: id });

    // 检查是否有匹配的文档被删除
    if (result.deletedCount === 0) {
      return res.status(404).send('未找到该记录，删除失败');
    }

    res.json({
        code:'0000',
        msg:'删除成功',
        data:{}
      })
  } catch (error) {
    console.error(error);
    res.json({
        code:'1003',
        msg:'删除账单失败~~',
        data:null
    })
  }
});

//获取单个账单信息
router.get('/account/:id', checkTokenMiddleware,async function (req, res, next) {
    try {
        let {id}=req.params
        const account = await AccountModel.findById(id)
        res.json({
            //响应编号,就不用再设置状态码了
            code:'0000',
            //响应的消息
            msg:'读取成功',
            //响应的数据
            data:account
      })
    } catch (error) {
      res.json({
          code:'1004',
          msg:'读取失败~~',
          data:null
      })
    }
  });

//更新单个账单信息
router.patch('/account/:id', checkTokenMiddleware,async function (req, res, next) {
    try {
        let {id}=req.params
        const account = await AccountModel.updateOne({_id:id},req.body)
        res.json({
            //响应编号,就不用再设置状态码了
            code:'0000',
            //响应的消息
            msg:'更新成功',
            //响应的数据
            data:account
      })
    } catch (error) {
      res.json({
          code:'1005',
          msg:'更新失败~~',
          data:null
      })
    }
  });
module.exports = router;
