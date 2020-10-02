const mongoose = require('mongoose');
const { object } = require('underscore');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let CategoriaSchema = new Schema({
    nombre:{
        required:[true, 'El nombre es requerido'],
        type:String,
        unique:true,
    },
    usuario:{
        type:mongoose.ObjectId,
        required:[true,'El usuario es requerido'],
        ref: 'Usuario'
    }
})
// CategoriaSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico'});

module.exports = mongoose.model('Categoria',CategoriaSchema);