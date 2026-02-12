import { type TSignUpSchema, type TLogInSchema } from '../lib/types';

 

export async function signUp(data:TSignUpSchema){
     const response = await fetch('http://localhost:3000/signup',{
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
     })

     const responseData =  await response.json()

     if(!response.ok){
         return {success:false, errors: responseData.errors}
     }

     return {success:true}
         
}

export async function logIn(data:TLogInSchema){
    const response = await fetch('http://localhost:3000/login',{
        method:"POST",
        headers:{'content-Type': 'application/json'},
        body:JSON.stringify({
            email: data.email,
            password: data.password
        })
    })
    return response

    
 
}