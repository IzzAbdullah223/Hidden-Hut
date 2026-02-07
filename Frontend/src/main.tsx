import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider,Navigate } from 'react-router'
import './index.css'
import { Form } from './components/auth/Form'

const router = createBrowserRouter([
  {path:'/',
    element:<Navigate to={'/signup'}/>
  },
  {path:'/:form',
    element:<Form/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)