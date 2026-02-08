import express from 'express'
import dotenv from 'dotenv';
import './config/passport.js'
import cors from 'cors'
import { authRouter } from './routes/auth.js';


dotenv.config();
const app = express()


app.use(cors())
app.use(express.json())
app.use('/',authRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})