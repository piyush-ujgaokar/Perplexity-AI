import "dotenv/config"
import app from './src/app.js'
import connectToDb from './src/config/db.js';


connectToDb()

const PORT=process.env.PORT || 8000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
