import { prisma } from "./libs/prisma.js";



export async function signUp(email:string,fName:string,lname:string,password:string){
    
     await prisma.user.create({
        data:{
            email:email,
            firstName:fName,
            lastName:lname,
            password:password
        }
    })
}


export async function findUserByEmail(email:string){
    const existingUser = await prisma.user.findUnique({
        where:{email:email}
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

export async function postMessage(Id:number,message:string){
 
    await prisma.message.create({
        data:{
            content:message,
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


