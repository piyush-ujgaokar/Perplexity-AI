import jwt from 'jsonwebtoken'


export function authuser(req,res,next){
    const {token}=req.cookies

    if(!token){
        return res.status(400).json({
            message:"Unauthorized",
            success:false,
            err:"No Token Provided"
        })
    }
try{
    
    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    req.user=decoded

    next()

}catch(err){
    return res.status(400).json({
        message:"Unauthorized",
        success:false,
        err:"Invalid Token"
    })
}



}