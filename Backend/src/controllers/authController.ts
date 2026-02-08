import {type Request, type Response} from 'express'
import bcrypt from 'bcryptjs'


export async function signUpPost(req:Request,res:Response){
     console.log(req.body)

    res.status(200).json({
        message:"Test message"
    })

}