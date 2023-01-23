const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('./public/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

const mongo_uri = 'mongodb+srv://Yerson:12345@cluster0.gauckiw.mongodb.net/Login?retryWrites=true&w=majority';

mongoose.connect(mongo_uri, function(err){
    if(err){
        throw err;
    }else{
        console.log(`Successfully connected to ${mongo_uri}`);
    }
})
app.post('/register', (req,res)=>{
    const {username,password} = req.body;

    const user = new User({username, password})

    user.save(err =>{
        if(err){
            res.status(500).send('Error al registrar el usuario')
        }else{
            res.status(200).send('Usuario registrado')
        }
    });
});

app.post('/authenticate', (req,res)=>{

    const {username, password} = req.body;

    User.findOne({username}, (err,user) =>{
        if(err){
            res.status(500).send('Error al autentificar el usuario')
        }else if(!user){
            res.status(500).send('El usuario no existe')
        }else{
            user.isCorrectPassword(password,(err, result)=>{
                if(err){
                    res.status(500).send('Error al autentificar el usuario 2')
                }else if(result){
                    res.status(200).send('Usuario Autenticado correctamente')
                }else{
                    res.status(500).send('Usuario Y/O contraseña incorrecta')
                }
            });
        }
    });
});

app.listen(3000, ()=>{
    console.log('server started');
})
module.exports=app;
















