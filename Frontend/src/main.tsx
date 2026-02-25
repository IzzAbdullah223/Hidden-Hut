import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider,Navigate } from 'react-router'
import './index.css'
import { LogIn } from './components/auth/LogIn'
import { SignUp } from './components/auth/SignUp'
import { Global } from './components/pages/Global'
import { SkeletonTheme } from 'react-loading-skeleton'

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
  }

]);

createRoot(document.getElementById('root')!).render(
 // <StrictMode>
      <SkeletonTheme baseColor='#313131' highlightColor='#525252'> 
      <RouterProvider router={router}/>
      </SkeletonTheme>
  //</StrictMode>,
)