import {type Request, type Response} from 'express'
import * as db from '../db/queries.js'
import cloudinary from '../config/cloudinary.js'
import { editProfileSchema,changePasswordSchema } from '../libs/types.js'
import bcrypt from 'bcryptjs'
 
 


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
  

    if(!result.success){
        return res.status(400).json({ message: "Invalid input" }) 
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
    const body: unknown = req.body

    const result = changePasswordSchema.safeParse(body);

     if (!result.success) {
        return res.status(400).json({ message: "Invalid input" })   
    }
     if(!req.user){ // check if the request is authenticated the valid jwt so we can use userId
        return res.status(401).json({
            message:"Unauthorized"
        })
    }   
        const userId = req.user.id
        const user = await db.findUserByIdPassword(userId)

        if (!user) { // check if the user exists in the database 
            return res.status(404).json({ message: "User not found" })
    }

        const isMatch = await  bcrypt.compare(result.data.password,user.password)

        if(!isMatch){
            return res.status(400).json({
                errors:{password:"Old password is incorrect"}
            })
        }

        
        const newPassword = await bcrypt.hash(result.data.newPassword,10)
        await db.changePassword(userId,newPassword)
        return res.status(200).json({
            message:"success"
        })
}

export async function changeProfileBanner(req:Request,res:Response){
    let imageUrl:string =''
    if(!req.user){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const userId = req.user.id
    try{
        if(req.file){
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image"
            })
        imageUrl = cloudinaryResult.secure_url
        await db.changeProfileBanner(userId,imageUrl)
        return res.status(200).json({
            message:"success"
        })
        }
    }catch(e){
        return res.status(500).json({
            message:"Failed to change banner"
        })
    }
}

 