
import logo from '../../assets/logo.jpg'
import { Link } from "react-router"
import { type TSignUpSchema, signUpSchema } from '../../lib/types'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
 
 
export function SignUp(){
    
 
     const{
        register,
        handleSubmit,
        formState: {errors,isSubmitting},
        reset,
     } = useForm<TSignUpSchema>({
        resolver:zodResolver(signUpSchema)
     })

     const onSubmit = async(data:TSignUpSchema)=>{
        
        reset()
     }
 
    
    return(
        <main className='min-h-screen flex  justify-center items-center bg-[#1c1e21]'>
            <div className='h-[100vh] p-5'>  
                <div className='bg-[#242526] flex flex-col gap-4 p-6 rounded-lg ring-1 ring-gray-50/15'>
                    <div className='flex items-center gap-4 mb-0 mt-3'> 
                        <img src={logo} className='w-16 h-16 rounded-2xl'/>
                        <h1 className='text-2xl sm:text-3xl font-extrabold text-white  '>Hidden Hut App</h1>
                    </div>
                    <h2 className='text-4xl sm:text-5xl font-bold text-white'>Sign up</h2>
                    <p className='text-[16px] sm:text-lg text-neutral-400 font'>
                        Already have an account?
                        <Link to={'/login'} className='text-white font-bold'> Login</Link>
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}  className='flex flex-col gap-4 w-full min-[500px]:w-110'>

                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400'>First name </label>
                        <input
                         {...register('fName')}
                         className='bg-white pl-2 py-1.75 rounded focus:outline-none text-neutral-800' 
                         type='text' 
                         placeholder='Enter your first name'/>
                         {errors.fName &&(
                            <p className='text-red-500 -mt-1'>{`${errors.fName.message}`}</p>
                         )}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400'>Last name</label>
                        <input
                         {...register("lName")}
                         className='bg-white pl-2 py-1.75 rounded focus:outline-none text-neutral-800' 
                         type='text' 
                         placeholder='Enter your last name '/>
                         {errors.lName &&(
                            <p className='text-red-500 -mt-1'>{`${errors.lName.message}`}</p>
                         )}
                      </div>
                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400'>Email</label>
                        <input
                         {...register('email')}
                         className='bg-white pl-2 py-1.75 rounded focus:outline-none text-neutral-800' 
                         type='text' 
                         placeholder='Enter your email'/>
                         {errors.email &&(
                            <p className='text-red-500 -mt-1'>{`${errors.email.message}`}</p>
                         )}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='text-netural-400 text-neutral-400'>Password</label>
                        <input
                         {...register('password')}
                         className='bg-white pl-2 py-1.75 rounded-sm focus:outline-none text-neutral-800
                        ' type='password'/>
                         {errors.password &&(
                            <p className='text-red-500 -mt-1'>{`${errors.password.message}`}</p>
                         )}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='text-netural-400 text-neutral-400'>Confirm password</label>
                        <input
                         {...register('confirmPassword')}
                         className='bg-white pl-2 py-1.75 rounded-sm focus:outline-none text-neutral-800
                        ' type='password'/>
                         {errors.confirmPassword &&(
                            <p className='text-red-500 -mt-1'>{`${errors.confirmPassword.message}`}</p>
                         )}
                      </div>
                          <button
                          disabled={isSubmitting}
                           className='bg-black text-white font-bold p-3 rounded-md cursor-pointer'>
                            Sign up
                          </button>
                    </form>

                </div>
            </div>

        </main>
    )
}