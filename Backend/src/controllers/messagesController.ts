import {type Request, type Response} from 'express'

export function getMessages(req:Request,res:Response){
    console.log("Hello I am message get ")
    return res.status(200).json({
        sucess:true
    })
}

export function postMessage(req:Request,res:Response){
    console.log("Hello I am message post ")
}