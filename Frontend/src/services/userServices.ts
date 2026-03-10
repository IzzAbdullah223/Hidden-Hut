import {type TeditProfileSchema, type TchangePasswordSchema} from '../lib/types'

 const token = localStorage.getItem('token')
 const currentuseridabove = localStorage.getItem("currentUserId")

export async function fetchUsers(){
    
    const response = await fetch(`http://localhost:3000/chats`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
 
    })

    return response
}

export async function fetchUser(userId:number ){

    const response = await fetch(`http://localhost:3000/profile/${userId}`,{
        method:"GET",
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })

    return response
}

export async function editProfile(data:TeditProfileSchema,userId:string | undefined){
    const response = await fetch(`http://localhost:3000/profile/edit/${userId}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({
            data:data,
            userId:userId
        })
    })

  const responseData =  await response.json()

     if(!response.ok){
         return {success:false, errors: responseData.errors}
     }

     return {success:true}
}

export async function changeProfilePicture(formData:FormData){
 
    const userId = formData.get('userId')
    const response = await fetch(`http://localhost:3000/profile/${userId}/picture`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
 
    })

    return response
}

export async function passwordChange(formData:TchangePasswordSchema){

 
      const response = await fetch('http://localhost:3000/profile/change/password',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(formData)
      })

        const responseData =  await response.json()

     if(!response.ok){
         return {success:false, errors: responseData.errors}
     }

     return {success:true}
}

export async function changeProfileBanner(formData:FormData){
    const response = await fetch(`http://localhost:3000/profile/banner`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
    })

    return response
}

export async function getFriend(friendId:number){
    const response = await fetch(`http://localhost:3000/chats/friend/${friendId}`,{
        method:'GET',
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })

    return response
}

export async function getFriends(){
    const response = await fetch(`http://localhost:3000/chats/friends`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })
 
    return response
}
 
 