const jwt=require('jsonwebtoken');

//=====================
//  Verificar token
//=====================

let verificaToken = (req,res,next) =>{

    let token = req.get('token'); // obtienes el token por el header
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next(); 
    })
};
//=====================
//  Verificar ADMINROLE
//=====================

let verificaRole = (req,res,next) =>{

    let role = req.usuario.role; // obtienes el token por el header
    if(role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message:'EL usuario no es administrador'
            }
        })
    }    
};
module.exports={
    verificaToken,verificaRole
}