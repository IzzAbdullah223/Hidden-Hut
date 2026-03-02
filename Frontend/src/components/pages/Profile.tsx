import { Sidebar } from "../Sidebar"
import Skeleton from 'react-loading-skeleton'
import {type User} from '../../lib/types'
import luffy from '../../assets/Luffy.jpeg'
import camera from '../../assets/camera.svg'
import { useEffect,useState } from "react"
import { fetchUser } from "../../services/userServices"
import { useParams } from "react-router-dom"
import 'react-loading-skeleton/dist/skeleton.css'
export function Profile(){
 
    const {id} = useParams()
    const [data,setData] = useState<User>()
    const fetchProfile = async ()=>{
     const response = await    fetchUser(Number(id))
      if(response.status===200){
         const responseData = await response.json()
         setData(responseData)
      }
    }

    useEffect(()=>{
        fetchProfile()
    },[])

    return(
         <div className="flex  flex-col h-screen bg-dark">
            
            <div className="flex-1 p-3 mt-12 rounded-lg bg-dark-100"> 
            
             <div className="relative">
                    <img src={luffy} className=" w-full h-[16rem] object-cover object-center rounded-md"/>
                    <div className=" absolute right-2 bottom-2 w-fit p-2 rounded-full bg-dark-300 ">
                        <img src={camera} className="size-5"/>
                    </div>
             </div>
               
                    <div className="flex flex-col">
                        <div className="relative w-fit"> 
                            <img src={data?.pictureURL} className="rounded-full object-cover object-center !size-[10rem] "/>
                            <div className="absolute size-5 rounded-full bottom-3 right-3 bg-stale"></div>
                        </div>
                        <div> 
                            <p className="text-2xl font-semibold">Test Test 223</p>
                            <p className="text-dark-500">@{data?.username}</p>
                        </div>
                        <div className="flex gap-2"> 
                            <button className="text-black bg-white px-4 py-2 rounded-md text-sm font-medium shadow-2xl cursor-pointer ">Edit Profile</button>
                            <button className="text-black bg-white px-4 py-2 rounded-md text-sm font-medium shadow-2xl cursor-pointer  ">Change Password</button>
                        </div>
                    </div>
              

            </div> 
 

            <Sidebar/>
 
        </div>
    )
}