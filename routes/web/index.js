const express = require('express');
const AccountModel = require('../../models/AccountModel')
const moment=require('moment')
const checkingLoginMiddleware=require('../../Middlewares/checkLoginMiddleware')
const router = express.Router();
// // 确保 `accounts` 为空时，也有默认数组
// db.defaults({ accounts: [] }).write();

router.get('/',(req,res)=>{
  res.redirect('/account');
})

router.get('/account', checkingLoginMiddleware,async function (req, res, next) {
  try {
  
    // 按 `time` 降序获取所有账单数据
    const accounts = await AccountModel.find().sort({ time: -1 });

    // 渲染页面
    res.render('list', { accounts: accounts, moment: moment });
  } catch (error) {
    console.error(error);
    res.status(500).send('读取失败~~~');
  }
});

   

router.get('/account/create', checkingLoginMiddleware,function(req, res, next) {
  res.render('create')
});

router.post('/account',checkingLoginMiddleware, async (req, res) => {
  try {
    //可加入表单验证，配置相应的code
    const newAccount = await AccountModel.create({
      ...req.body,
      time: moment(req.body.time).toDate()
    });

    res.render('success', { msg: '添加成功~~~', url: '/account' });
  } catch (error) {
    console.error(error);
    res.status(500).send('数据库写入失败');
  }
});


router.delete('/account/:id', checkingLoginMiddleware,async (req, res) => {
  try {
    // 获取 params 的 id 参数
    let id = req.params.id;

    // 执行删除操作
    const result = await AccountModel.deleteOne({ _id: id });

    // 检查是否有匹配的文档被删除
    if (result.deletedCount === 0) {
      return res.status(404).send('未找到该记录，删除失败');
    }

    // 删除成功，渲染成功页面
    res.render('success', { msg: '删除成功~~~', url: '/account' });
  } catch (error) {
    console.error(error);
    res.status(500).send('服务器错误，删除失败');
  }
});

module.exports = router;
