import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function Layout(){

    const location = useLocation()
 
 
    return(
        <div className="h-screen bg-dark flex flex-col">
            <Header name={location.pathname.replace('/','')} />
             
            <main>
                <Outlet/>
            </main>
            <Sidebar/>
        </div>
    )
    
}