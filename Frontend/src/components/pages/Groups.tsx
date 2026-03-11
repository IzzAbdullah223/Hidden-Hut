import { Sidebar } from "../Sidebar"
import { useEffect, useState, useRef } from "react"
import { getGroups, getGroup } from "@/services/groupServices"
import { fetchGroupMessages, sendGroupMessage, deleteMessage } from "../../services/messagesServices"
import { type Messages, type Groups, type Group } from "@/lib/types"
import { Link } from "react-router-dom"
import plus from '../../assets/plus.svg'
import image from '../../assets/image.svg'
import send from '../../assets/send.svg'
import threeDots from '../../assets/three dots.svg'
import close from '../../assets/close.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function Groups() {
    const currentUserId = Number(localStorage.getItem('currentUserId'))
    const [groupsData, setGroupsData] = useState<Group>()
    const [loadingSkeleton, setLoadingSkeleton] = useState(false)

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

    const fetchUserGroups = async () => {
        setLoadingSkeleton(true)
        const response = await getGroups()
        if (response.status === 200) {
            const responseData = await response.json()
            setGroupsData(responseData)
            setLoadingSkeleton(false)
        }
    }

    const handleGroupClick = async (groupId: number) => {
        setSelectedGroupId(groupId)
        const response = await getGroup(String(groupId))
        if (response.status === 200) {
            const groupData = await response.json()
            setSelectedGroup(groupData)
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
        const response = await deleteMessage(messageId)
        console.log(response)
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
        await sendGroupMessage(formData, String(selectedGroupId))
        setIsSubmitting(false)
        setMessage('')
        setImagePreview(undefined)
        setSelectedFile(null)
        setRefreshTrigger(prev => prev + 1)
    }

    useEffect(() => {
        fetchUserGroups()
    }, [])

    useEffect(() => {
        fetchMessages()
    }, [selectedGroupId, refreshTrigger])

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

    return (
        <div className="flex flex-col sm:flex-row sm:gap-1 sm:p-1 sm:pb-2 md:p-3 md:gap-3 h-screen bg-dark">

            <Sidebar />

            {/*  groups list panel */}
            <div className="flex flex-col flex-1 sm:flex-none sm:w-80 bg-dark-100 mt-12 sm:mt-0 rounded-t-md sm:rounded-md text-white">
                <div className="p-3">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex justify-between">
                            <h1 className="text-[1.6rem] font-semibold">Groups</h1>
                            <Link to={'/group/create'} className="transition hover:bg-gray-400/20 rounded-full p-1">
                                <img src={plus} className="size-7 cursor-pointer" />
                            </Link>
                        </div>
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
                                            {/*  mobile navigate to group chat */}
                                            <Link
                                                to={`/group/chats/${group.id}`}
                                                className="flex sm:hidden gap-2 p-2 rounded-md transition hover:bg-dark-200"
                                            >
                                                <img className="size-10 rounded-full object-cover object-center" src={group.pictureUrl} />
                                                <div className="flex flex-col justify-center">
                                                    <p>{group.name}</p>
                                                </div>
                                            </Link>

                                            {/* desktop open the chat panel sm+ */}
                                            <div
                                                onClick={() => handleGroupClick(group.id)}
                                                className={`hidden sm:flex gap-2 p-2 rounded-md transition cursor-pointer ${selectedGroupId === group.id ? 'bg-dark-200' : 'hover:bg-dark-200'}`}
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

            {/* chat panel */}
            <div className="hidden sm:flex sm:flex-col sm:flex-1 overflow-hidden rounded-md bg-dark-100">
                {selectedGroup ? (
                    <>
                        {/* header*/}
                        <div className="flex items-center gap-2 p-3 border-b border-gray-100/10">
                            <img src={selectedGroup.pictureUrl} className="size-10 rounded-full" />
                            <p className="text-lg text-white">{selectedGroup.name}</p>
                        </div>

                        {/* messages */}
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
                            ) : (
                                <>
                                    <p className="text-dark-500 text-xs text-center">01/06/2026</p>
                                    <div className="flex flex-col gap-2">
                                        {messages.map((msg) => (
                                            msg.senderId === currentUserId ? (
                                                <div className="flex justify-end items-center gap-2" key={msg.id}>
                                                    <div className="cursor-pointer relative three-dots-menu" onClick={() => toggleDeleteMenu(msg.id)}>
                                                        <img className="size-5" src={threeDots} />
                                                        <p
                                                            onClick={() => handleDelete(msg.id)}
                                                            className={`absolute top-full mt-3 -right-10 z-10 py-2 px-4 rounded-md cursor-pointer bg-dark-200 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-200 ${showDeleteId === msg.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>Delete</p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {msg.content && (
                                                            <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl w-fit">{msg.content}</p>
                                                        )}
                                                        {msg.imageUrl && (
                                                            <img src={msg.imageUrl} className="max-w-[18rem] w-[90%] rounded-2xl" />
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-4" key={msg.id}>
                                                    <img className="size-8 rounded-full self-end" src={msg.sender.pictureURL} />
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-dark-500 text-xs ml-3">@{msg.sender.firstName}</p>
                                                        <div className="flex flex-col gap-2">
                                                            {msg.content && (
                                                                <p className="bg-dark-200 text-white py-2 px-4 rounded-2xl w-fit">{msg.content}</p>
                                                            )}
                                                            {msg.imageUrl && (
                                                                <img src={msg.imageUrl} className="max-w-[18rem] w-[90%] rounded-2xl" />
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

                      
                        <div className="bg-dark-100">
                            <div className={`relative p-3 w-fit h-fit ${imagePreview ? "" : "hidden"}`}>
                                <img className="w-60 rounded-md" src={imagePreview} />
                                <button onClick={handleCancelImage} className="absolute size-6 top-0 right-0 bg-dark-300 rounded-full p-1 cursor-pointer">
                                    <img src={close} />
                                </button>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-dark-100">
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
            </div>

        </div>
    )
}