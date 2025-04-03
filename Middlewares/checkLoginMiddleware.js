//检查是否登录的中间件
module.exports=(req,res,next)=>{
    if(!req.session.username){
      return res.redirect('login');
    }
    next();
  }