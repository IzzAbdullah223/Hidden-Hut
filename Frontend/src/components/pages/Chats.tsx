import { Sidebar } from "../Sidebar"
import { getUsers } from "../../services/messagesServices"
import { useEffect } from "react"
import plus from '../../assets/plus.svg'
export function Chats(){

    const Users=async ()=>{
        const response = await getUsers()
        console.log(response)

    }


    useEffect(()=>{
        Users()   
    },[])

    return(
         <div className="flex flex-col h-screen bg-dark">
            
            
             <div className="flex items-center justify-between gap-2 bg-dark-100 mt-12 rounded-t-md p-3">
                   <h1 className="text-white text-3xl font-semibold">Chats</h1>
                   <button className="transition hover:bg-dark-300 rounded-full p-1"> 
                        <img src={plus} className="transition size-7 cursor-pointer"/>
                   </button>
             </div>

            <div className=" flex-1 bg-dark-100 p-4 border-b border-gray-100/10 overflow-y-auto">
            

            </div> 
 

            <Sidebar/>
 
        </div>
    )
}