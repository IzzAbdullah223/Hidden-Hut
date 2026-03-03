export async function fetchUsers(){
    const token = localStorage.getItem('token')
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
    const token = localStorage.getItem('token')
    console.log(userId)

    const response = await fetch(`http://localhost:3000/profile/${userId}`,{
        method:"GET",
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })

    return response
}

export async function changeProfilePicture(formData:FormData){
 
    const userId = formData.get('userId')
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/profile/${userId}`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
 
    })

    return response
}
 