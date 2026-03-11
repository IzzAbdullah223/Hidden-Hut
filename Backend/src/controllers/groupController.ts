import {type Request, type Response } from 'express'
import cloudinary from '../config/cloudinary.js'
import * as db from '../db/queries.js'


export async function getGroups(req:Request,res:Response){
     if(!req.user){
        return res.status(401).json({
            message:"Unauthorized"
        })
     }
    const userId = req.user.id

    try{
        const groups = await db.getGroups(userId)
        return res.status(200).json(groups)
    }catch(err){
        return res.status(500).json({
            message:"Server failure"
        })
    }
}

export async function getGroup(req:Request,res:Response){
   const groupId = Number(req.params.id)
  
   try{
    const group = await db.getGroup(groupId)
      return res.status(200).json(group)
    }catch(err){
      return res.status(500).json({
        message:"Server error"
      })
    }
   


}

export async function createGroup(req:Request,res:Response){
  if(!req.user){
    return res.status(401).json({
      message:"Unauthorized"
    })
  }
  const currentUserId = req.user.id
  const groupName = req.body.groupName as string
  const groupMembersId = JSON.parse(req.body.groupMembers)
  groupMembersId.push(currentUserId)
 

 
  let imageUrl: string | undefined = undefined

  try {
    // If user uploaded an image, upload to Cloudinary first
    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image"
      })
      imageUrl = cloudinaryResult.secure_url
      await db.createGroup(groupName,imageUrl,groupMembersId)
      return res.status(201).json({
        sucess:"Group created"
      })
    }

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false
    })
  }
   
}