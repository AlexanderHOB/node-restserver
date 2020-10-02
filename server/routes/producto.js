const express = require('express');
const { verificaToken } = require('../middlewares/autentificacion');
const _ = require('underscore');
let app = express();
let Producto = require('../models/producto');

//Obtener todos los productos

app.get('/productos',verificaToken,(req,res)=>{
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde)
    limite = Number(limite)

    Producto.find({disponible:true})
    .skip(desde)
    .limit(limite)
    .sort('nombre')
    .populate('usuario','nombre email')
    .populate('categoria','nombre')
    .exec((err,productos)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        Producto.countDocuments({disponible:true},(err,conteo)=>{
            res.json({
                ok:true,
                productos,
                total:conteo
            });
        })
    });
    // populate: usuario categoria
    //paginado
});

app.get('/productos/:id',verificaToken,(req,res)=>{
    let id = req.params.id;
    Producto.findById(id)
    .populate('usuario','nombre email')
    .populate('categoria','nombre')
    .exec((err,productoDB)=>{
        if(err){return res.status(400).json({ok:false,err});}
        if(!productoDB){return res.status(400).json({ok:false,err:{message:'Error al crear el producto'}})}
        res.json({
            ok:true,
            producto:productoDB
        })
    })
});
//buscar productos
app.get('/productos/buscar/:termino',(req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');
    Producto.find({nombre:regex})
    .populate('usuario','nombre email')
    .populate('categoria','nombre')
    .exec((err,productos)=>{
        if(err){return res.status(400).json({ok:false,err});}
        res.json({
            ok:true,
            productos
        })
    })
})
app.post('/productos',verificaToken,(req,res)=>{
    let body = req.body
    let producto = new Producto({
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria:body.categoria,
        usuario:req.usuario._id,
    });
    producto.save((err,productoDB)=>{
        if(err){return res.status(400).json({ok:false,err});}
        if(!productoDB){return res.status(400).json({ok:false,err:{message:'Error al crear el producto'}})}
        res.status(201).json({
            ok:true,
            producto:productoDB
        })

    })
})

app.put('/productos/:id',verificaToken,(req,res)=>{
    let id   = req.params.id;
    let body = _.pick(req.body,['nombre', 'precioUni', 'descripcion', 'categoria']);
    Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,productoDB)=>{
        if(err){return res.status(400).json({ok:false,err});}
        if(!productoDB){return res.status(400).json({ok:false,err:{message:'Producto no encontrado'}})}
        res.json({
            ok:true,
            producto:productoDB
        })
    })
    
});

app.delete('/productos/:id',verificaToken,(req,res)=>{
    id = req.params.id;
    body = {
        disponible:false
    }
    Producto.findByIdAndUpdate(id,body,{new:true},(err,productoDB)=>{
        if(err){return res.status(400).json({
            ok:false,
            err
        })}
        res.json({
            ok:true,
            producto:productoDB,
            message:'Producto no disponible'
        });
    })
    
})

module.exports=app;