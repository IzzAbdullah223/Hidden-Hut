import { useEffect, useState, useRef } from "react"
import { fetchGroupMessages, sendGroupMessage, deleteMessage } from "../../services/messagesServices"
import { getGroup } from "@/services/groupServices"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import back from '../../assets/back.svg'
import image from '../../assets/image.svg'
import send from '../../assets/send.svg'
import threeDots from '../../assets/three dots.svg'
import close from '../../assets/close.svg'
import { Link, useParams } from "react-router-dom"
import { Sidebar } from "../Sidebar"
import { type Messages, type Groups } from '../../lib/types'
import { formatDate, isSameDay } from '@/lib/utils'
import { io as socketIO } from 'socket.io-client'
const socket = socketIO(import.meta.env.VITE_API_URL)

export function GroupChat() {
  const currentUserId = Number(localStorage.getItem('currentUserId'))
  const { id } = useParams()
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<Messages[]>([])
  const [group, setGroup] = useState<Groups>()
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null)
  const [Loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchGroupData = async () => {
    const response = await getGroup(id)
    if (response.status === 200) {
      const responseData = await response.json()
      setGroup(responseData)
    }
  }

  const handleMessageInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  const toggleDeleteMenu = (messageId: number) => {
    setShowDeleteId(showDeleteId === messageId ? null : messageId)
  }

  const handleDelete = async (messageId: number) => {
    const response = await deleteMessage(messageId)
  if (response.status === 200) {
    setData(prev => prev.filter(msg => msg.id !== messageId))
    setShowDeleteId(null)
  }
  }

  const HandleImageUpload = async () => {
    fileInputRef.current?.click()
  }

  const handleCancelImage = () => {
    setImagePreview(undefined)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    const imageUrl = URL.createObjectURL(file)
    setImagePreview(imageUrl)
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
    await sendGroupMessage(formData, id)
    setIsSubmitting(false)
    setMessage('')
    setImagePreview(undefined)
    setSelectedFile(null)
  }

  useEffect(() => {
    fetchGroupData()
  }, [])

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
  const roomId = `group_${id}`

  socket.emit('join_room', roomId)
   
  socket.on('new_group_message', (newMessage: Messages) => {
    setData(prev => [...prev, newMessage])
  })

  return () => {
    socket.emit('leave_room', roomId)
    socket.off('new_group_message')
  }
}, [id])

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    const response = await fetchGroupMessages(Number(id))
    if (response.status === 200) {
      const messagesData: Messages[] = await response.json()
      setData(messagesData)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen bg-dark text-white">

      <div className="flex items-center gap-2 bg-dark-100 p-3 mt-12 rounded-t-md border-b border-gray-100/10">
        {Loading ? (
          <>
            <Skeleton circle width={40} height={40} />
            <Skeleton width={180} height={25} />
          </>
        ) : (
          <div className="flex gap-2 items-center">
            <button className="transition hover:bg-dark-200 rounded-full p-1 w-fit">
              <Link to={`/groups`}><img src={back} className="size-7" /></Link>
            </button>
            <img src={group?.pictureUrl} className="size-10 rounded-full" />
            <p className="text-lg">{group?.name}</p>
          </div>
        )}
      </div>

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
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-dark-500 italic text-lg">Start a conversation, say Hi!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {data.map((msg, index) => {
                const showDate = index === 0 || !isSameDay(data[index - 1].date, msg.date)

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <p className="text-dark-500 text-xs text-center my-2">{formatDate(msg.date)}</p>
                    )}

                    {msg.senderId === currentUserId ? (
                      <div className="flex justify-end items-center gap-2">
                        <div className="cursor-pointer relative three-dots-menu" onClick={() => toggleDeleteMenu(msg.id)}>
                          <img className="size-5" src={threeDots} />
                          <p
                            onClick={() => handleDelete(msg.id)}
                            className={`absolute top-full mt-3 -right-10 z-10 py-2 px-4 rounded-md cursor-pointer bg-dark-200 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-200 ${showDeleteId === msg.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>Delete</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {msg.content && (
                            <p className="bg-dark-200 py-2 px-4 rounded-2xl w-fit">{msg.content}</p>
                          )}
                          {msg.imageUrl && (
                            <img src={msg.imageUrl} className="max-w-[18rem] w-[90%] rounded-2xl" />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <img className="size-8 rounded-full self-end" src={msg.sender.pictureURL} />
                        <div className="flex flex-col gap-2">
                          <p className="text-dark-500 text-xs ml-3">@{msg.sender.firstName}</p>
                          <div className="flex flex-col gap-2">
                            {msg.content && (
                              <p className="bg-dark-200 py-2 px-4 rounded-2xl w-fit">{msg.content}</p>
                            )}
                            {msg.imageUrl && (
                              <img src={msg.imageUrl} className="max-w-[18rem] w-[90%] rounded-2xl" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <div className="bg-dark-100">
        <div className={`relative p-3 w-fit h-fit ${imagePreview ? "" : "hidden"}`}>
          <img className="w-60 rounded-md" src={imagePreview} />
          <button onClick={handleCancelImage} className="absolute size-6 top-0 right-0 bg-dark-300 rounded-full p-1 cursor-pointer">
            <img src={close} />
          </button>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />

        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-dark-100">
          <textarea rows={1} value={message} onChange={handleMessageInput} className="resize-none flex-1 py-1.5 px-4 border border-gray-100/10 rounded-3xl" />
          <div onClick={HandleImageUpload} className="cursor-pointer p-1.5 border border-gray-100/10 rounded-full">
            <img src={image} className="size-5" />
          </div>
          <button disabled={isSubmitting || !(message.trim() || imagePreview)} type="submit" className="cursor-pointer p-1.5 border border-gray-100/10 rounded-full disabled:opacity-70">
            <img src={send} className="size-5" />
          </button>
        </form>
      </div>

      <Sidebar />
    </div>
  )
}