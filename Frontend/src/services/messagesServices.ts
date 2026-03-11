 
export async function fetchGlobalMessages(){
    const response = await fetch('http://localhost:3000/global/messages',{
        method:"GET",
        headers:{'Content-Type': 'application/json'}
    })

    return response
}

export async function fetchDirectedMessages(Id:number){
    const token  = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/chats/${Id}/messages`,{
        method:"GET",
        headers:{'Content-Type':'application/json',
                 'Authorization':`Bearer ${token}`
        }
        
    })

    return response
}

export async function fetchGroupMessages(Id:number){
    const token  = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/chats/group/${Id}/messages`,{
        method:"GET",
        headers:{'Content-Type':'application/json',
                 'Authorization':`Bearer ${token}`
        }
        
    })
    return response 
}

 
export async function sendGlobalMessage(formData:FormData){
     const token  = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/global/messages',{
        method:"POST",
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
    })
    
    return response
}

export async function sendDirectedMessage(formData:FormData,recipentId:string | undefined){
    const token  = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/chats/${recipentId}/messages`,{
        method:"POST",
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
    })
    
    return response
}

export async function sendGroupMessage(formData:FormData,groupId:string | undefined){
    const token  = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/chats/group/${groupId}/messages`,{
        method:"POST",
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:formData
    })
    
    return response
}

 
 
 

export async function deleteMessage(messageId:number){

     
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/global/messages`,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({
            messageId:messageId
        })
    })
    return response
}

 
 