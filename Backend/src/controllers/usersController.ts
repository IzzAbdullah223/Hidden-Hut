import {type Response, type Request} from 'express'
import * as db from '../db/queries.js'


export async function getUsers(req:Request,res:Response){

    try{
        
            const users = await db.getUsers()
            return res.status(200).json(users)
           }
    catch(err){
        res.status(500).json({
            message:"Failed to get users"
        })
    }
}

export async function getUserFriends(req:Request,res:Response){
    if(!req.user){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const userId = req.user.id
    try{
        const Friends = await db.getFriends(userId)
        return res.status(200).json(Friends)
    }catch(err){
        return res.status(500).json({
            message:"Failed to retrieve friends."
        })
    }
}
