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