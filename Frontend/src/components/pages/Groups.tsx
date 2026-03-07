import { Sidebar } from "../Sidebar"
import { useEffect, useState } from "react"
import { getGroups } from "@/services/groupServices"
import { type Group } from "@/lib/types"
import { Link } from "react-router-dom"
import plus from '../../assets/plus.svg'
export function Groups(){

    const[data,setData]= useState<Group>() 
    const fetchUserGroups=async ()=>{
        const response = await getGroups()
        if(response.status===200){
            const responseData = await response.json()
            setData(responseData)
        }
    }
    
 

 
    useEffect(()=>{
      fetchUserGroups()
    },[])

    
    return(
         <div className="flex  flex-col h-screen bg-dark">
            
            
             <div className="flex flex-col gap-4 flex-1   bg-dark-100 mt-12 rounded-t-md p-3">
                <div className="flex justify-between"> 
                    <h1 className="text-[1.6rem] font-semibold text-white ">Groups</h1>
                    <Link to={'/group/create'}  className="transition hover:bg-dark-300 rounded-full p-1 w-fit cursor-pointer">
                        <img src={plus} className="size-7"/>
                    </Link>
                </div>
                {data?.count===0? <p className="text-lg italic text-dark-500">You currently have no groups</p>:
                
                <p>Lmao</p>}
             </div>

            <Sidebar/>
        </div>
    )
}