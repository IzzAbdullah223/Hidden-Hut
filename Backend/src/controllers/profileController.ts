import {type Request, type Response} from 'express'
import * as db from '../db/queries.js'
import cloudinary from '../config/cloudinary.js'
import { editProfileSchema } from '../libs/types.js'
 


export async  function getProfile(req:Request,res:Response){
    const userId = Number(req.params.id)
    try{
        const user = await db.findUserById(userId)
        if(!user){
            return res.status(401).json({
                message:"User not found."
            })
        }
        return res.status(200).json(user)
    }catch(error){
        return res.status(500).json({
            message:"Failure"
        })
    }

   
 
}

export async function changeProfilePicture(req:Request,res:Response){
    const userId = Number(req.body.userId)
    let imageUrl:string =''
 
     try{
        if (req.file) {
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image"
            })
              imageUrl = cloudinaryResult.secure_url
            }
                await db.changeProfilePicture(userId,imageUrl)
                return res.status(200).json({
                    message:"success"
                })
    }catch(e){
        return res.status(200).json({
            message:"Failure"
        })
    }
    
}

export async function editProfile(req:Request,res:Response){
        const currentUserId= Number(req.body.userId)
       const body: unknown = req.body.data
       const result = editProfileSchema.safeParse(body);
       let zodErrors = {};

    if(!result.success){
        result.error.issues.forEach((issue)=>{
            zodErrors = {...zodErrors, [issue.path[0] as string]:issue.message}
        })
        return res.status(400).json({errors:zodErrors})
    }

    const existingUser = await db.findUserByUsername(result.data.username)

    if(existingUser && existingUser.id!== currentUserId){
        res.status(400).json({
            errors:{username:"Username already exists"}
        })
    }
    else{
        await db.editProfile(currentUserId,result.data.username,result.data.fName,result.data.lName,result.data.bio)
        res.status(200).json({
            message:"success"
        })
    }
}

export async function changePassword(req:Request,res:Response){
    console.log(req.body)
}