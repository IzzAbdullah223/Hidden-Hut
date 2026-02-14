import {type HeaderProps } from "../lib/types";
import Logo from '../assets/logo.jpg'


export function Header(props:HeaderProps){

    return(<div className="flex items-center gap-2 bg-dark-100 p-2">
            <img className="size-10  rounded-full" src={Logo}/>
            <p className=" text-lg capitalize text-white">{props.name} Chat</p>
        </div>)

}