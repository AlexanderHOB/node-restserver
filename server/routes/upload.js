const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id',function(req,res){
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files){
        return res.status(400).json({
            ok:true,
            err:{
                message:'No se ha seleccionado un archivo'
            }
        });
    }
    //validar tipo
    let tipoValidos = ['productos','usuarios']
    if(tipoValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Los tipos permitidos  son ' + tipoValidos.join(','),
                tipoValidos
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length-1]
    //extensiones validas
    let extensionesValidas = ['png','jpg','gif','jpeg']
    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(','),
                extension
            }
        });
    }
    //cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(tipoValidos[1] == tipo){
            imagenUsuario(id,res,nombreArchivo);
        }else{
            imagenProducto(id,res,nombreArchivo);
        }
        // Aquí imagenes cambiadas
        
    })
});

function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id,(err,usuarioDB)=>{
        if(err){
            borraArchivo(nombreArchivo,'usuarios');

            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no existe!'
                }
            });
        }
        borraArchivo(usuarioDB.img,'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err,usuario)=>{
            res.json({
                ok:true,
                usuario,
                img:nombreArchivo
            });
        });

    });
}
function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            borraArchivo(nombreArchivo,'productos');

            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            borraArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Producto no existe!'
                }
            });
        }
        borraArchivo(productoDB.img,'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err,producto)=>{
            res.json({
                ok:true,
                producto,
                img:nombreArchivo
            });
        });

    });
}
function borraArchivo(nombreImagen,tipo){
    let pathURL = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`); 
    if(fs.existsSync(pathURL)){
        fs.unlinkSync(pathURL);
    }
}
module.exports =app;