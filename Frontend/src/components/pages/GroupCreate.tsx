import { Sidebar } from "../Sidebar"
import back from '../../assets/back.svg'
import { Link } from "react-router-dom"
import {useNavigate } from "react-router-dom"
import default_cover from '../../assets/default_group.jpg'
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGroupSchema, type TcreateGroupSchema, type User } from "@/lib/types"
import { getFriends } from "@/services/userServices"
import { createGroup } from "@/services/groupServices"
import edit from '../../assets/edit.svg'

export function GroupCreate() {

 
  const navigate = useNavigate()

  const [imagePreview, setImagePreview] = useState(default_cover)
  const [groupUsers, setGroupUsers] = useState<User[]>([])
  const [friends, setFriends] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TcreateGroupSchema>({
    resolver: zodResolver(createGroupSchema)
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const getUsers = async () => {

    const response = await getFriends()

    if (response.status === 200) {
      const responseData = await response.json()
      setFriends(responseData)
    }

  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setImagePreview(imageUrl)

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

  const onSubmit = async (data: TcreateGroupSchema) => {

    if (!fileInputRef.current?.files?.[0]) {
      alert("Please select a picture")
      return
    }
    if(friends.length<1){
        alert("You do not have friends to create a grou")
        return
    }
    const formData = new FormData()

    formData.append('groupName', data.groupName)
    formData.append('image', fileInputRef.current.files[0])
    formData.append('groupMembers', JSON.stringify(groupUsers.map(u => u.id)))

    const response = await createGroup(formData)

    if(response.status===201){
        navigate('/groups')
    }

    

  }

  useEffect(() => {

    getUsers()

  }, [])

  return (

    <div className="flex flex-col h-screen bg-dark">

      <div className="flex flex-col flex-1 mt-12 rounded-md bg-dark-100 p-3 gap-3 text-white">

        <div className="flex gap-1 border-b border-dark-400 pb-2">

          <div className="transition hover:bg-dark-200 rounded-full p-1 w-fit">
            <Link to={`/groups`}>
              <img src={back} className="size-7" />
            </Link>
          </div>

          <h1 className="text-2xl font-semibold">Create Group</h1>

        </div>

        <div className="flex flex-col gap-5 border-b border-dark-400 pb-4">

          <div className="flex items-center justify-between">

            <h1 className="text-[1.15rem]">Group Profile</h1>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />

            <Button
              onClick={handleImageUpload}
              variant="secondary"
              className="font-semibold text-dark-100 gap-0 px-3.5 py-4.5 text-[0.94rem] cursor-pointer hover:bg-secondary"
            >
              Change
              <img src={edit} className="size-4 ml-2 mb-[1px]" />
            </Button>

          </div>

          <div className="flex justify-center">
            <img
              src={imagePreview}
              className="size-[12rem] rounded-full object-cover object-center"
            />
          </div>

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="text-[1.1rem] p-3">

          <div className="flex flex-col">

            <label>Group name:</label>

            <input
              type="text"
              {...register("groupName")}
              className="rounded-sm py-1.5 px-2 mb-2 bg-dark-200"
            />

            {errors.groupName && (
              <p className='text-red-500 -mt-1 text-[0.95rem]'>
                {errors.groupName.message}
              </p>
            )}

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
              <p className="text-red-500 text-[0.95rem] mt-1">
                You have no friends to add
              </p>
            )}

            {searchQuery && filteredFriends.length > 0 && (

              <div className="absolute top-full left-0 w-full bg-dark-300 rounded-md max-h-60 overflow-y-auto z-10">

                {filteredFriends.map(user => (

                  <div
                    key={user.id}
                    className="p-2 hover:bg-dark-200 cursor-pointer flex items-center gap-4"
                    onClick={() => addUserToGroup(user)}
                  >

                    <img
                      src={user.pictureURL}
                      className="size-10 rounded-full object-cover object-center"
                    />

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

                  <div
                    key={user.id}
                    className="flex gap-2 p-2 rounded-md transition hover:bg-dark-200 w-full cursor-pointer"
                    onClick={() => removeUserFromGroup(user.id)}
                  >

                    <img
                      className="size-10 rounded-full"
                      src={user.pictureURL}
                    />

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

            <Button
              disabled={isSubmitting}
              variant="secondary"
              className="cursor-pointer text-[0.94rem] px-4 py-5.5 text-black"
            >
              Create group
            </Button>

          </div>

        </form>

      </div>

      <Sidebar />

    </div>

  )
}