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

 


export async function findUserByUsername(username:string){
    const existingUser = await prisma.user.findUnique({
        where:{username:username}
    })
    return existingUser
}

export async function findUserById(userId:number){
    const user = await prisma.user.findUnique({
        where:{id:userId},
        select:{
            id:true,
            firstName:true,
            lastName:true,
            username:true,
            pictureURL:true,
            bio:true,
        }
    })

    return user
}

export async function findUserByIdPassword(userId:number){
    const user = await prisma.user.findUnique({
        where:{id:userId},
        select:{
            id:true,
            password:true,
        }
    })

    return user
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


export async function changeProfilePicture(Id:number,image:string){
     await prisma.user.update({
        where:{id:Id},
        data:{pictureURL:image}
     })
}


export async function editProfile(Id:number,username:string,firstName:string,lastName:string,bio?:string){
    await prisma.user.update({
        where:{id:Id},
        data:{
            username:username,
            firstName:firstName,
            lastName:lastName,
            bio: bio ?? null
        }
    })
}

export async function changePassword(Id:number,newPassword:string){
  await prisma.user.update({
    where:{id:Id},
    data:{
        password:newPassword
    }
  })

}

