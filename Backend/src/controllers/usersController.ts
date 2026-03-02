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