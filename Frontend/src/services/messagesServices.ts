export async function fetchMessages(){
    const response = await fetch('http://localhost:3000/global/messages',{
        method:"GET",
        headers:{'Content-Type': 'application/json'}
    })

    return response
}

export async function sendMessage(message:string){
    const token  = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/global/messages',{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({
            message:message
        })
    })
    
    return response
}

export async function deleteMessage(messageId:number){
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/global/message`,{
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

export async function uploadImage(image:FormData){
    console.log(image)
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/global/message/upload',{
        method:"POST",
        headers:{
            'Authorization':`Bearer ${token}`
        },
        body:image
    })
    
    return response


}