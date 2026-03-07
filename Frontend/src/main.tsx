import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider,Navigate } from 'react-router'
import './index.css'
import { LogIn } from './components/auth/LogIn'
import { SignUp } from './components/auth/SignUp'
import { Global } from './components/pages/Global'
import { Groups } from './components/pages/Groups'
import { Chats } from './components/pages/Chats'
import { Profile } from './components/pages/Profile'
import { SkeletonTheme } from 'react-loading-skeleton'
import { GroupCreate } from './components/pages/GroupCreate'
import { ProfileEdit } from './components/pages/ProfileEdit'
import { ChangePassword } from './components/pages/ChangePassword'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
   path:"/global",
   element:<Global />
  },
  {
    path:"/chats",
    element:<Chats />
  },
  {
    path:"/profile/:id",
    element:<Profile/>
  },
  {
    path:"/profile/edit/:id",
    element:<ProfileEdit/>
  },
  {
    path:"/profile/change/password/:id",
    element:<ChangePassword/>
  },
  {
    path:"/groups",
    element:<Groups/>
  },
  {
    path:'/group/create',
    element:<GroupCreate/>
  }

]);

createRoot(document.getElementById('root')!).render(
 // <StrictMode>
      <SkeletonTheme baseColor='#313131' highlightColor='#525252'> 
      <RouterProvider router={router}/>
      </SkeletonTheme>
  //</StrictMode>,
)