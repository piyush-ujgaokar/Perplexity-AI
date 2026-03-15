import { Router } from "express"
import {register} from '../controllers/auth.controller.js'
import { registerValidator } from "../validators/auth.validator.js"

const authRouter=Router()

authRouter.post('/register',register,registerValidator)



export default authRouter