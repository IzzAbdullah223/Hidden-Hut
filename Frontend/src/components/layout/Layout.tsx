import { Sidebar } from "../Sidebar";
import { Outlet } from "react-router-dom";

export function Layout(){

    return(
        <div>
            <Sidebar/>
            <main>
                <Outlet/>
            </main>
        </div>
    )
    
}