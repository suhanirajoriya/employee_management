var express = require('express');
var routers = express.Router();
var pool = require('./pool');
var upload=require('./multer')
var fs = require('fs');



routers.get('/Button',function(req,res,next){
    res.render('sign_up')
})

routers.get('/employeeinterface', function (req, res, next) {
    try{
        var emp=JSON.parse(localStorage.getItem('Admin'))
if(emp==null)
{
    res.render('login_page_2',{message:''})
}

    res.render('employeeinterface',{status:null,message:''})
    }
    catch(e)
    {
        res.render('login_page_2',{message:''})
    }
});

routers.post('/submit_employee_record',upload.single('picture'), function (req, res, next) {
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)
    var empname = req.body.first+" "+ req.body.last
   
       pool.query('insert into employees(employeename, Dob, gender, address, state, city, emailaddress, contactnumber, picture) values(?,?,?,?,?,?,?,?,?)',
    [empname, req.body.Dob, req.body.gender, req.body.address,
    req.body.state, req.body.city, req.body.emailaddress, 
    req.body.contactnumber, req.file.filename],
        function (error, result) {
            if (error) {
                console.log(error)
                res.render('employeeinterface', {status:0 })
            }
            else {
                console.log(result)
                res.render('employeeinterface', { status:1 })
            }
            
        })
});

routers.get('/display_employee',function(req,res,next){
    try{
        var emp=JSON.parse(localStorage.getItem('Admin'))
        if(emp==null)
        {
            res.render('login_page_2',{message:''})
        }
   pool.query('select E.*,(select statename from states S where S.stateid=E.state) as sname,(select cityname from cities C where C.cityid=E.city) as cname from employees E',function(error,result){
    if(error)
    {
        res.render("displayemp",{status:false,result:[],message:''})
    }
    else
    {
        res.render("displayemp",{status:true,result:result,message:''})  
    }
})  
    }catch(e)
    {
        res.render('login_page_2',{message:''})
    }  
})

routers.get('/display_by_id',function(req,res){
    var empname = req.query.first + " " + req.query.last

pool.query('select E.*,(select statename from states S where S.stateid=E.state) as sname,(select cityname from cities C where C.cityid=E.city) as cname from employees E where employeeid=?',
[req.query.eid],
    function(error,result){
        if(error)
        {
            res.render('displaybyid',{status:false,result:[]})
        }
        else
        {
            res.render('displaybyid',{status:true,result:result[0]})
        }
    })

})
routers.post('/update_data',function(req,res){
    if(req.body.action=='Update')
    {
    var empname = req.body.first + " " + req.body.last
pool.query('update employees set employeename=?, Dob=?, gender=?, address=?, state=?, city=?, emailaddress=?, contactnumber=? where employeeid=?',
[empname, req.body.Dob, req.body.gender, req.body.address,
    req.body.state, req.body.city, req.body.emailaddress, 
    req.body.contactnumber, req.body.employeeid],
    function(error,result) {

        if(error)
        {
            res.redirect('/employee/display_employee')
        }
        
        else
        {
            res.redirect('/employee/display_employee')

        }
    } )
}
else
{
    pool.query('delete from employees where employeeid=?',[req.body.employeeid],function(error,result){
        if(error)
        { console.log(error)
            res.redirect('employee/display_employee')
        }

        else
        {
            res.redirect('employee/display_employee')
        }

    })
}
})

routers.get('/display_picture',function(req,res,next){
    res.render('display_picture',{eid:req.query.eid,ename:req.query.ename,picture:req.query.picture})
})




routers.post('/edit_employee_picture',upload.single('picture'), function (req, res, next) {
       
       pool.query('update employees set picture=? where employeeid=?',
    [ req.file.filename,req.body.employeeid],
        function (error, result) {
            if (error) {
                console.log(error)
                res.redirect('/employee/display_employee')
            }
            else {
                console.log(result)
                res.redirect('/employee/display_employee')
                var filePath = 'C:/users/shiva/employeemanagement/public/images/'+req.body.old_picture; 
                fs.unlinkSync(filePath);


            }
            
        })
});


module.exports = routers;
