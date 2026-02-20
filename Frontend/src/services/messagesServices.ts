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