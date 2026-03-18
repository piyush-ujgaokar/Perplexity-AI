import { Server } from "socket.io";

let io;

export function initSocket(httpServer){
    io=new Server(httpServer,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    })

    console.log("Socket.Io Server Is Running")

    io.on("connection",(socket)=>{
            console.log("A User Connected :",socket.id)
    })
}

export function getIO(){
    if(!io){
        throw new Error("Socket.Io is Not Initialize")
    }

    return io
}