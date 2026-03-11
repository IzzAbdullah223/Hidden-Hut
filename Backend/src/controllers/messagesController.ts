import e, {type Request, type Response} from 'express'
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


  const message = req.body.message as string | undefined
  const senderId = req.user.id

  if(!message?.trim() && !req.file){
    return res.status(400).json({
        message:"Message or image required"
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

 
    await db.postMessage(senderId, message, imageUrl)
    
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


export async function getDirectedMessages(req:Request,res:Response){
   if(!req.user){
      return res.status(401).json({
        message:"Unauthorized"
      })
   }

   const senderId = req.user.id
   const recipentId = Number(req.params.id)
   const messages = await db.fetchDirectedMessages(senderId,recipentId)

   return res.status(200).json(messages)
}

export async function postDirectedMessage(req:Request,res:Response){
    
 
  if (!req.user) {
    return res.status(401).json({
      message: false
    })
  }


  const message = req.body.message as string | undefined
  const senderId = req.user.id
  const recipentId = Number(req.params.id)

  if(!message?.trim() && !req.file){
    return res.status(400).json({
        message:"Message or image required"
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

 
    await db.postDirectedMessage(senderId,recipentId, message, imageUrl)
    
    return res.status(201).json({
      success: true
    })
  } catch (err) {
   
    return res.status(500).json({
      success: false
    })
  }   
    
 
}

export async function getGroupMessages(req:Request,res:Response){
  
   if(!req.user){
      return res.status(401).json({
        message:"Unauthorized"
      })
   }

    
   const groupId = Number(req.params.id)
 
   try{
     const groupMessages = await db.fetchGroupMessages(groupId)
     return res.status(200).json(groupMessages)
   }catch(err){
    return res.status(500).json({
      message:"Failed to fetch group messages"
    })
   }
    
}

export async function postGroupMessages(req:Request,res:Response){
    
  if (!req.user) {
    return res.status(401).json({
      message: false
    })
  }


  const message = req.body.message as string | undefined
  const senderId = Number(req.user.id)
  const groupId = Number(req.params.id)

  if(!message?.trim() && !req.file){
    return res.status(400).json({
        message:"Message or image required"
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

 
    await db.postGroupMessage(senderId,groupId, message, imageUrl)
    
    return res.status(201).json({
      success: true
    })
  } catch (err) {
   
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

