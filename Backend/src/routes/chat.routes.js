import {Router} from 'express'
import { sendMessage } from '../controllers/chat.controller.js'
import { authuser } from '../middleware/auth.middleware.js'


const chatRouter=Router()

chatRouter.post('/message',authuser,sendMessage)

export default chatRouter