import { Sidebar } from "../Sidebar"
import { fetchUsers } from "../../services/userServices"
import { useEffect,useState } from "react"
import plus from '../../assets/plus.svg'
import {type User} from '../../lib/types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
export function Chats(){

    const[data,setData]=useState<User[]>([])
    const[toggleSearch,setToggleSearch]=useState(false)
    const[searchText,setSearchText] = useState('')
    const[loading,setLoading]=useState(false)

    const handleSearchText=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchText(event.target.value)
    }

    const getUsers=async ()=>{
        setLoading(true)
        const response = await fetchUsers()
        if(response.status===200){
            const responseData = await response.json()
            setData(responseData)
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(!toggleSearch){
            return
        }
        getUsers()   
    },[toggleSearch])

    return(
         <div className="flex  flex-col h-screen bg-dark">
            
            
             <div className=" flex items-center justify-between gap-2 bg-dark-100 mt-12 rounded-t-md p-3">
                {toggleSearch?(
                   <div className="w-full flex flex-col gap-4"> 
                        <div className="flex items-center justify-between"> 
                            <h1 className="text-white text-3xl font-semibold">Search Users</h1>
                            <button className={"transition hover:bg-dark-300 rounded-full  p-1 "} onClick={()=>setToggleSearch(false)}>
                                <img src={plus} className={`transition size-7 cursor-pointer ${toggleSearch ? "rotate-45":"rotate-0"}`}/>
                            </button>
                        </div>
                        <input type="text" className="bg-dark-200 px-3 py-1 rounded-3xl text-white" value={searchText} onChange={handleSearchText}/>
                         {loading?(
                        <div className="flex flex-col">
                                 <Skeleton height={65}/>
                                <Skeleton height={65}/>
                                <Skeleton height={65}/>
                                <Skeleton height={65}/>
                                <Skeleton height={65}/>
                        </div>

                         ):(
                        <div className="flex flex-col gap-5 p-2">
                            {data.filter((user)=>{
                                return searchText.toLocaleLowerCase()=== ''? user : user.firstName.toLocaleLowerCase().includes(searchText) ||
                                                                                    user.lastName.toLocaleLowerCase().includes(searchText)  ||
                                                                                    user.username.toLocaleLowerCase().includes(searchText)
                            }).map((user)=>
                                <div key={user.id} className="flex gap-2 items-center">
                                    <div className="relative w-fit">
                                        <img src={user.pictureURL} className="size-10 rounded-full object-cover object-center"/>
                                        <div className="absolute size-3 rounded-full bottom-0 right-0 bg-stale"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p>{user.firstName} {user.lastName}</p>
                                        <div className="text-xs text-dark-500">@{user.username}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                         )}
                    </div>
          
                    

                ):(
                <> 
                    <h1 className="text-white text-3xl font-semibold">Chats</h1>
                    <button className={"transition hover:bg-gray-400/20 rounded-full p-1"} onClick={()=>setToggleSearch(true)}> 
                      <img src={plus} className={`transition size-7 cursor-pointer`}/>
                    </button>
                </>
                )}
 
             </div>

            <div className=" flex-1 bg-dark-100 p-4 border-b border-gray-100/10 overflow-y-auto">
            

            </div> 
 

            <Sidebar/>
 
        </div>
    )
}