import {type Request, type Response} from 'express'
import { signUpSchema,logInSchema } from '../libs/types.js'
import * as db from '../db/queries.js'
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

    const exisitngUser = await db.findUserByEmail(result.data.email)

    if(exisitngUser){
        res.status(400).json({errors:{email:"Email already exists"}})
    }

    const hashedPassword = await bcrypt.hash(result.data.password,10)
    await db.signUp(result.data.email,result.data.fName,result.data.lName,hashedPassword)
    return res.status(200).json({success:true})
}




export async function logInPost(req:Request,res:Response){
     const body: unknown = req.body
     const result = logInSchema.safeParse(body)
     let zodErrors = {};

     if(!result.success){
        result.error.issues.forEach((issue)=>{
            zodErrors = {...zodErrors,[issue.path[0] as string]:issue.message}
        })
        return res.status(400).json({errors:zodErrors})
     }

     const existinguser = await db.findUserByEmail(result.data.email)

     if(!existinguser){
         return res.status(400).json({errors:{email:"Invalid email or password",password:"Invalid email or password"}});
     }

     return res.status(200).json({
        message: true
     })


}

