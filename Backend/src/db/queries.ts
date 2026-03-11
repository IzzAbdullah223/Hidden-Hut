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
            profileBanner:true,
            friends:true
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
                    username:true,
                    firstName:true,
                    lastName:true,
                    pictureURL:true,
                }
            }
        }
        })

    return globalMessages
}

export async function fetchDirectedMessages(senderId:number,recipientId:number){
    const directedMessages = await prisma.message.findMany({
        select:{
            id:true,
            date:true,
            content:true,
            imageUrl:true,
            senderId:true,
            recipentId:true,
            sender:{
                select:{
                    username:true,
                    firstName:true,
                    lastName:true,
                    pictureURL:true
                }
            },
            recipent:{
                select:{
                    username:true,
                    firstName:true,
                    lastName:true,
                    pictureURL:true,
                }
            }
            
        },
        where:{type:"DIRECTED",
            OR:[
                {senderId:senderId,recipentId:recipientId},
                {senderId:recipientId,recipentId:senderId}
            ]
        }
    })

    return directedMessages
}

export async function fetchGroupMessages(groupId:number){
  const groupMessages = await prisma.message.findMany({
    where:{type:"GROUP",groupId:groupId},
        select:{
            id:true,
            date:true,
            content:true,
            imageUrl:true,
            senderId:true,
            sender:{
                select:{
                    username:true,
                    firstName:true,
                    lastName:true,
                    pictureURL:true,
                }
            }
        }
  })

  return groupMessages
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

export async function postDirectedMessage(senderId:number,recipentId:number,message?:string,image?:string){

  await prisma.user.update({
    where:{id:senderId},
    data:{
        friends:{connect:{id:recipentId}}
    }
  })

  await prisma.user.update({
    where:{id:recipentId},
    data:{
        friends:{connect:{id:senderId}}
    }
  })

  

  await prisma.message.create({
    data:{
        senderId:senderId,
        recipentId:recipentId,
        content:message ?? null,
        imageUrl: image ?? null,
        type:"DIRECTED"
    }
  })
}

export async function postGroupMessage(senderId:number,groupId:number,message?:string,image?:string){
    await prisma.message.create({
        data:{
            senderId:senderId,
            groupId:groupId,
            content:message ?? null,
            imageUrl:image ?? null,
            type:"GROUP"
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


export async function changeProfileBanner(Id:number,image:string){
   await prisma.user.update({
    where:{id:Id},
    data:{profileBanner:image}
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

export async function getFriends(Id:number){ //adjst this function to not get password when getting friends
  
    const User = await prisma.user.findUnique({
        where:{id:Id},
        
        include:{friends:true}
    })

    return User?.friends
}


export async function createGroup(groupName:string,groupPicture:string,MembersId:number[]){
await prisma.group.create({
  data: {
    name: groupName,
    pictureUrl: groupPicture,
    members: {
      connect: MembersId.map(id => ({ id: id }))
    }
  }
})
}

export async function getGroups(userId:number){
  console.log(userId)
  const [groups, count] = await Promise.all([
    prisma.group.findMany({
      where: {
        members: {
          some: {
            id: userId  // Find groups where this user is a member
          }
        }
      }
    }),
    prisma.group.count({
      where: {
        members: {
          some: {
            id: userId
          }
        }
      }
    })
  ])
  return { groups, count }
}

export async function getGroup(groupId:number){

    const group = await prisma.group.findUnique({
        where:{id:groupId}
    })
    return group
}




