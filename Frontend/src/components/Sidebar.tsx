import GlobalIcon from '../assets/global2.svg'
import messageIcon from '../assets/message.svg'
import groupIcon from '../assets/group.svg'
import profileIcon from '../assets/profile.svg'
import logoutIcon from '../assets/logout.svg'
import { NavLink, useNavigate } from 'react-router-dom'

export function Sidebar() {
    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem('currentUserId')
        localStorage.removeItem('token')
        navigate('/login')
    }
    const currentUserId = localStorage.getItem('currentUserId')

    return (
        <div className="bg-dark
            text-white 
            flex flex-row sm:flex-col               
            items-center justify-between
            gap-1 p-1 sm:p-0
            order-last sm:order-first">

            <NavLink to={'/global'} className={({ isActive }) => isActive ? " flex items-center gap-2  rounded-md bg-neutral-400/20 p-3" : "flex items-center gap-2  hover:bg-neutral-400/20 transition duration-200 rounded-md p-3"}>
                <img className='size-7 sm:size-6' src={GlobalIcon} />
                <p className='font-semibold hidden lg:block text-lg'>Global</p>
            </NavLink>
            <NavLink to={'/chats'} className={({ isActive }) => isActive ? " flex items-center gap-2  rounded-md bg-neutral-400/20 p-3 sm:w-full" : "  flex items-center gap-2  hover:bg-neutral-400/20 transition duration-200 rounded-md p-3 sm:w-full"}>
                <img className='size-7 sm:size-6' src={messageIcon} />
                <p className='font-semibold hidden lg:block text-lg'>Chats</p>
            </NavLink>
            <NavLink to={'/groups'} className={({ isActive }) => isActive ? " flex items-center gap-2  rounded-md bg-neutral-400/20 p-3" : "flex items-center gap-2  hover:bg-neutral-400/20 transition duration-200 rounded-md p-3"}>
                <img className='size-7 sm:size-6' src={groupIcon} />
                <p className='font-semibold hidden lg:block text-lg'>Groups</p>
            </NavLink>

            <div className="hidden sm:block sm:flex-1" />

            <NavLink to={`/profile/${currentUserId}`} className={({ isActive }) => isActive ? " flex items-center gap-2  rounded-md bg-neutral-400/20 p-3" : "flex items-center gap-2  hover:bg-neutral-400/20 transition duration-200 rounded-md p-3"}>
                <img className='size-7 sm:size-6' src={profileIcon} />
                <p className='font-semibold hidden lg:block text-lg'>Profile</p>
            </NavLink>
            <div onClick={logOut} className="flex items-center  hover:bg-neutral-400/20 transition duration-200 rounded-md p-3 cursor-pointer">
                <img className='size-7 sm:size-6' src={logoutIcon} />
                <p className='font-semibold hidden lg:block text-lg'>Logout</p>
            </div>

        </div>
    )
}