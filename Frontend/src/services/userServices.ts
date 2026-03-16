import {type TeditProfileSchema, type TchangePasswordSchema} from '../lib/types'

 
 

export async function fetchUsers(){
     const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chats`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },
 
    })

    return response
}

export async function fetchUser(userId:number ){
     const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/${userId}`,{
        method:"GET",
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })

    return response
}

export async function editProfile(data:TeditProfileSchema,userId:string | undefined){
     const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/edit/${userId}`,{
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
     const token = localStorage.getItem('token')
    const userId = formData.get('userId')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/${userId}/picture`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
 
    })

    return response
}

export async function passwordChange(formData:TchangePasswordSchema){
       const token = localStorage.getItem('token')
 
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/change/password`,{
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
     const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/banner`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
    })

    return response
}

export async function getFriend(friendId:number){
     const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/friend/${friendId}`,{
        method:'GET',
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })

    return response
}

export async function getFriends(){
     const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/friends`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    })
 
    return response
}
 
 