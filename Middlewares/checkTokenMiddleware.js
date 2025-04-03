const jwt=require('jsonwebtoken')
const util = require('util');
const {secret}=require('../config/config')
const verifyToken = util.promisify(jwt.verify); // 让 jwt.verify() 变成支持 await
module.exports=async(req,res,next)=>{
    let token = req.get('token');
    if (!token) {
      return res.json({
        code: '2003',
        msg: 'token缺失',
        data: null
      });
    }
    try {
        // 这里要加 await，否则 verifyToken() 返回的是 Promise 而不是解码数据
      let decoded = await verifyToken(token, secret);
      req.user=decoded;
      next();
    } catch (err) {
      return res.json({
        code: '2004',
        msg: 'token校验失败',
        data: null
      });
    }
  
}