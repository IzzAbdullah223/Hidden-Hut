import { useEffect } from "react"
import { fetchMessages } from "../../services/messagesServices"
import Logo from '../assets/logo.jpg'
export function Global(){

   useEffect(()=>{
      Messages()
   },[])


   async function Messages(){
      const response = await fetchMessages()
      console.log("Test")
      console.log(response)
   }
    return(<div className="bg-dark-100">
             <div className="flex items-center gap-2 bg-dark-100 p-2">
            <img className="size-10  rounded-full" src={Logo}/>
            <p className=" text-lg capitalize text-white">Global Chat</p>
        </div>
             <p className="text-dark-500 text text-xs text-center">01/06/2026</p>
             <div>
                 
                <div className="flex outline-amber-400 outline-1 gap-4" >
                  <img className="size-8 rounded-full self-end" src="https://res.cloudinary.com/dic5sskvu/image/upload/v1771032844/defaultAvatar_szkhjs.webp"/>
                  <div className="flex flex-col gap-2">
                     <p className="text-dark-500 text-xs ml-3">@pewpew</p>
                     <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl">Hello !</p>
                  </div>
                </div>
             </div>
        </div>)

}