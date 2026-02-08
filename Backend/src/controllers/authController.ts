import {type Request, type Response} from 'express'
import { signUpSchema } from '../libs/types.js'
import bcrypt from 'bcryptjs'


export async function signUpPost(req:Request,res:Response){
    const body: unknown = req.body
    const result = signUpSchema.safeParse(body);
    let zodErrors = {};


    if(!result.success){
        result.error.issues.forEach((issue)=>{
            zodErrors = {...zodErrors, [issue.path[0] as string]:issue.message}
        })
        return res.status(400).json({errors:zodErrors})
    }


    return res.status(200).json({success:true})



}