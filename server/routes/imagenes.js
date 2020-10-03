const express = require('express');
const fs = require('fs');
const path = require('path');
const {verificarTokenImage} = require('../middlewares/autentificacion');
let app = express();
app.get('/imagen/:tipo/:img',verificarTokenImage,(req,res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathURL = path.resolve(__dirname,`../../uploads/${tipo}/${img}`); 
    if(fs.existsSync(pathURL)){
        res.sendFile(pathURL);
    }else{
        let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg')
        res.sendFile(noImagePath);
    }
})

module.exports=app;