require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app= express();
const bodyParser = require('body-parser');

//parse application /x-www-form-undercoded
app.use(bodyParser.urlencoded({extended:false}))
//parse application/json
app.use(bodyParser.json());
//configuracion de rutas
app.use(require('./routes/index'));
//habilitar el public 
app.use(express.static(path.resolve(__dirname,'../public')));



mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false})

app.listen(process.env.PORT,()=>{
    console.log("Escuchando puerto: ",3000);
})

