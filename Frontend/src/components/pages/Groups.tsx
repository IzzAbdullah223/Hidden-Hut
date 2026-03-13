import { Sidebar } from "../Sidebar"
import { useEffect, useState, useRef } from "react"
import { getGroups, getGroup, createGroup } from "@/services/groupServices"
import { fetchGroupMessages, sendGroupMessage, deleteMessage } from "../../services/messagesServices"
import { getFriends } from "@/services/userServices"
import { type Messages, type Groups, type Group, type User, type TcreateGroupSchema, createGroupSchema } from "@/lib/types"
import { Link } from "react-router-dom"
import plus from '../../assets/plus.svg'
import image from '../../assets/image.svg'
import send from '../../assets/send.svg'
import threeDots from '../../assets/three dots.svg'
import close from '../../assets/close.svg'
import edit from '../../assets/edit.svg'
import default_cover from '../../assets/default_group.jpg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Button } from "../ui/button"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { errorToast } from '@/lib/toastStyles'
import { formatDate, isSameDay } from '@/lib/utils'
import { io as socketIO } from 'socket.io-client'
const socket = socketIO(import.meta.env.VITE_API_URL)


type ActiveView = 'chat' | 'create'

export function Groups() {
    const currentUserId = Number(localStorage.getItem('currentUserId'))
    const [groupsData, setGroupsData] = useState<Group>()
    const [loadingSkeleton, setLoadingSkeleton] = useState(false)
    const [activeView, setActiveView] = useState<ActiveView>('chat')

    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
    const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null)
    const [messages, setMessages] = useState<Messages[]>([])
    const [message, setMessage] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showDeleteId, setShowDeleteId] = useState<number | null>(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Create group state
    const [groupImagePreview, setGroupImagePreview] = useState(default_cover)
    const [groupUsers, setGroupUsers] = useState<User[]>([])
    const [friends, setFriends] = useState<User[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const groupFileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting: isCreating },
        reset,
    } = useForm<TcreateGroupSchema>({
        resolver: zodResolver(createGroupSchema)
    })

    const fetchUserGroups = async () => {
        setLoadingSkeleton(true)
        const response = await getGroups()
        if (response.status === 200) {
            const responseData = await response.json()
            setGroupsData(responseData)
            setLoadingSkeleton(false)
        }
    }

    const fetchFriends = async () => {
        const response = await getFriends()
        if (response.status === 200) {
            const responseData = await response.json()
            setFriends(responseData)
        }
    }

    const handleGroupClick = async (groupId: number) => {
        setSelectedGroupId(groupId)
        setActiveView('chat')
        const response = await getGroup(String(groupId))
        if (response.status === 200) {
            const groupData = await response.json()
            setSelectedGroup(groupData)
        }
    }

    const handlePlusClick = () => {
        if (activeView === 'create') {
            setActiveView('chat')
        } else {
            setActiveView('create')
            setSelectedGroupId(null)
            setSelectedGroup(null)
        }
    }

    const fetchMessages = async () => {
        if (!selectedGroupId) return
        setLoadingMessages(true)
        const response = await fetchGroupMessages(selectedGroupId)
        if (response.status === 200) {
            const messagesData: Messages[] = await response.json()
            setMessages(messagesData)
        }
        setLoadingMessages(false)
    }

    const handleMessageInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value)
    }

    const toggleDeleteMenu = (messageId: number) => {
        setShowDeleteId(showDeleteId === messageId ? null : messageId)
    }

    const handleDelete = async (messageId: number) => {
        await deleteMessage(messageId)
        setRefreshTrigger(prev => prev + 1)
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
        if (fileInputRef.current) fileInputRef.current.value = ""
        const imageUrl = URL.createObjectURL(file)
        setImagePreview(imageUrl)
    }

    const handleSubmitMessage = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (!message.trim() && !selectedFile) return
        const formData = new FormData()
        formData.append('message', message)
        if (selectedFile) formData.append('image', selectedFile)
        setIsSubmitting(true)
        await sendGroupMessage(formData, String(selectedGroupId))
        setIsSubmitting(false)
        setMessage('')
        setImagePreview(undefined)
        setSelectedFile(null)
    }

    const handleGroupImageUpload = () => groupFileInputRef.current?.click()

    const handleGroupFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setGroupImagePreview(URL.createObjectURL(file))
    }

    const filteredFriends = friends
        .filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(u => !groupUsers.some(gu => gu.id === u.id))

    const addUserToGroup = (user: User) => {
        setGroupUsers(prev => [...prev, user])
        setSearchQuery("")
    }

    const removeUserFromGroup = (userId: number) => {
        setGroupUsers(prev => prev.filter(user => user.id !== userId))
    }

    const onCreateSubmit = async (data: TcreateGroupSchema) => {
        if (!groupFileInputRef.current?.files?.[0]) {
            errorToast('Fill in the form', 'Please select a picture')
            return
        }
        if (friends.length < 1) {
            alert("You do not have friends to create a group")
            return
        }
        const formData = new FormData()
        formData.append('groupName', data.groupName)
        formData.append('image', groupFileInputRef.current.files[0])
        formData.append('groupMembers', JSON.stringify(groupUsers.map(u => u.id)))
        const response = await createGroup(formData)
        if (response.status === 201) {
            reset()
            setGroupUsers([])
            setGroupImagePreview(default_cover)
            setActiveView('chat')
            fetchUserGroups()
        }
    }

    useEffect(() => {
        fetchUserGroups()
        fetchFriends()
    }, [])

    useEffect(() => {
        fetchMessages()
    }, [selectedGroupId, refreshTrigger])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest('.three-dots-menu')) setShowDeleteId(null)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

