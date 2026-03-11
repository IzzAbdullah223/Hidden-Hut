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

export async function createGroup(formData:FormData){
     
    const response = await fetch(`http://localhost:3000/groups`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
    })

    return response
}

export async function getGroup(groupId:string | undefined){
    const response = await fetch(`http://localhost:3000/groups/${groupId}`,{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
        }
    })

    
     
    return response
}
