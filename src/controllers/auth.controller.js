import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'



export async function register(req,res){

    const {email,password,username}=req.body

    const isUserAlreadyExists=await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User or Email Already Exists",
            success:false,
            err:"User Already Exists"
        })
    }

    // const hashPassword=await bcrypt.hash(password,10)

    const user=await userModel.create({
        email,
        username,
        password
    })



}