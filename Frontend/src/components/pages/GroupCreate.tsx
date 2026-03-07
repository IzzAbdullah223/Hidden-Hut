import { Sidebar } from "../Sidebar"
import back from '../../assets/back.svg'
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import default_cover from '../../assets/default_group.jpg'
import { useRef, useState } from "react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import edit from '../../assets/edit.svg'
export function GroupCreate(){
 
   const{id} = useParams()
   const navigate = useNavigate()
   const [imagePreview,setImagePreview] = useState(default_cover)
    const formData = new FormData()
 
   const fileInputRef = useRef<HTMLInputElement>(null)

 

 

    const handleFileSelect = async(e:React.ChangeEvent<HTMLInputElement>)=>{
      const file = e.target.files?.[0]
      if(!file) return
      if (fileInputRef.current) {
         fileInputRef.current.value = ""
      }
      const imageUrl =  URL.createObjectURL(file);
      setImagePreview(imageUrl)
      formData.append('image',file)
      

   }

    const handleImageUpload=()=>{
        fileInputRef.current?.click()
    }

    const onSubmit = async( )=>{
        console.log(formData)
    }

 

    return(
         <div className="flex  flex-col h-screen bg-dark">
            
            <div className=" flex flex-col flex-1 mt-12 rounded-md bg-dark-100 p-3 gap-3 text-white"> 
                <div className="flex   gap-1  border-b border-dark-400 pb-2"> 
                        <div className="transition hover:bg-dark-200 rounded-full p-1  w-fit">
                            <Link to={`/groups`}> <img src={back} className="size-7"/></Link>
                        </div>
                        <h1 className="text-2xl font-semibold">Create Group</h1>
                </div>
                <div className="flex flex-col gap-5 border-b border-dark-400 pb-4   "> {/* ياخ بس لزهم سوا و انتهى الموضوع*/}
                    <div className="flex items-center justify-between"> 
                        <h1 className="text-[1.15rem]">Group Profile</h1>
            <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}/>
                       <Button onClick={handleImageUpload}  variant="secondary"   className="font-semibold text-dark-100 gap-0 px-3.5 py-4.5 text-[0.94rem] cursor-pointer hover:bg-secondary">
                        Change
                        <img src={edit} className="size-4 ml-2 mb-[1px]"/>
                       </Button>
                    </div>
                    <div className="flex justify-center"> 
                        <img src={imagePreview} className="size-[12rem] rounded-full object-cover object-center"/>
                    </div>
                </div>
                <form onSubmit={onSubmit} className="text-[1.1rem] p-3">
                    <div className="flex flex-col">
                        <label>Group name:</label>
                        <input type="text"
  
                         className="rounded-sm py-1.5 px-2 mb-2 bg-dark-200"/>
 
                    </div>
                    <div className="flex flex-col">
                        <label>Select Members:</label>
                        <input type="text"
 
                         className="rounded-sm py-1.5 px-2 bg-dark-200 text-lg placeholder-gray-400" placeholder="Search friends"/>
 
                    </div>
 
                     <div className="flex justify-end mt-6">
                        <Button variant="secondary"  className=" cursor-pointer text-[0.94rem] px-4 py-5.5 text-black   ">
                            Create group
                        </Button>
                    </div>  
                </form>
                 
           
              

            </div> 
 

            <Sidebar/>
        </div>
    )
}