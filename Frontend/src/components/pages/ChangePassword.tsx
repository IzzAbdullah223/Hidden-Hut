import { Sidebar } from "../Sidebar"
import back from '../../assets/back.svg'
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { changePasswordSchema, type User, type TchangePasswordSchema } from '../../lib/types';
import {fetchUser,passwordChange} from "@/services/userServices"
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
export function ChangePassword(){
 
   const{id} = useParams()
   const navigate = useNavigate()
   const[data,setData]=useState<User>()
 

   const{
    register,
    handleSubmit,
    formState:{errors,isSubmitting},
    reset,
    setError,
   } = useForm<TchangePasswordSchema>({
        resolver:zodResolver(changePasswordSchema)
   })

    const getUser= async ()=>{
        const response = await fetchUser(Number(id))
        if(response.status===200){
            const responseData = await response.json()
            setData(responseData)
            
        }
    }

    const onSubmit = async(data:TchangePasswordSchema)=>{
      
         const response = await passwordChange (data)
            if(response.errors){
            const errors = response.errors;
            if(errors.password){
                setError("password",{
                    type:"server",
                    message:errors.password
                })
            }
            }

        if(response.success){
             navigate(`/profile/${id}`)
        }
    }

    useEffect(()=>{
       getUser() 
    },[])

    return(
         <div className="flex  flex-col h-screen bg-dark">
            
            <div className=" flex flex-col flex-1 mt-12 rounded-md bg-dark-100 p-3 gap-2 text-white"> 
                <div className="border-b border-dark-400 pb-2"> 
                    <div className=" flex items-center gap-3 transition hover:bg-dark-200 rounded-full p-1  w-fit">
                        <Link to={`/profile/${id}`}> <img src={back} className="size-7"/></Link>
                        <h1 className="text-[1.22rem] font-semibold">Change Password</h1>
                    </div>
                </div>
 
                <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col  gap-2 text-[1.1rem] text-dark-500 ">
                    <div className="flex flex-col  ">
                        <label>Enter old password:</label>
                        <input type="text"
                        {...register("password")}
                         className="rounded-sm p-1 px-2 bg-dark-200"/>
                         {errors.password &&(
                            <p className='text-red-500 text-[0.95rem]'>{`${errors.password.message}`}</p>
                         )}
                    </div>
                    <div className="flex flex-col">
                        <label>Enter new password:</label>
                        <input type="text"
                         {...register('newPassword')}
                         className="rounded-sm p-1 px-2 bg-dark-200"/>
                         {errors.newPassword &&(
                            <p className='text-red-500 text-[0.95rem]  '>{`${errors.newPassword.message}`}</p>
                         )}
                    </div>
                    <div className="flex flex-col">
                        <label>Confirm new password</label>
                        <input type="text"
                        {...register('confirmPassword')}
                         className="rounded-sm p-1 px-2 bg-dark-200 "/>
                         {errors.confirmPassword &&(
                            <p className='text-red-500 text-[0.95rem]'>{`${errors.confirmPassword.message}`}</p>
                         )}
                    </div>
                     <div className="flex justify-end mt-4">
                        <Button disabled={isSubmitting} variant="secondary"  className=" cursor-pointer text-[0.94rem] -mt-3 px-5 py-4.5 text-black   ">
                            Save
                        </Button>
                    </div>  
                </form>
            </div> 
 

            <Sidebar/>
        </div>
    )
}