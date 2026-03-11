import { Sidebar } from "../Sidebar"
import { useEffect, useState } from "react"
import { getGroups } from "@/services/groupServices"
import { type Group } from "@/lib/types"
import { Link } from "react-router-dom"
import plus from '../../assets/plus.svg'

export function Groups(){
    const [groupsData, setGroupsData] = useState<Group>()
    
    const fetchUserGroups = async () => {
        const response = await getGroups()
        if(response.status === 200){
            const responseData = await response.json()
            console.log(responseData)
            setGroupsData(responseData)
        }
    }
    
    useEffect(() => {
        fetchUserGroups()
    }, [])
    
    return(
        <div className="flex flex-col h-screen bg-dark">
            <div className="flex flex-col gap-4 flex-1 bg-dark-100 mt-12 rounded-t-md p-3">
                <div className="flex justify-between"> 
                    <h1 className="text-[1.6rem] font-semibold text-white">Groups</h1>
                    <Link to={'/group/create'} className="transition hover:bg-dark-300 rounded-full p-1 w-fit cursor-pointer">
                        <img src={plus} className="size-7"/>
                    </Link>
                </div>
                
                {groupsData?.count === 0 ? (
                    <p className="text-lg italic text-dark-500">You currently have no groups</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {groupsData?.groups.map(group => (
                            <Link 
                                key={group.id} 
                                to={`/group/chats/${group.id}`}
                                className="flex gap-3 items-center hover:bg-dark-200 p-2 rounded-md transition"
                            >
                                <img 
                                    src={group.pictureUrl} 
                                    className="size-12 rounded-full object-cover object-center"
                                />
                                <p className="text-white text-lg">{group.name}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Sidebar/>
        </div>
    )
}