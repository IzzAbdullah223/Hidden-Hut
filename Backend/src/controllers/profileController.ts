import {type Request, type Response} from 'express'
import * as db from '../db/queries.js'


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