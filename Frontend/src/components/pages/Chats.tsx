import { Sidebar } from "../Sidebar"
import { fetchUsers,getFriends } from "../../services/userServices"
import { useEffect,useState } from "react"
import plus from '../../assets/plus.svg'
import {type User} from '../../lib/types'
import Skeleton from 'react-loading-skeleton'
import { Link } from "react-router-dom"
import 'react-loading-skeleton/dist/skeleton.css'
export function Chats(){

    const[UsersData,setUsersData]=useState<User[]>([])
    const [userFriends,setUserFriends]=useState<User[]>([])
    const[toggleSearch,setToggleSearch]=useState(false)
    const[searchText,setSearchText] = useState('')
    const[loadingSkeleton,setLoadingSkeleton]=useState(false)
 

    const handleSearchText=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchText(event.target.value)
    }

    const getUsers=async ()=>{
        setLoadingSkeleton(true)
        const response = await fetchUsers()
        if(response.status===200){
            const responseData = await response.json()
            setUsersData(responseData)
            setLoadingSkeleton(false)
        }
    }

    const getUserFriends = async () =>{
        setLoadingSkeleton(true)
        const response = await getFriends()
        if(response.status===200){
            const responseData = await response.json()
            setUserFriends(responseData)
            setLoadingSkeleton(false)
        }
         
    }
    

    useEffect(()=>{
        if(!toggleSearch){
            return
        }
        getUsers()   
    },[toggleSearch])

    useEffect(()=>{
         getUserFriends()
    },[])

    //do fitering next 

    return(
         <div className="flex  flex-col h-screen bg-dark">
            
            
             <div className="bg-dark-100 mt-12 rounded-t-md p-3 text-white">
                {toggleSearch?(
                   <div className="w-full flex flex-col gap-4"> 
                        <div className="flex items-center justify-between"> 
                            <h1 className="text-3xl font-semibold">Search Users</h1>
                            <button className={"transition hover:bg-dark-300 rounded-full  p-1 "} onClick={()=>setToggleSearch(false)}>
                                <img src={plus} className={`transition size-7 cursor-pointer ${toggleSearch ? "rotate-45":"rotate-0"}`}/>
                            </button>
                        </div>
                        <input type="text" className="bg-dark-200 px-3 py-1 rounded-3xl" value={searchText} onChange={handleSearchText}/>
                    </div>
          
                    

                ):(
                <div className="flex flex-col gap-4 w-full"> 
                    <div className="flex justify-between"> 
                        <h1 className="text-[1.6rem] font-semibold">Chats</h1>
                        <button className={"transition hover:bg-gray-400/20 rounded-full p-1"} onClick={()=>setToggleSearch(true)}> 
                            <img src={plus} className={`transition size-7 cursor-pointer ${toggleSearch ? "rotate-45":"rotate-0"}`}/>
                        </button>
                    </div>
                </div>
                )}
 
             </div>

            <div className=" flex-1 bg-dark-100 px-3 overflow-y-auto text-white">

            {loadingSkeleton?(
                <div className="flex flex-col">
                     <Skeleton height={65}/>
                     <Skeleton height={65}/>
                     <Skeleton height={65}/>
                     <Skeleton height={65}/>
                    <Skeleton height={65}/>
                </div>
            ):(
                <div>
                    {toggleSearch?(
                    <div className="flex flex-col">
                        {UsersData.map((User)=>(
                        <Link to={`/profile/${User.id}`} className="flex gap-2 p-2 rounded-md transition hover:bg-dark-200" key={User.id}>
                            <div className="flex items-center gap-3">
                                <img className="size-10 rounded-full" src={User.pictureURL} />
                                <div className="flex flex-col">
                                    <p>{User.firstName} {User.lastName}</p>
                                    <p className="text-dark-500 text-xs">@{User.username} </p>
                                </div>
                            </div>
                         </Link>
                        ))}
                    </div>
                      
                          
                    ):(
                        <p className="italic text-dark-500">You currently got no friends</p>
                    )}
                </div>
                
                
            )}

            </div> 
 

            <Sidebar/>
 
        </div>
    )
}