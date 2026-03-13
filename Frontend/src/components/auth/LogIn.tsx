import { type TLogInSchema, logInSchema, type TLogInResponse } from '../../lib/types';
import logo from '../../assets/logo.jpg'
import { Link, useNavigate } from "react-router"
import { useForm } from 'react-hook-form'
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { logIn } from '../../services/authServices';
import { successToast, errorToast } from '@/lib/toastStyles';

export function LogIn() {
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TLogInSchema>({
    resolver: zodResolver(logInSchema)
  })

  const onSubmit = async (data: TLogInSchema) => {
    setError(false)
    const response = await logIn(data)
    if (response.status === 401) {
      setError(true)
      reset()
    }
    if (response.status === 200) {
      const data: TLogInResponse = await response.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('currentUserId', String(data.currentUserId))
      successToast('Log in successful')
      navigate('/global')
    } else {
      errorToast('Failed to login\nInvalid username or password')
    }
  }

  const guestLogIn=()=>{
    console.log("Test")
    navigate('/global')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">

        
      {/* Navbar */}
      <nav className="flex items-center px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-8 h-8 rounded-md" />
          <span className="text-white font-bold text-lg">Hidden Hut</span>
        </div>
      </nav>

   
      <div className="flex-1 flex flex-col items-center pt-16 px-4">
        <div className="w-full max-w-2xl mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            Enter Hidden Hut.
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-white/80">
            A secretly private, group, and global chat app.
          </p>
        </div>

        {/* card */}
        <div className="w-full max-w-sm bg-[#1e1f20] rounded-xl ring-1 ring-white/10 p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-white font-semibold text-base">Log in to your account</h2>
            <p className="text-neutral-400 text-sm mt-0.5">Enter your credentials to log in to your account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-white text-sm font-medium">Username</label>
              <input
                {...register('username')}
                type="text"
                className="bg-[#2a2b2d] text-white text-sm px-3 py-2 rounded-md ring-1 ring-white/10 focus:outline-none focus:ring-white/30 placeholder:text-neutral-500"
              />
              {errors.username && (
                <p className="text-red-400 text-xs">{errors.username.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white text-sm font-medium">Password</label>
              <input
                {...register('password')}
                type="password"
                className="bg-[#2a2b2d] text-white text-sm px-3 py-2 rounded-md ring-1 ring-white/10 focus:outline-none focus:ring-white/30 placeholder:text-neutral-500"
              />
              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-xs -mt-1">Invalid username or password</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3a3b3c] hover:bg-[#4a4b4c] text-white font-semibold py-2 rounded-md text-sm cursor-pointer transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>

            <Link
              to="/signup"
              className="text-center bg-[#2a2b2d] hover:bg-[#3a3b3c] text-white font-semibold py-2 rounded-md text-sm transition-colors"
            >
              Sign up
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-neutral-500 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button onClick={guestLogIn}
              type="button"
              className="bg-[#3a3b3c] hover:bg-[#4a4b4c] text-white font-semibold py-2 rounded-md text-sm cursor-pointer transition-colors"
            >
              Log in as a guest
            </button>
          </form>
        </div>
      </div>

      {/* footer */}
      <footer className="text-center text-neutral-500 text-sm py-6">
        © 2026 Hidden Hut. All right reserved.
      </footer>
    </div>
  )
}