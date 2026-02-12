import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider,Navigate } from 'react-router'
import './index.css'
import { LogIn } from './components/auth/LogIn'
import { SignUp } from './components/auth/SignUp'
import { Layout } from './components/layout/Layout'
import { Global } from './components/pages/global'

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
    element: <Layout/>,
    children:[
      {
        path:"/global",
        element:<Global/>
      }
    ]
  }

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)