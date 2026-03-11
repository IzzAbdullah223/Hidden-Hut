import { useEffect, useState, useRef } from "react"
import { fetchGlobalMessages, sendGlobalMessage, deleteMessage } from "../../services/messagesServices"
import { fetchUsers } from "../../services/userServices"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Logo from '../../assets/logo.jpg'
import image from '../../assets/image.svg'
import send from '../../assets/send.svg'
import threeDots from '../../assets/three dots.svg'
import close from '../../assets/close.svg'
import { Sidebar } from "../Sidebar"
import { type Messages, type User } from '../../lib/types'
import { Link } from "react-router-dom"

export function Global() {

  const token = localStorage.getItem('token')
  const currentUserId = Number(localStorage.getItem('currentUserId'))
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setimagePreview] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<Messages[]>([])
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [Loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [users, setUsers] = useState<User[]>([])
  const [searchText, setSearchText] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)

  const handleMessageInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  const toggleDeleteMenu = (messageId: number) => {
    setShowDeleteId(showDeleteId === messageId ? null : messageId)
  }

  const handleDelete = async (messageId: number) => {
    const response = await deleteMessage(messageId)
    console.log(response)
    setRefreshTrigger(prev => prev + 1)
  }

  const HandleImageUpload = async () => {
    fileInputRef.current?.click()
  }

  const handleCancelImage = () => {
    setimagePreview(undefined)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    const imageUrl = URL.createObjectURL(file);
    setimagePreview(imageUrl)
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (!message.trim() && !selectedFile) {
      return
    }

    const formData = new FormData()
    formData.append('message', message)
    if (selectedFile) {
      formData.append('image', selectedFile)
    }

    setIsSubmitting(true)

    await sendGlobalMessage(formData)
    setIsSubmitting(false)
    setMessage('')
    setimagePreview(undefined)
    setSelectedFile(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const getUsers = async () => {
    setLoadingUsers(true)
    const response = await fetchUsers()
    if (response.status === 200) {
      const responseData = await response.json()
      setUsers(responseData)
    }
    setLoadingUsers(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (!target.closest('.three-dots-menu')) {
        setShowDeleteId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


  useEffect(() => {
    Messages()
    getUsers()
  }, [refreshTrigger])



  async function Messages() {
    setLoading(true)
    const response = await fetchGlobalMessages()
    if (response.status === 200) {
      const messagesData: Messages[] = await response.json()
      setData(messagesData)
      const date = new Date()
      console.log(date.getDay())
      console.log(messagesData[0].date)
    }

    setLoading(false)

  }

  const filteredUsers = users.filter(user =>
    searchText.toLowerCase() === '' ? user :
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="flex flex-col sm:flex-row sm:gap-1 sm:p-1  sm:pb-2 md:p-3 md:gap-3 h-screen bg-dark">

      <Sidebar />

      {/* srch panel hidden on mobile but viisble on desktop */}
      <div className="hidden sm:flex sm:flex-col sm:w-80 bg-dark-100 border-r rounded-md border-gray-100/10 text-white">
        <div className="p-4">
          <h1 className=" text-2xl font-semibold mb-3">Global Chat</h1>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-dark-200 px-3 py-1 rounded-3xl "
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loadingUsers ? (
            <div className="flex flex-col gap-2">
              <Skeleton height={60} />
              <Skeleton height={60} />
              <Skeleton height={60} />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredUsers.map(user => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="flex gap-3 items-center hover:bg-dark-200 p-2 rounded-md"
                >
                  <img
                    src={user.pictureURL}
                    className="size-10 rounded-full object-cover object-center"
                  />
                  <div className="flex flex-col">
                    <p className="text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-dark-500">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/*  chat content  */}
      <div className="flex flex-col flex-1 overflow-hidden rounded-sm">

        {/* header  */}
        <div className="flex items-center gap-2 bg-dark-100 p-3 mt-10 sm:mt-0 border-b border-gray-100/10">
          {Loading ? (
            <>
              <Skeleton circle width={40} height={40} />
              <Skeleton width={180} height={25} />
            </>
          ) : (
            <>
              <img className="size-10 rounded-full" src={Logo} />
              <p className="text-lg capitalize text-white">Global Chat</p>
            </>
          )}
        </div>

        {/* messages */}
        <div className="flex-1 bg-dark-100 p-4 border-b border-gray-100/10 overflow-y-auto">
          {Loading ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                <Skeleton width={250} height={40} borderRadius={16} />
              </div>
              <div className="flex gap-2">
                <Skeleton circle width={40} height={40} />
                <Skeleton width={250} height={40} borderRadius={16} />
              </div>
              <div className="flex justify-end">
                <Skeleton width={250} height={40} borderRadius={16} />
              </div>
              <div className="flex gap-2">
                <Skeleton circle width={40} height={40} />
                <Skeleton width={250} height={80} borderRadius={16} />
              </div>
              <div className="flex justify-end">
                <Skeleton width={250} height={40} borderRadius={16} />
              </div>
              <div className="flex justify-end">
                <Skeleton width={250} height={40} borderRadius={16} />
              </div>
              <div className="flex gap-2">
                <Skeleton circle width={40} height={40} />
                <Skeleton width={250} height={40} borderRadius={16} />
              </div>
            </div>
          ) : (
            <>
              <p className="text-dark-500 text text-xs text-center">01/06/2026</p>

              <div className="flex flex-col gap-2">

                {data.map((message) => (
                  message.senderId === currentUserId ? (


                    <div className="flex justify-end items-center gap-2 text-white" key={message.id}>
                      <div className="cursor-pointer relative three-dots-menu" onClick={() => toggleDeleteMenu(message.id)}>
                        <img className="size-5" src={threeDots} />
                        <p
                          onClick={() => handleDelete(message.id)}
                          className={`absolute top-full mt-3 -right-10 z-10 py-2 px-4 rounded-md cursor-pointer bg-dark-200  shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-200 ${showDeleteId === message.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                            }`}>Delete</p>
                      </div>
                      <div className="flex flex-col gap-2 ">
                        {message.content && (
                          <p className="bg-dark-200 py-2 px-4 rounded-2xl flex-shrink w-fit max-w-[22rem] text-wrap">{message.content}</p>
                        )}
                        {message.imageUrl && (
                          <img src={message.imageUrl} className="max-w-[18rem] w-[90%] rounded-2xl" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4" key={message.id}>
                      <img className="size-8 sm:size-10 rounded-full self-end" src={message.sender.pictureURL} />
                      <div className="flex flex-col gap-2">
                        <p className="text-dark-500 text-xs ml-3">@{message.sender.firstName}</p>
                        <div className="flex flex-col gap-2 ">
                          {message.content && (
                            <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl w-fit">{message.content}</p>
                          )}
                          {message.imageUrl && (
                            <img src={message.imageUrl} className="max-w-[18rem] w-[90%] rounded-2xl" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                ))}

              </div>
            </>
          )}

        </div>

        {/* send message input  */}
        <div className="bg-dark-100">
          <div className={`relative p-3 w-fit h-fit ${imagePreview ? "" : "hidden"}`}>
            <img className="w-60 rounded-md" src={imagePreview} />
            <button onClick={handleCancelImage} className="absolute size-6 top-0 right-0 bg-dark-300 rounded-full p-1 cursor-pointer" >
              <img src={close} />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect} />
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-dark-100">
            <textarea rows={1} value={message} onChange={handleMessageInput} className="resize-none w-full flex-1 shrink py-1.5 px-4 border border-gray-100/10 text-white rounded-3xl" />
            <div onClick={HandleImageUpload} className="cursor-pointer p-1.5 border border-gray-100/10 rounded-full" >
              <img src={image} className="size-5 sm:size-8 " />
            </div>
            <button disabled={isSubmitting || !(message.trim() || imagePreview)} type="submit" className="cursor-pointer p-1.5 border border-gray-100/10 rounded-full disabled:opacity-70">
              <img src={send} className="size-5 sm:size-8" />
            </button>
          </form>
        </div>

      </div>

    </div>

  )

}