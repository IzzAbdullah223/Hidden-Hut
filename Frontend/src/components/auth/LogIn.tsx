import { type TLogInSchema, logInSchema, type TLogInResponse } from '../../lib/types';
import logo from '../../assets/logo.jpg'
import { Link,useNavigate } from "react-router"
import {useForm} from 'react-hook-form'
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { logIn } from '../../services/authServices';


export function LogIn(){

       const navigate = useNavigate()
      const[error,setError ]= useState(false)
    const{
        register,
        handleSubmit,
        formState: {errors,isSubmitting},
        reset,
    } = useForm<TLogInSchema>({
        resolver:zodResolver(logInSchema)
    })

    const onSubmit =async (data:TLogInSchema)=>{
        setError(false)
         const response = await logIn(data)
      
         if(response.status===401){
            setError(true)
            reset()
         }

        if(response.status===200){
            //const data: TLogInResponse = await response.json()
            //const token = data.token
          //  localStorage.setItem('token',token)
            navigate('/global')
        }
    }

    return(
                <main className='min-h-screen flex  justify-center items-center bg-[#1c1e21]'>
            <div className='h-screen p-5'>  
                <div className='bg-[#242526] flex flex-col gap-4 p-6 rounded-lg ring-1 ring-gray-50/15'>
                    <div className='flex items-center gap-4 mb-0 mt-3'> 
                        <img src={logo} className='w-16 h-16 rounded-2xl'/>
                        <h1 className='text-2xl sm:text-3xl font-extrabold text-white  '>Hidden Hut App</h1>
                    </div>
                    <h2 className='text-4xl sm:text-5xl font-bold text-white'>Welcome back</h2>
                    <p className='text-[16px] sm:text-lg text-neutral-400 font'>
                        Don't have an account?
                        <Link to={'/signup'} className='text-white font-bold'> Create one</Link>
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}  className='flex flex-col gap-4 w-full min-[500px]:w-110'>

                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400'>Email</label>
                        <input
                         {...register('email')}
                         className='bg-white pl-2 py-1.75 rounded focus:outline-none text-neutral-800' 
                         type='text' 
                         placeholder='Enter your email'/>
                         {errors.email &&(
                            <p className='text-red-500 -mt-1 '>{`${errors.email.message}`}</p>
                         )}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400'>Password</label>
                        <input
                         {...register("password")}
                         className='bg-white pl-2 py-1.75 rounded focus:outline-none text-neutral-800' 
                         type='password' />
                         {errors.password &&(
                            <p className='text-red-500 -mt-1'>{`${errors.password.message}`}</p>
                         )}
                      </div>
                        <p className='text-red-500 -mt-1 -mb-2'>{`${error? "Invalid email or password": ""}`}</p>
                          <button
                          disabled={isSubmitting}
                           className='bg-black text-white font-bold p-3 rounded-md cursor-pointer'>
                            {isSubmitting? "Logging in.....":"Log in"}
                          </button>
                    </form>

                </div>
            </div>

        </main>
    )
}