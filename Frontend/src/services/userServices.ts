export async function searchUsers(search:string){
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/chats/search`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({search})
    })

    return response
}