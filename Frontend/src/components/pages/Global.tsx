import { useEffect,useState } from "react"
import { fetchMessages } from "../../services/messagesServices"
import Logo from '../../assets/logo.jpg'
import image from '../../assets/image.svg'
import send from '../../assets/send.svg'
import { Sidebar } from "../Sidebar"
export function Global(){

   const [message,setMessage]=useState("")

   const handleMessageInput =(event:React.ChangeEvent<HTMLTextAreaElement>)=>{
      setMessage(event.target.value)
   }

   const handleSubmit = (event:React.SyntheticEvent)=>{
      event.preventDefault()
      console.log("Whatever")
   }

   useEffect(()=>{
      Messages()
   },[])


   async function Messages(){
      const response = await fetchMessages()
      console.log("Test")
      console.log(response)
   }
    return(
         <div className="flex flex-col h-screen bg-dark">

             <div className="flex items-center gap-2 bg-dark-100 p-2 mt-10 rounded-t-md border-b border-gray-100/10">
               <img className="size-10  rounded-full" src={Logo}/>
               <p className=" text-lg capitalize text-white">Global Chat</p>
             </div>

            <div className=" bg-dark-100 p-4 border-b border-gray-100/10">
               <p className="text-dark-500 text text-xs text-center">01/06/2026</p>
               <div className=" flex flex-col gap-2 "> 

                <div className="flex gap-4" >
                  <img className="size-8 rounded-full self-end" src="https://res.cloudinary.com/dic5sskvu/image/upload/v1771032844/defaultAvatar_szkhjs.webp"/>
                  <div className="flex flex-col gap-2">
                     <p className="text-dark-500 text-xs ml-3">@pewpew</p>
                     <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl">Hello !</p>
                  </div>
                </div>

                                <div className="flex gap-4" >
                  <img className="size-8 rounded-full self-end" src="https://res.cloudinary.com/dic5sskvu/image/upload/v1771032844/defaultAvatar_szkhjs.webp"/>
                  <div className="flex flex-col gap-2">
                     <p className="text-dark-500 text-xs ml-3">@pewpew</p>
                     <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl">Hello !</p>
                  </div>
                </div>


               <div className="flex gap-4" >
                  <img className="size-8 rounded-full self-end" src="https://res.cloudinary.com/dic5sskvu/image/upload/v1771032844/defaultAvatar_szkhjs.webp"/>
                  <div className="flex flex-col gap-2">
                     <p className="text-dark-500 text-xs ml-3">@pewpew</p>
                     <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl">hello global chat!</p>
                  </div>
                </div>


               </div>

            </div>

            <form  className="flex items-center gap-2 p-2  bg-dark-100">
               <textarea rows={1} value={message} onChange={handleMessageInput}    className=" resize-none flex-1 py-1.5 px-4  border border-gray-100/10 text-white rounded-3xl"/>
               <div className="cursor-pointer  p-1.5   border border-gray-100/10 rounded-full">
                  <img src={image} className="size-5 "/>
               </div>
               <div onClick={handleSubmit} className="cursor-pointer  p-1.5    border border-gray-100/10 rounded-full">
                  <img src={send} className="size-5"/>
               </div>
            </form>

            <Sidebar/>
 
        </div>
        
      )

}