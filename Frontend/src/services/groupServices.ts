
export async function getGroups(){
     const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/groups`,{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })
     
    return response
}

export async function createGroup(formData:FormData){
      const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/groups`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
    })

    return response
}

export async function getGroup(groupId:string | undefined){
     const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/groups/${groupId}`,{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })

    
     
    return response
}
