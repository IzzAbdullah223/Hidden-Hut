import {type Request, type Response} from 'express'
import * as db from '../db/queries.js'
import cloudinary from '../config/cloudinary.js'
 
 

export async  function getMessages(req:Request,res:Response){

    try{
        const messages = await db.fetchMessages()
        return res.status(200).json(messages)
    }catch(err){
        return res.status(500).json({
            message:"Failed to retrive messages"
        })
    }
      

      
}

export async function postMessage(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: false
    })
  }

  const message = req.body.message as string
  const senderId = req.user.id
  
  if (!message.trim()) {
    return res.status(400).json({
      message: "Message cannot be empty"
    })
  }

  let imageUrl: string | undefined = undefined

  try {
    // If user uploaded an image, upload to Cloudinary first
    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image"
      })
      imageUrl = cloudinaryResult.secure_url
    }

    console.log(senderId)
    console.log(message)
    console.log(imageUrl)
    //await db.postMessage(senderId, message, imageUrl)
    
    return res.status(201).json({
      success: true
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false
    })
  }
}

 

export async function deleteMessage(req:Request,res:Response){
    const messageId = req.body.messageId as number
    try{
        await db.deleteMessage(messageId)
        res.status(200).json({
            sucess:true
        })
    }catch(err){
        res.status(500).json({
            sucess:false
        })
    }
}

