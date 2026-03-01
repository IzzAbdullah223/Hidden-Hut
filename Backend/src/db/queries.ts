import { prisma } from "./libs/prisma.js";



export async function signUp(username:string,fName:string,lname:string,password:string){
    
     await prisma.user.create({
        data:{
            username:username,
            firstName:fName,
            lastName:lname,
            password:password
        }
    })
}

export async function getUsers(){
    return await prisma.user.findMany({
        select:{
            id:true,
            firstName:true,
            lastName:true,
            username:true,
            pictureURL:true
        }
    })
}

export async function searchUsers(query:string){
    return await prisma.user.findMany({
        where:{
            OR:[
                {firstName:{contains:query,mode:'insensitive'}},
                {lastName:{contains:query,mode:'insensitive'}},
                {username:{contains:query,mode:'insensitive'}}
            ]
        },
        select:{
            id:true,
            firstName:true,
            lastName:true,
            username:true,
            pictureURL:true,
        }
    })
}


export async function findUserByUsername(username:string){
    const existingUser = await prisma.user.findUnique({
        where:{username:username}
    })
    return existingUser
}


export async function fetchMessages(){
    const globalMessages = await prisma.message.findMany({
        where: {type: "GLOBAL"},
        select:{
            id:true,
            date:true,
            content:true,
            imageUrl:true,
            senderId:true,
            sender:{
                select:{
                    firstName:true,
                    lastName:true,
                    pictureURL:true,
                }
            }
        }
        })

    return globalMessages
}

export async function postMessage(Id:number,message?:string,image?:string){
    await prisma.message.create({
        data:{
            content:message ?? null,
            imageUrl:image ?? null,
            type:"GLOBAL",
            senderId:Id
        }
    })
  
}

export async function deleteMessage(Id:number){
    await prisma.message.delete({
        where:{
            id:Id
        }
    })
}


