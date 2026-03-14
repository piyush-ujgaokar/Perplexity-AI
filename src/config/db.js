import mongoose from 'mongoose'


async function connectToDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DataBase Connected Successfully")
    }catch(err){
        console.log("Error in DataBase",err)
    }
}

export default connectToDb