import { Sidebar } from "../Sidebar";
import { Outlet } from "react-router-dom";
 

export function Layout(){

  
 
 
    return(
        <div className="">

            <main>
                <Outlet/>
            </main>
            <Sidebar/>
        </div>
    )
    
}