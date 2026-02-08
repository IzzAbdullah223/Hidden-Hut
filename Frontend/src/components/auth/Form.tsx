import { SignUp } from "./SignUp"
//import { LogIn } from "./LogIn"
import { useParams } from "react-router"
export function Form(){

    const{form} = useParams()

    //console.log(form)

    if(form==='login')
    return <SignUp/>
    
    return <SignUp/>
    
}