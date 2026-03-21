import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.routes.js'
import chatRouter from './routes/chat.routes.js'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'


const app=express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:['GET','POST','PUT','DELETE']
}))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/auth',authRouter)
app.use('/api/chats',chatRouter)

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/index.html'))
})

export default app