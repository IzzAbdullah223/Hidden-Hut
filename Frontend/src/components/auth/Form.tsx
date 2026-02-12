import { SignUp } from "./SignUp"
import { LogIn } from "./LogIn"
import { useParams } from "react-router"
export function Form(){

    const{form} = useParams()


    if(form==='login'){
         return <LogIn/>
    }
    return <SignUp/>
    

    
}