import {type Response, type Request} from 'express'
import * as db from '../db/queries.js'


export async function searchUsers(req:Request,res:Response){
     const query = req.body.search as string

 
    try{
        if(!query){
            const users = await db.getUsers()
            return res.status(200).json(users)
        }
        else{
            const users = await db.searchUsers(query)
            return res.status(200).json(users)
        }
 
    }
    catch(err){
        res.status(500).json({
            message:"Failed to get users"
        })
    }
}