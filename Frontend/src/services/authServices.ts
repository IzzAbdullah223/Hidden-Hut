import  {type TSignUpSchema}  from "../lib/types"
 

export async function signUp(data:TSignUpSchema){
     const response = await fetch('http://localhost:3000/signup',{
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
     })

     console.log(response)

     
}