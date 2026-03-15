import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../services/mail.service.js'


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

    await sendEmail({
        to:email,
        subject:"Welcome to perplexity",
        html:`
                <p>Hii ${username},</p>
                <p>Thankyou for registering At Perplexity. We re Excited to have you on board!</p>
                <p>Best Regards, 
                <br/> 
                The perplexity team
                </p>`
    })

    res.status(201).json({
        messgae:"user Registered Successfully",
        success:true,
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }
    })



}