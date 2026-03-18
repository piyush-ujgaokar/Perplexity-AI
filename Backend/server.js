import "dotenv/config"
import app from './src/app.js'
import http from 'http'
import connectToDb from './src/config/db.js';
import { initSocket } from "./src/sockets/server.socket.js";


connectToDb()

const httpServer=http.createServer(app)

initSocket(httpServer)

const PORT=process.env.PORT

httpServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
