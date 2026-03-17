import "dotenv/config"
import app from './src/app.js'
import connectToDb from './src/config/db.js';

connectToDb()


const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
