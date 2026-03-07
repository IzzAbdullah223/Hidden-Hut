import {type Request, type Response, type NextFunction} from 'express'
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