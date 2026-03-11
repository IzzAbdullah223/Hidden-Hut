import { Sidebar } from "../Sidebar"
import Skeleton from 'react-loading-skeleton'
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { type User, type TeditProfileSchema, editProfileSchema, changePasswordSchema, type TchangePasswordSchema } from '../../lib/types'
import camera from '../../assets/camera.svg'
import edit from '../../assets/edit.svg'
import back from '../../assets/back.svg'
import { useEffect, useState, useRef } from "react"
import { changeProfileBanner, changeProfilePicture, fetchUser, editProfile, passwordChange } from "../../services/userServices"
import { useParams, useNavigate } from "react-router-dom"
import 'react-loading-skeleton/dist/skeleton.css'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

type ActivePanel = 'profile' | 'edit' | 'password'

export function Profile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const currentUserId = localStorage.getItem('currentUserId')
    const isOwnProfile = Number(currentUserId) === Number(id)

    const [data, setData] = useState<User>()
    const [loading, setLoading] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [activePanel, setActivePanel] = useState<ActivePanel>('profile')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const profilePicInputRef = useRef<HTMLInputElement>(null)

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        formState: { errors: editErrors, isSubmitting: isEditSubmitting },
        reset: resetEdit,
        setError: setEditError,
    } = useForm<TeditProfileSchema>({
        resolver: zodResolver(editProfileSchema)
    })

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
        setError: setPasswordError,
    } = useForm<TchangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema)
    })

    const fetchProfile = async () => {
        setLoading(true)
        const response = await fetchUser(Number(id))
        if (response.status === 200) {
            const responseData = await response.json()
            setData(responseData)
            resetEdit({
                fName: responseData.firstName,
                lName: responseData.lastName,
                username: responseData.username,
                bio: responseData.bio
            })
            setLoading(false)
        }
    }

    const handleBannerUpload = () => fileInputRef.current?.click()

    const handleBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (fileInputRef.current) fileInputRef.current.value = ""
        const formData = new FormData()
        formData.append('image', file)
        const response = await changeProfileBanner(formData)
        if (response.status === 200) setRefreshTrigger(prev => prev + 1)
    }

    const handleProfilePicUpload = () => profilePicInputRef.current?.click()

    const handleProfilePicSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (profilePicInputRef.current) profilePicInputRef.current.value = ""
        const formData = new FormData()
        formData.append('image', file)
        formData.append('userId', String(id))
        const response = await changeProfilePicture(formData)
        if (response.status === 200) fetchProfile()
    }

    const onEditSubmit = async (formData: TeditProfileSchema) => {
        const response = await editProfile(formData, id)
        if (response.errors?.username) {
            setEditError("username", { type: "server", message: response.errors.username })
        }
        if (response.success) {
            fetchProfile()
            setActivePanel('profile')
        }
    }

    const onPasswordSubmit = async (formData: TchangePasswordSchema) => {
        const response = await passwordChange(formData)
        if (response.errors?.password) {
            setPasswordError("password", { type: "server", message: response.errors.password })
        }
        if (response.success) setActivePanel('profile')
    }

    useEffect(() => {
        setActivePanel('profile')
        fetchProfile()
    }, [id, refreshTrigger])

    return (
        <div className="flex flex-col sm:flex-row sm:gap-1 sm:p-1 sm:pb-2 md:p-3 md:gap-3 h-screen bg-dark">

            <Sidebar />

            {/* MOBILE: plain profile view */}
            <div className="flex sm:hidden flex-col flex-1 p-3 mt-12 rounded-lg bg-dark-100">
                {loading ? (
                    <>
                        <Skeleton height={256} className="rounded-md" />
                        <div className="flex flex-col gap-4 -mt-25 pl-3">
                            <Skeleton circle width={160} height={160} className="z-10" />
                            <div>
                                <Skeleton width={200} height={28} />
                                <Skeleton width={120} height={20} />
                            </div>
                            <div className="flex gap-3 mt-5">
                                <Skeleton width={130} height={40} />
                                <Skeleton width={180} height={40} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <img src={data?.profileBanner} className="w-full h-[16rem] object-cover object-center rounded-md" />
                            {isOwnProfile && (
                                <div className="absolute right-2 bottom-2 w-fit p-2 rounded-full bg-dark-300">
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBannerFileSelect} />
                                    <img src={camera} className="size-5 cursor-pointer" onClick={handleBannerUpload} />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-4 -mt-25 pl-3">
                            <div className="relative w-fit z-10">
                                <img src={data?.pictureURL} className="rounded-full object-cover object-center !size-[10rem]" />
                                <div className="absolute size-5 rounded-full bottom-3 right-3 bg-stale"></div>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-white">{data?.firstName} {data?.lastName}</p>
                                <p className="text-dark-500">@{data?.username}</p>
                                <p className="text-dark-500 mt-2">{data?.bio}</p>
                            </div>
                            {isOwnProfile ? (
                                <div className="flex gap-3 mt-5">
                                    <Link to={`/profile/edit/${data?.id}`}><Button variant="secondary" className="text-base cursor-pointer">Edit Profile</Button></Link>
                                    <Link to={`/profile/change/password/${data?.id}`}><Button variant="secondary" className="text-base cursor-pointer">Change Password</Button></Link>
                                </div>
                            ) : (
                                <Link to={`/chats/${data?.id}`} className="flex gap-3 mt-5 w-fit">
                                    <Button variant="secondary" className="text-base cursor-pointer">Send Message</Button>
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* DESKTOP: options panel */}
            <div className="hidden sm:flex flex-col sm:w-64 bg-dark-100 rounded-md text-white">
                <div className="p-3 border-b border-dark-400">
                    {isOwnProfile ? (
                        <h1 className="text-[1.6rem] font-semibold">Manage Profile</h1>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate(-1)} className="transition hover:bg-dark-200 rounded-full p-1">
                                <img src={back} className="size-6" />
                            </button>
                            <h1 className="text-[1.4rem] font-semibold">User Profile</h1>
                        </div>
                    )}
                </div>
                <div className="flex-1 px-3 py-2 overflow-y-auto">
                    <div className="flex flex-col gap-1 text-dark-500">
                        {(['profile', ...(isOwnProfile ? ['edit', 'password'] : [])] as ActivePanel[]).map(panel => (
                            <div
                                key={panel}
                                onClick={() => setActivePanel(panel)}
                                className={`flex p-2 rounded-md transition cursor-pointer ${activePanel === panel ? 'bg-dark-200' : 'hover:bg-dark-200'}`}
                            >
                                {panel === 'profile' ? 'Profile' : panel === 'edit' ? 'Edit Profile' : 'Change Password'}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DESKTOP: content panel */}
            <div className="hidden sm:flex sm:flex-col sm:flex-1 overflow-hidden rounded-md bg-dark-100">

                {/* PROFILE VIEW */}
                {activePanel === 'profile' && (
                    <div className="flex-1 overflow-y-auto p-3">
                        {loading ? (
                            <>
                                <Skeleton height={256} className="rounded-md" />
                                <div className="flex flex-col gap-4 -mt-25 pl-3">
                                    <Skeleton circle width={160} height={160} className="z-10" />
                                    <div>
                                        <Skeleton width={200} height={28} />
                                        <Skeleton width={120} height={20} />
                                    </div>
                                    <div className="flex gap-3 mt-5">
                                        <Skeleton width={130} height={40} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="relative">
                                    <img src={data?.profileBanner} className="w-full h-[16rem] object-cover object-center rounded-md" />
                                    {isOwnProfile && (
                                        <div className="absolute right-2 bottom-2 w-fit p-2 rounded-full bg-dark-300">
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBannerFileSelect} />
                                            <img src={camera} className="size-5 cursor-pointer" onClick={handleBannerUpload} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-4 -mt-25 pl-3">
                                    <div className="relative w-fit z-10">
                                        <img src={data?.pictureURL} className="rounded-full object-cover object-center !size-[10rem]" />
                                        <div className="absolute size-5 rounded-full bottom-3 right-3 bg-stale"></div>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-semibold text-white">{data?.firstName} {data?.lastName}</p>
                                        <p className="text-dark-500">@{data?.username}</p>
                                        <p className="text-dark-500">{data?.bio}</p>
                                    </div>
                                    {isOwnProfile ? (
                                        <div className="flex justify-end gap-3 mt-5">
                                            <Button onClick={() => setActivePanel('edit')} variant="secondary" className="text-base cursor-pointer">Edit Profile</Button>
                                        </div>
                                    ) : (
                                        <Link to={`/chats/${data?.id}`} className="flex gap-3 mt-5 w-fit">
                                            <Button variant="secondary" className="text-base cursor-pointer">Send Message</Button>
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* EDIT PROFILE VIEW */}
                {activePanel === 'edit' && (
                    <div className="flex flex-col flex-1 p-3 gap-3 text-white overflow-y-auto">
                        <div className="flex flex-col gap-5 border-b border-dark-400 pb-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-[1.4rem] font-semibold">Profile picture</h1>
                                <input type="file" ref={profilePicInputRef} className="hidden" accept="image/*" onChange={handleProfilePicSelect} />
                                <Button onClick={handleProfilePicUpload} variant="secondary" className="font-semibold text-dark-100 gap-0 px-3 py-4.5 text-[0.94rem] cursor-pointer hover:bg-secondary">
                                    Edit
                                    <img src={edit} className="size-4 ml-2 mb-[1px]" />
                                </Button>
                            </div>
                            <div className="flex justify-center">
                                <img src={data?.pictureURL} className="size-[12rem] rounded-full object-cover object-center" />
                            </div>
                        </div>
                        <form onSubmit={handleSubmitEdit(onEditSubmit)} className="text-[1.2rem] text-dark-500">
                            <div className="flex flex-col">
                                <label>First name:</label>
                                <input type="text" {...registerEdit("fName")} className="rounded-sm p-1 px-2 bg-dark-200" />
                                {editErrors.fName && <p className='text-red-500 text-[1rem]'>{`${editErrors.fName.message}`}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label>Last name:</label>
                                <input type="text" {...registerEdit('lName')} className="rounded-sm p-1 px-2 bg-dark-200" />
                                {editErrors.lName && <p className='text-red-500 text-[1rem]'>{`${editErrors.lName.message}`}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label>Username:</label>
                                <input type="text" {...registerEdit('username')} className="rounded-sm p-1 px-2 bg-dark-200" />
                                {editErrors.username && <p className='text-red-500 text-[1rem]'>{`${editErrors.username.message}`}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label>Bio:</label>
                                <textarea {...registerEdit("bio")} className="bg-dark-200 rounded-md px-2 py-1 text-lg" rows={6} />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button disabled={isEditSubmitting} variant="secondary" className="cursor-pointer text-[0.94rem] px-4 py-5.5 text-black">
                                    Save changes
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* CHANGE PASSWORD VIEW */}
                {activePanel === 'password' && (
                    <div className="flex flex-col flex-1 p-3 gap-2 text-white overflow-y-auto">
                        <div className="border-b border-dark-400 pb-2">
                            <h1 className="text-[1.22rem] font-semibold p-1">Change Password</h1>
                        </div>
                        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="flex flex-col gap-2 text-[1.1rem] text-dark-500">
                            <div className="flex flex-col">
                                <label>Enter old password:</label>
                                <input type="password" {...registerPassword("password")} className="rounded-sm p-1 px-2 bg-dark-200" />
                                {passwordErrors.password && <p className='text-red-500 text-[0.95rem]'>{`${passwordErrors.password.message}`}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label>Enter new password:</label>
                                <input type="password" {...registerPassword('newPassword')} className="rounded-sm p-1 px-2 bg-dark-200" />
                                {passwordErrors.newPassword && <p className='text-red-500 text-[0.95rem]'>{`${passwordErrors.newPassword.message}`}</p>}
                            </div>
                            <div className="flex flex-col">
                                <label>Confirm new password:</label>
                                <input type="password" {...registerPassword('confirmPassword')} className="rounded-sm p-1 px-2 bg-dark-200" />
                                {passwordErrors.confirmPassword && <p className='text-red-500 text-[0.95rem]'>{`${passwordErrors.confirmPassword.message}`}</p>}
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button disabled={isPasswordSubmitting} variant="secondary" className="cursor-pointer text-[0.94rem] -mt-3 px-5 py-4.5 text-black">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

            </div>

        </div>
    )
}