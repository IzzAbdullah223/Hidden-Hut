import { type TSignUpSchema, type TLogInSchema } from '../lib/types';

 

export async function signUp(data:TSignUpSchema){
     const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`,{
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`,{
        method:"POST",
        headers:{'content-Type': 'application/json'},
        body:JSON.stringify({
            username: data.username,
            password: data.password
        })
    })
    return response;
   
 

    
 
}