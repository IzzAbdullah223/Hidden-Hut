import { Sidebar } from "../Sidebar"
import back from '../../assets/back.svg'
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { type User, type TeditProfileSchema, editProfileSchema } from '../../lib/types';
import { useRef } from "react"
import { changeProfilePicture, fetchUser,editProfile } from "@/services/userServices"
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import edit from '../../assets/edit.svg'
export function ProfileEdit(){
 
   const{id} = useParams()
   const navigate = useNavigate()
   const[data,setData]=useState<User>()
   const fileInputRef = useRef<HTMLInputElement>(null)

   const{
    register,
    handleSubmit,
    formState:{errors,isSubmitting},
    reset,
    setError,
   } = useForm<TeditProfileSchema>({
        resolver:zodResolver(editProfileSchema)
   })

    const getUser= async ()=>{
        const response = await fetchUser(Number(id))
        if(response.status===200){
            const responseData = await response.json()
            setData(responseData)
    reset({
      fName: responseData.firstName,
      lName: responseData.lastName,
      username: responseData.username,
      bio: responseData.bio
    })
        }
    }

    const handleFileSelect = async(e:React.ChangeEvent<HTMLInputElement>)=>{
      const file = e.target.files?.[0]
      if(!file) return
      if (fileInputRef.current) {
         fileInputRef.current.value = ""
      }
       
      const formData = new FormData()
      formData.append('image',file)
      formData.append('userId',String(id))
      const response = await changeProfilePicture(formData)
        if(response.status===200){
            getUser()
        }

   }

    const handleImageUpload=()=>{
        fileInputRef.current?.click()
    }

    const onSubmit = async(data:TeditProfileSchema)=>{
      
        const response = await editProfile(data, id)
        if(response.errors){
            const errors = response.errors;
            if(errors.username){
                setError("username",{
                    type:"server",
                    message:errors.username
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
            
            <div className=" flex flex-col flex-1 mt-12 rounded-md bg-dark-100 p-3 gap-3 text-white"> 
                <div className="border-b border-dark-400 pb-2"> 
                    <div className="transition hover:bg-dark-200 rounded-full p-1  w-fit">
                        <Link to={`/profile/${id}`}> <img src={back} className="size-7"/></Link>
                    </div>
                </div>
                <div className="flex flex-col gap-5 border-b border-dark-400 pb-4">
                    <div className="flex items-center justify-between"> 
                        <h1 className="text-lg font-semibold text-[1.4rem]">Profile picture</h1>
            <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}/>
                       <Button onClick={handleImageUpload}  variant="secondary"   className="font-semibold text-dark-100 gap-0 px-3 py-4.5 text-[0.94rem] cursor-pointer hover:bg-secondary">
                        Edit
                        <img src={edit} className="size-4 ml-2 mb-[1px]"/>
                       </Button>
                    </div>
                    <div className="flex justify-center"> 
                        <img src={data?.pictureURL} className="size-[12rem] rounded-full object-cover object-center"/>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="text-[1.2rem] text-dark-500">
                    <div className="flex flex-col">
                        <label>First name:</label>
                        <input type="text"
                        {...register("fName")}
                         className="rounded-sm p-1 px-2 bg-dark-200"/>
                         {errors.fName &&(
                            <p className='text-red-500 text-[1rem]'>{`${errors.fName.message}`}</p>
                         )}
                    </div>
                    <div className="flex flex-col">
                        <label>Last name:</label>
                        <input type="text"
                         {...register('lName')}
                         className="rounded-sm p-1 px-2 bg-dark-200"/>
                         {errors.lName &&(
                            <p className='text-red-500 text-[1rem]'>{`${errors.lName.message}`}</p>
                         )}
                    </div>
                    <div className="flex flex-col">
                        <label>Username:</label>
                        <input type="text"
                        {...register('username')}
                         className="rounded-sm p-1 px-2 bg-dark-200 "/>
                         {errors.username &&(
                            <p className='text-red-500 text-[1rem]'>{`${errors.username.message}`}</p>
                         )}
                    </div>
                    <div className="flex flex-col">
                        <label>Bio:</label>
                        <textarea
                        {...register("bio")}
                        className="bg-dark-200 rounded-md px-2 py-1 text-lg 
                        " rows={6}/>
                    </div>
                     <div className="flex justify-end mt-4">
                        <Button disabled={isSubmitting} variant="secondary"  className=" cursor-pointer text-[0.94rem] px-4 py-5.5 text-black   ">
                            Save changes
                        </Button>
                    </div>  
                </form>
                 
           
              

            </div> 
 

            <Sidebar/>
        </div>
    )
}