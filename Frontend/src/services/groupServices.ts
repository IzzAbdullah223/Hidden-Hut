const token = localStorage.getItem('token')
export async function getGroups(){
    const response = await fetch('http://localhost:3000/groups',{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })
     
    return response
}

export async function createGroup(){
    const response = await fetch(`http://localhost:3000/groups`,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })

    return response
}