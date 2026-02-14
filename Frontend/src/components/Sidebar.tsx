import GlobalIcon from '../assets/global2.svg'
import messageIcon from '../assets/message.svg'
import groupIcon from '../assets/group.svg'
import profileIcon from '../assets/profile.svg'
import logoutIcon from '../assets/logout.svg'
import { NavLink } from 'react-router-dom'

export function Sidebar(){

    return(
        <div className="bg-dark flex items-center justify-between gap-4 p-1">
            
        <NavLink to={'/global'} className={({isActive})=>isActive? "rounded-md  bg-neutral-400/20 p-3":""}> 
        <img className='w-6 h-6' src={GlobalIcon}/>
        </NavLink>

        <NavLink to={'/chats'}  className={({isActive})=>isActive? "rounded-md  bg-neutral-400/20 p-3":"hover:bg-neutral-400/20 transition duration-200 rounded-md p-3"}>
         <img className='w-6 h-6' src={messageIcon}/>
         </NavLink>

        <NavLink to={'/groups'} className={({isActive})=>isActive? "rounded-md  bg-neutral-400/20 p-3":"hover:bg-neutral-400/20 transition duration-200 rounded-md p-3"}>
         <img className='w-6 h-6' src={groupIcon}/>
         </NavLink>

        <NavLink to={'/profile'} className={({isActive})=>isActive? "rounded-md  bg-neutral-400/20 p-3":"hover:bg-neutral-400/20 transition duration-200 rounded-md p-3"}>
         <img className='w-6 h-6' src={profileIcon}/>
         </NavLink>

        <NavLink to={'/login'} className={({isActive})=>isActive?  "rounded-md  bg-neutral-400/20 p-3":"hover:bg-neutral-400/20 transition duration-200 rounded-md p-3"}>
         <img className='w-6 h-6' src={logoutIcon}/>
         </NavLink>
        </div>
    )
}