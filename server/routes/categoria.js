const express = require('express');
const _=require('underscore');
let {verificaToken, verificaRole} = require('../middlewares/autentificacion');
const categoria = require('../models/categoria');

let app = express();
let Categoria = require('../models/categoria');


//Mostrar todas las categorias
app.get('/categoria',verificaToken,(req,res)=>{
    Categoria.find({})
    .sort({'nombre':'asc'})
    .populate('usuario','nombre email')
    .exec((err,categorias)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        Categoria.countDocuments({estado:true},(err,conteo)=>{
            res.json({
                ok:true,
                categorias,
                total:conteo
            });
        })
    })
});

//Mostrar una categoria por ID
app.get('/categoria/:id',[verificaToken],(req,res)=>{
    let id = req.params.id;
    Categoria.findById(id,(err,categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Categoria no encontrada'
                }
            });
        }
        if(!categoriaDB){return res.status(400).json({ok:false,err});}
        res.json({
            ok:true,
            categoria:categoriaDB
        });
    })
});
//Crear nueva categoria
app.post('/categoria',verificaToken,(req,res)=>{
    let body=req.body;
    let categoria = new Categoria({
        nombre:body.nombre,
        usuario:req.usuario._id,
    });
    categoria.save((err,categoriaDB)=>{
        if(err){return res.status(400).json({ok:false,err});}
        if(!categoriaDB){return res.status(400).json({ok:false,err});}
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    });
});
//Actualizar una categoria
app.put('/categoria/:id',verificaToken,(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['nombre']);
    Categoria.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,categoriaBD)=>{
        if(err){return res.status(400).json({ok:false,err});}
        if(!categoriaBD){return res.status(400).json({ok:false,err});}

        res.json({
            ok:true,
            categoria:categoriaBD
        });
    })
});

//Eliminar las categorias
app.delete('/categoria/:id',[verificaToken,verificaRole],(req,res)=>{
    let id = req.params.id;
    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
        if(err){return res.status(400).json({ok:false,err});}
        if(!categoriaDB){return res.status(400).json({ok:false,err:{message:'El ID no existe'}});}

        res.json({
            ok:true,
            message:'Categoria borrada'
        })
    })
});

module.exports=app;