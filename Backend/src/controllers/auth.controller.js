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

    const emailVerificationToken=jwt.sign({
        email:user.email
    },process.env.JWT_SECRET)


    await sendEmail({
        to:email,
        subject:"Welcome to Xhancy-Ai",
        html:`
                <p>Hii ${username},</p>
                <p>Thankyou for registering At Xhancy-Ai. We re Excited to have you on board!</p>
                <p>Please verify your email by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best Regards, 
                <br/> 
                The Xhancy-Ai team
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

export async function login(req,res){
    const {email,password}=req.body

    const user=await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid email or Password",
            success:false,
            err:"User not found"
        })
    }

    const isPsswordMatch=await user.comparePassword(password)

    if(!isPsswordMatch){
            return res.status(400).json({
            message:"Invalid email or Password",
            success:false,
            err:"Incorrect Password"
        })
    }

    if(!user.verified){
            return res.status(400).json({
            message:"Please verify your Email Before Logging In",
            success:false,
            err:"Email Not verified"
        })
    }

    const token =jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{expiresIn:'7d'})

    res.cookie('token',token)

    res.status(200).json({
        message:"User logged in Successfully",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

export async function getMe(req,res) {
        const userId=req.user.id

        const user=await userModel.findById(userId)

        if(!user){
            return res.status(404).json({
                message:"user not Found",
                success:false,
                err:"User Not found"
            })
        }

        res.status(200).json({
            message:"User detailed fetched Successfully",
            success:true,
            user
        })
}

export async function verifyEmail(req,res){
    const {token}=req.query
    try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    const user=await userModel.findOne({email:decoded.email})

    if(!user){
        return res.status(400).json({
            message:"Inavalid Token",
            success:false,
            err:"User Not found"
        })
    }

    user.verified=true

    await user.save()

    const html=`
        <h1>Email Verified Successfully</h1>
        <p>Your email has been verified successfully. You can now login to your account.</p>
        <a href="http://localhost:3000/login">Login Now</a>
    `

   return res.send(html)
    }catch(err){
    return res.status(400).json({
        message:"Invalid or expired token",
        success:false,
        err:err.message
    })
}
}