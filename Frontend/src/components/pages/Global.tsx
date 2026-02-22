import { useEffect,useState,useRef} from "react"
import { fetchMessages,sendMessage,deleteMessage} from "../../services/messagesServices"
import Logo from '../../assets/logo.jpg'
import image from '../../assets/image.svg'
import send from '../../assets/send.svg'
import threeDots from '../../assets/three dots.svg'
import luffy from '../../assets/Luffy.jpeg'
import close from '../../assets/close.svg'
import { Sidebar } from "../Sidebar"
import {type Messages} from '../../lib/types'
export function Global(){

   const token = localStorage.getItem('token')
   const currentUserId = Number(localStorage.getItem('currentUserId'))
   const [message,setMessage]=useState("")
   const [selectedFile, setSelectedFile] = useState<File | null>(null)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [data,setData]= useState<Messages[]>([])
   const [showDeleteId,setShowDeleteId]= useState<number | null>(null)
   const [refreshTrigger,setRefreshTrigger] = useState(0)
   const fileInputRef = useRef<HTMLInputElement>(null)

   const handleMessageInput =(event:React.ChangeEvent<HTMLTextAreaElement>)=>{
      setMessage(event.target.value)
      }

      const toggleDeleteMenu = (messageId: number) => {
         setShowDeleteId(showDeleteId === messageId ? null : messageId)
         }

   const handleDelete= async (messageId:number)=>{
       await deleteMessage(messageId)
       setRefreshTrigger(prev=>prev+1)
   }

   const HandleImageUpload = async()=>{
      fileInputRef.current?.click()
   }

   const handleFileSelect = async(e:React.ChangeEvent<HTMLInputElement>)=>{
      const file = e.target.files?.[0]
      if(!file) return
      setSelectedFile(file)
       
   }

   const handleSubmit = async (event:React.SyntheticEvent)=>{
      console.log(token)
      console.log(currentUserId)
      event.preventDefault()
      if(!message.trim()){
         return
      }

      const formData = new FormData()
      formData.append('message',message)
      if(selectedFile){
         formData.append('image',selectedFile)
      }
          
      setIsSubmitting(true)
      
      await sendMessage(formData) //there should be response here but oh well 
      
      setIsSubmitting(false)
      setMessage('')
      setSelectedFile(null)
      setRefreshTrigger(prev=>prev+1)
   }

   useEffect(()=>{
      const handleClickOutside = (event:MouseEvent)=>{
         const target = event.target as HTMLElement
         
         if(!target.closest('.three-dots-menu')){
            setShowDeleteId(null)
         }
      }

      document.addEventListener('mousedown',handleClickOutside)

      return () =>{
         document.removeEventListener('mousedown',handleClickOutside)
      }
   },[])
 

   useEffect(()=>{
      Messages()
   },[refreshTrigger])

 


   async function Messages(){
      const response = await fetchMessages()
      if(response.status===200){
      const messagesData:Messages[] = await response.json()
      setData(messagesData)
      }
 
   }
    return(
         <div className="flex flex-col h-screen bg-dark">

             <div className="flex items-center gap-2 bg-dark-100 p-2 mt-10 rounded-t-md border-b border-gray-100/10">
               <img className="size-10  rounded-full" src={Logo}/>
               <p className=" text-lg capitalize text-white">Global Chat</p>
             </div>

            <div className=" flex-1 bg-dark-100 p-4 border-b border-gray-100/10 overflow-y-auto">
               <p className="text-dark-500 text text-xs text-center">01/06/2026</p>

               <div className=" flex flex-col gap-2 "> 

                <div className="flex gap-4" >
                  <img className="size-8 rounded-full self-end" src="https://res.cloudinary.com/dic5sskvu/image/upload/v1771032844/defaultAvatar_szkhjs.webp"/>
                  <div className="flex flex-col gap-2">
                     <p className="text-dark-500 text-xs ml-3">@pewpew</p>
                     <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl">Hello !</p>
                  </div>
                </div>

               {data.map((message) => (
               message.senderId === currentUserId ? (
   
     
               <div className="flex justify-end items-center gap-2" key={message.id}>
                  <div className="cursor-pointer relative three-dots-menu" onClick={()=>toggleDeleteMenu(message.id)}  > 
                  <img className="size-5" src={threeDots}/>
               <p 
                  onClick={() => handleDelete(message.id)} 
                  className={`absolute top-full mt-3 -right-10 z-10 py-2 px-4 rounded-md cursor-pointer bg-dark-200 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-200 ${
                  showDeleteId === message.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
               }`}>Delete</p>  
         </div>
          
        <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl">{message.content}</p>
      </div>
  ) : (
    //  messages tyle for other people 
    <div className="flex gap-4" key={message.id}>
      <img className="size-8 rounded-full self-end" src={message.sender.pictureURL}/>
      <div className="flex flex-col gap-2">
        <p className="text-dark-500 text-xs ml-3">@{message.sender.firstName}</p>
        <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl">{message.content}</p>
      </div>
    </div>
  )
))}

               </div>

            </div>

         <div className="bg-dark-100">
             <div className="relative p-3 w-fit h-fit">
               <img className="w-60 rounded-md" src={luffy}/>
                  <button className="absolute size-6 top-0 right-0 bg-dark-300 rounded-full p-1 cursor-pointer">
               <img src={close}/>
               </button>
            </div> 
            <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}/>
            <form onSubmit={handleSubmit}  className="flex items-center gap-2 p-2  bg-dark-100">
               <textarea rows={1} value={message} onChange={handleMessageInput}    className=" resize-none flex-1 py-1.5 px-4  border border-gray-100/10 text-white rounded-3xl"/>
               <div onClick={HandleImageUpload} className="cursor-pointer  p-1.5   border border-gray-100/10 rounded-full" >
                  <img src={image} className="size-5 "/>
               </div>
               <button disabled={isSubmitting || !message.trim()} type="submit" className="cursor-pointer p-1.5 border border-gray-100/10 rounded-full disabled:opacity-70">
                  <img src={send} className="size-5"/>
               </button>
            </form>
         </div>

            <Sidebar/>
 
        </div>
        
      )

}