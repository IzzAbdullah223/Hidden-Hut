import { prisma } from "./libs/prisma.js";


export async function findUserByEmail(email:string){

    const existingUser = await prisma.user.findUnique({
        where:{email:email}
    })

    return existingUser
}



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


