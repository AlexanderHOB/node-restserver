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
    urlDB='mongodb+srv://user-cafe:z4qTM2XdkrAh5mI8@cluster0.lcqy2.mongodb.net/cafe?retryWrites=true&w=majority'
}

process.env.URLDB=urlDB;