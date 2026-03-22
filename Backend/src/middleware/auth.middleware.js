import jwt from 'jsonwebtoken'


export function authuser(req,res,next){
    // accept token from cookie OR Authorization header (Bearer)
    let token = req.cookies?.token

    if(!token){
        const authHeader = req.headers.authorization || req.headers.Authorization
        if(authHeader && authHeader.startsWith('Bearer ')){
            token = authHeader.split(' ')[1]
        }
    }

    if(!token){
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No Token Provided"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid Token"
        })
    }

}