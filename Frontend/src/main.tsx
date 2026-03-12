import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider,Navigate } from 'react-router'
import './index.css'
import { Toaster } from 'react-hot-toast'  // Add this import
import { LogIn } from './components/auth/LogIn'
import { SignUp } from './components/auth/SignUp'
import { Global } from './components/pages/Global'
import { Groups } from './components/pages/Groups'
import { Chats } from './components/pages/Chats'
import { Profile } from './components/pages/Profile'
import { SkeletonTheme } from 'react-loading-skeleton'
import { GroupCreate } from './components/pages/GroupCreate'
import { ProfileEdit } from './components/pages/ProfileEdit'
import { FriendChat } from './components/pages/FriendChat'
import { ChangePassword } from './components/pages/ChangePassword'
import { GroupChat } from './components/pages/GroupChat'

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
    path:'/chats/:id',
    element:<FriendChat/>
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
  },
  {
    path:'/group/chats/:id',
    element:<GroupChat/>
  }

]);

createRoot(document.getElementById('root')!).render(
 // <StrictMode>
      <SkeletonTheme baseColor='#313131' highlightColor='#525252'> 
  <Toaster 
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#242526',  // Match your dark theme
          color: '#fff',
          border: '1px solid #3a3b3c',
        },
        success: {
          iconTheme: {
            primary: '#4ade80',
            secondary: '#fff',
          },
        },
        error: {
          style:{
            background:'#ef444',
            color:'#fff'
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
      <RouterProvider router={router}/>
      </SkeletonTheme>
  //</StrictMode>,
)