useEffect(() => {
  if (!selectedGroupId) return

  const roomId = `group_${selectedGroupId}`

  socket.emit('join_room', roomId)
  socket.off('new_group_message')
  socket.on('new_group_message', (newMessage: Messages) => {
    setMessages(prev => [...prev, newMessage])
  })

  return () => {
    socket.emit('leave_room', roomId)
    socket.off('new_group_message')
  }
}, [selectedGroupId])

    return (
        <div className="flex flex-col sm:flex-row sm:gap-1 sm:p-1 sm:pb-2 md:p-3 md:gap-3 h-screen bg-dark">

            <Sidebar />

            {/* groups list panel */}
            <div className="flex flex-col flex-1 sm:flex-none sm:w-80 bg-dark-100 mt-12 sm:mt-0 rounded-t-md sm:rounded-md text-white">
                <div className="p-3">
                    <div className="flex justify-between">
                        <h1 className="text-[1.6rem] font-semibold">Groups</h1>
                        {/*  mobile navigate to the create group panel  */}
                        <Link to={'/group/create'} className="flex sm:hidden transition hover:bg-gray-400/20 rounded-full p-1">
                            <img src={plus} className="size-7 cursor-pointer" />
                        </Link>
                        {/* desktop toggle the create panel */}
                        <button
                            onClick={handlePlusClick}
                            className="hidden sm:flex transition hover:bg-gray-400/20 rounded-full p-1"
                        >
                            <img src={plus} className={`size-7 cursor-pointer transition-transform duration-300 ${activeView === 'create' ? 'rotate-45' : 'rotate-0'}`} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 px-3 overflow-y-auto">
                    {loadingSkeleton ? (
                        <div className="flex flex-col">
                            <Skeleton height={65} />
                            <Skeleton height={65} />
                            <Skeleton height={65} />
                            <Skeleton height={65} />
                            <Skeleton height={65} />
                        </div>
                    ) : (
                        <div>
                            {groupsData?.count === 0 ? (
                                <p className="italic text-dark-500">You currently have no groups</p>
                            ) : (
                                <div className="flex flex-col">
                                    {groupsData?.groups.map(group => (
                                        <div key={group.id}>
                                            {/* mobile */}
                                            <Link
                                                to={`/group/chats/${group.id}`}
                                                className="flex sm:hidden gap-2 p-2 rounded-md transition hover:bg-dark-200"
                                            >
                                                <img className="size-10 rounded-full object-cover object-center" src={group.pictureUrl} />
                                                <div className="flex flex-col justify-center">
                                                    <p>{group.name}</p>
                                                </div>
                                            </Link>
                                            {/* desktop */}
                                            <div
                                                onClick={() => handleGroupClick(group.id)}
                                                className={`hidden sm:flex gap-2 p-2 rounded-md transition cursor-pointer ${selectedGroupId === group.id && activeView === 'chat' ? 'bg-dark-200' : 'hover:bg-dark-200'}`}
                                            >
                                                <img className="size-10 rounded-full object-cover object-center" src={group.pictureUrl} />
                                                <div className="flex flex-col justify-center">
                                                    <p>{group.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* chat / create panel */}
            <div className="hidden sm:flex sm:flex-col sm:flex-1 overflow-hidden rounded-md bg-dark-100">

                {/* create group view  */}
                {activeView === 'create' && (
                    <div className="flex flex-col flex-1 p-3 gap-3 text-white overflow-y-auto">
                        <div className="border-b border-dark-400 pb-2 mb-1">
                            <h1 className="text-2xl font-semibold">Create Group</h1>
                        </div>
                        <div className="flex flex-col gap-5 border-b border-dark-400 pb-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-[1.15rem]">Group Profile</h1>
                                <input type="file" ref={groupFileInputRef} className="hidden" accept="image/*" onChange={handleGroupFileSelect} />
                                <Button onClick={handleGroupImageUpload} variant="secondary" className="font-semibold text-dark-100 gap-0 px-3.5 py-4.5 text-[0.94rem] cursor-pointer hover:bg-secondary">
                                    Change
                                    <img src={edit} className="size-4 ml-2 mb-[1px]" />
                                </Button>
                            </div>
                            <div className="flex justify-center">
                                <img src={groupImagePreview} className="size-[12rem] rounded-full object-cover object-center" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onCreateSubmit)} className="text-[1.1rem] p-3">
                            <div className="flex flex-col">
                                <label>Group name:</label>
                                <input type="text" {...register("groupName")} className="rounded-sm py-1.5 px-2 mb-2 bg-dark-200" />
                                {errors.groupName && <p className='text-red-500 -mt-1 text-[0.95rem]'>{errors.groupName.message}</p>}
                            </div>

                            <div className="flex flex-col relative mb-3">
                                <label>Select Members:</label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="rounded-sm py-1.5 px-2 bg-dark-200 text-lg placeholder-gray-400"
                                    placeholder="Search friends"
                                />
                                {friends.length === 0 && (
                                    <p className="text-red-500 text-[0.95rem] mt-1">You have no friends to add</p>
                                )}
                                {searchQuery && filteredFriends.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-dark-300 rounded-md max-h-60 overflow-y-auto z-10">
                                        {filteredFriends.map(user => (
                                            <div key={user.id} className="p-2 hover:bg-dark-200 cursor-pointer flex items-center gap-4" onClick={() => addUserToGroup(user)}>
                                                <img src={user.pictureURL} className="size-10 rounded-full object-cover object-center" />
                                                <div className="flex flex-col">
                                                    <p>{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-dark-500">@{user.username}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {groupUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {groupUsers.map(user => (
                                            <div key={user.id} className="flex gap-2 p-2 rounded-md transition hover:bg-dark-200 w-full cursor-pointer" onClick={() => removeUserFromGroup(user.id)}>
                                                <img className="size-10 rounded-full" src={user.pictureURL} />
                                                <div className="flex flex-col">
                                                    <p>{user.firstName} {user.lastName}</p>
                                                    <p className="text-dark-500 text-xs">@{user.username}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button disabled={isCreating} variant="secondary" className="cursor-pointer text-[0.94rem] px-4 py-5.5 text-black">
                                    Create group
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* CHAT VIEW */}
                {activeView === 'chat' && (
                    <>
                        {selectedGroup ? (
                            <>
                                <div className="flex items-center gap-2 p-3 border-b border-gray-100/10">
                                    <img src={selectedGroup.pictureUrl} className="size-10 rounded-full" />
                                    <p className="text-lg text-white">{selectedGroup.name}</p>
                                </div>

<div className="flex-1 p-4 border-b border-gray-100/10 overflow-y-auto">
  {loadingMessages ? (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <Skeleton width={250} height={40} borderRadius={16} />
      </div>
      <div className="flex gap-2">
        <Skeleton circle width={40} height={40} />
        <Skeleton width={250} height={40} borderRadius={16} />
      </div>
    </div>
  ) : messages.length === 0 ? (
    <div className="flex items-center justify-center h-full">
      <p className="text-dark-500 italic text-lg">Start a conversation, say Hi!</p>
    </div>
  ) : (
    <>
      <div className="flex flex-col gap-2">
        {messages.map((msg, index) => {
          const showDate = index === 0 || !isSameDay(messages[index - 1].date, msg.date)

          return (
            <div key={msg.id}>
              {showDate && (
                <p className="text-dark-500 text-xs text-center my-2">{formatDate(msg.date)}</p>
              )}

              {msg.senderId === currentUserId ? (
                <div className="flex justify-end items-center gap-2">
                  <div className="cursor-pointer relative three-dots-menu" onClick={() => toggleDeleteMenu(msg.id)}>
                    <img className="size-5" src={threeDots} />
                    <p onClick={() => handleDelete(msg.id)} className={`absolute top-full mt-3 -right-10 z-10 py-2 px-4 rounded-md cursor-pointer bg-dark-200 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-200 ${showDeleteId === msg.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>Delete</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {msg.content && <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl w-fit">{msg.content}</p>}
                    {msg.imageUrl && <img src={msg.imageUrl} className="max-w-[18rem] w-[90%] rounded-2xl" />}
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <img className="size-8 rounded-full self-end" src={msg.sender.pictureURL} />
                  <div className="flex flex-col gap-2">
                    <p className="text-dark-500 text-xs ml-3">@{msg.sender.firstName}</p>
                    <div className="flex flex-col gap-2">
                      {msg.content && <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl w-fit">{msg.content}</p>}
                      {msg.imageUrl && <img src={msg.imageUrl} className="max-w-[18rem] w-[90%] rounded-2xl" />}
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
                                    <form onSubmit={handleSubmitMessage} className="flex items-center gap-2 p-2 bg-dark-100">
                                        <textarea rows={1} value={message} onChange={handleMessageInput} className="resize-none flex-1 py-1.5 px-4 border border-gray-100/10 text-white rounded-3xl" />
                                        <div onClick={HandleImageUpload} className="cursor-pointer p-1.5 border border-gray-100/10 rounded-full">
                                            <img src={image} className="size-5" />
                                        </div>
                                        <button disabled={isSubmitting || !(message.trim() || imagePreview)} type="submit" className="cursor-pointer p-1.5 border border-gray-100/10 rounded-full disabled:opacity-70">
                                            <img src={send} className="size-5" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex p-5 h-full">
                                <h1 className="text-5xl font-bold text-dark-500 tracking-wide">Groups</h1>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    )
}