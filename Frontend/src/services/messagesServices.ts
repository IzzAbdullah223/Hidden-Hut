export async function fetchMessages(){
    const response = await fetch('http://localhost:3000/global/messages',{
        method:"GET",
        headers:{'Content-Type': 'application/json'}
    })

    return response
}