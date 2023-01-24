var express=require('express');
var router = express.Router();
var pool=require('./pool');
var upload=require('./multer')
var fs = require('fs');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/admin_login',function(req,res,next){
  res.render('login_page_2',{message:''})
})

router.post('/check_admin_login',function(req,res,next){
   pool.query('select * from admins where (Emailaddress=? or contactnumber=?) and password=?',[req.body.Email_id,req.body.Email_id,req.body.password],function(error,result){
  
    if(error)
    {
      console.log("erorr",error) 
    }
    else
    {
      if(result.length==1)
      {   console.log('result')
        localStorage.setItem('Admin',JSON.stringify(result[0]))
        res.render('Dashboard',{result:result[0]}) 

        console.log("correect")
      }
      else
      {console.log("correecnnnnnnnn")
       res.render('login_page_2',{message:'INVALID EMAIL ID OR PASSWORD'})
      }

    }
   })
})

router.get('/sign_up_page',function(req,res,next){
  res.render('sign_up',{msg:''})
})

router.post('/create', upload.single('picture'), function(req,res,next){
    var Admin_name=req.body.first+" "+req.body.last
pool.query('insert into admins values(?,?,?,?,?)',
[req.body.emailaddress,Admin_name,req.body.password,req.body.contactnumber,req.file.filename],function(error,result){
if(error)
{console.log(error)
  res.render('sign_up',{msg:'Server Error'})
}
else
{console.log(result)
    res.render('sign_up',{msg:'REGISTRATION SUCCESSFULLY'})
}
})

})


router.get('/logout',function(req,res,next){
  localStorage.clear()
  res.render('login_page_2',{message:''})
})
module.exports=router