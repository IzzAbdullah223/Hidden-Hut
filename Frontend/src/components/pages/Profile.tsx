import { Sidebar } from "../Sidebar"
import Skeleton from 'react-loading-skeleton'
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {type User} from '../../lib/types'
import camera from '../../assets/camera.svg'
import { useEffect,useState,useRef } from "react"
import {changeProfileBanner, fetchUser } from "../../services/userServices"
import { useParams } from "react-router-dom"
import 'react-loading-skeleton/dist/skeleton.css'

export function Profile(){
    const {id} = useParams()
    const currentUserId = localStorage.getItem('currentUserId')
    
    const [data,setData] = useState<User>()
    const [loading,setLoading] = useState(false)
    const [refreshTrigger,setRefreshTrigger] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchProfile = async ()=>{
        setLoading(true)
        const response = await fetchUser(Number(id))
        if(response.status===200){
            const responseData = await response.json()
            console.log(responseData)
            setData(responseData)
            setLoading(false)
        }
    }

    const handleImageUpload=()=>{
        fileInputRef.current?.click()
    }

    const handleFileSelect = async(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0]
        if(!file) return
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        
        const formData = new FormData()
        formData.append('image',file)
        const response = await changeProfileBanner(formData)
        console.log(response)
        if(response.status===200){
            setRefreshTrigger(prev=>prev+1)
        }
    }


 
    useEffect(()=>{
        fetchProfile()
    },[refreshTrigger])
    
    return(
        <div className="flex flex-col h-screen bg-dark">
            <div className="flex-1 p-3 mt-12 rounded-lg bg-dark-100"> 
                {loading ? (
                    <>
                        <Skeleton height={256} className="rounded-md"/>
                        <div className="flex flex-col gap-4 -mt-25 pl-3">
                            <Skeleton circle width={160} height={160} className="z-10"/>
                            <div>
                                <Skeleton width={200} height={28}/>
                                <Skeleton width={120} height={20}/>
                            </div>
                            <div className="flex gap-3 mt-5">
                                <Skeleton width={130} height={40}/>
                                <Skeleton width={180} height={40}/>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <img src={data?.profileBanner} className="w-full h-[16rem] object-cover object-center rounded-md"/>
                            {currentUserId === id && (
                                <div className="absolute right-2 bottom-2 w-fit p-2 rounded-full bg-dark-300">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileSelect}/>
                                    <img src={camera} className="size-5 cursor-pointer" onClick={handleImageUpload}/>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-4 -mt-25 pl-3">
                            <div className="relative w-fit z-10"> 
                                <img src={data?.pictureURL} className="rounded-full object-cover object-center !size-[10rem]"/>
                                <div className="absolute size-5 rounded-full bottom-3 right-3 bg-stale"></div>
                            </div>
                            <div> 
                                <p className="text-2xl font-semibold text-white">{data?.firstName} {data?.lastName}</p>
                                <p className="text-dark-500">@{data?.username}</p>
                            </div>
                            
                            {currentUserId === id ? (
                                <div className="flex gap-3 mt-5"> 
                                    <Link to={`/profile/edit/${data?.id}`}><Button variant="secondary" className="text-base cursor-pointer">Edit Profile</Button></Link>
                                    <Link to={`/profile/change/password/${data?.id}`}><Button variant="secondary" className="text-base cursor-pointer">Change Password</Button></Link>
                                </div>
                            ) : (
                                <Link to={`/chats/${data?.id}`} className="flex gap-3 mt-5  w-fit">
                                    <Button variant="secondary" className="text-base cursor-pointer" >Send Message</Button>
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Sidebar/>
        </div>
    )
}