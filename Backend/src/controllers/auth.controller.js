import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
// Commented out to disable sending emails during development
// import { sendEmail } from '../services/mail.service.js'


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

    // Auto-verify the user so they can log in immediately
    user.verified = true
    await user.save()

    // Create auth token and set cookie so client can redirect to Dashboard
    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        token,
        user: {
            id: user._id,
            email: user.email,
            username: user.username
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


    const token =jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{expiresIn:'7d'})

    // set cookie with some sensible defaults
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    })

    // return token in response as well so clients that cannot rely on cookies
    // (cross-port dev setups) can use the Authorization header as fallback
    res.status(200).json({
        message: "User logged in Successfully",
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
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
        <a href="">Login Now</a>
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