//=================
//puerto
//================
process.env.PORT=process.env.PORT || 3000;

//=================
//Entorno
//================

process.env.NODE_ENV = process.env.NODE_ENV ||'dev';

//=================
// Base de datos
//================
let urlDB;

if (process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe';
}else{
    urlDB=process.env.MONGO_URI;
}

process.env.URLDB=urlDB;

//=================
// Vencimiento del tokens
//================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días 
process.env.CADUCIDAD_TOKEN = '48h';

//=================
// Seed de autentificación
//================

process.env.SEED =  process.env.SEED || 'esto-es-el-seed-desarrollo'

//=================
// Google client ID
//================
process.env.CLIENT_ID = process.env.CLIENT_ID || '939028737712-m1i2fp7h821ngq89oca580j02io2mq67.apps.googleusercontent.com';
