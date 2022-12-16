const path  = require('path');
const express = require('express');
const ejs = require ('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const res = require('express/lib/response');
const app   = express();

const Connection=mysql.createConnection({
    host:'127.0.0.1',
    port:45001,
    user:'dbuser1',
    password:'user123',
    database:'tutorial1'
});
Connection.connect(function(error){
    if(!!error)
    console.log(error);
    else
    console.log('Database Connected');
});

//Set view file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));

app.get('/',(req,res)=>{
    //res.send("CRUD Application");
    let sql = "SELECT * FROM crud ";
    let query = Connection.query(sql,(err,rows)=>{
        if(err) throw err;
        res.render('user_index',{
            title:'CRUD APPLICATION',
            users: rows
        });
    });
    
});

//Add New User
app.get('/add',(req,res)=>{
    res.render('user_add',{
        title: 'CRUD APPLICATION'
    });
});

app.post('/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO crud SET ?";
    let query = Connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//Edit User
app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from crud where ID = ${userId}`;
    let query = Connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'CRUD APPLICATION',
            user : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const userId = req.body.ID;
    let sql = "update crud SET name='"+req.body.name+"',  Email='"+req.body.Email+"',  Phone_no='"+req.body.Phone_no+"' where ID ="+userId;
    let query = Connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from crud where id = ${userId}`;
    let query = Connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
 
 
//server Listening
app.listen(3001,()=>{
    console.log('server is running at port 3001');
    
})