import {type Response, type Request} from 'express'
import * as db from '../db/queries.js'


export async function getFriends(req:Request,res:Response){
    console.log("We are here")
    try{
        const users = await db.getUsers()
        console.log(users)
        return res.status(200).json(users)
    }
    catch(err){
        res.status(500).json({
            message:"Failed to get users"
        })
    }
}