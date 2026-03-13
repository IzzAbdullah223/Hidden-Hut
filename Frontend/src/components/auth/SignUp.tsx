import { signUp } from '../../services/authServices'
import logo from '../../assets/logo.jpg'
import { Link, useNavigate } from "react-router"
import { type TSignUpSchema, signUpSchema } from '../../lib/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { successToast } from '@/lib/toastStyles'

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = async (data: TSignUpSchema) => {
    const responseData = await signUp(data)

    if (responseData.errors) {
      const errors = responseData.errors
      if (errors.fName) setError("fName", { type: "server", message: errors.fName })
      if (errors.lName) setError("lName", { type: "server", message: errors.lName })
      if (errors.username) setError("username", { type: "server", message: errors.username })
      if (errors.password) setError("password", { type: "server", message: errors.password })
      if (errors.confirmPassword) setError("confirmPassword", { type: "server", message: errors.confirmPassword })
    }

    if (responseData.success) {
      successToast('Account created successfully! You can log in now.')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">

      {/* navbar */}
      <nav className="flex items-center px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-8 h-8 rounded-md" />
          <span className="text-white font-bold text-lg">Hidden Hut</span>
        </div>
      </nav>

    
      <div className="flex-1 flex flex-col items-center pt-16 px-4">
        <div className="w-full max-w-2xl mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            Join Hidden Hut.
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-white/80">
            A secretly private, group, and global chat app.
          </p>
        </div>

        {/*card*/}
        <div className="w-full max-w-sm bg-[#1e1f20] rounded-xl ring-1 ring-white/10 p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-white font-semibold text-base">Let's get started!</h2>
              <p className="text-neutral-400 text-sm mt-0.5 max-w-[220px]">
                Sign up to unlock private, group, and global conversations.
              </p>
            </div>
<Link to="/login" className="text-white hover:text-neutral-300 text-sm font-semibold transition-colors shrink-0 mt-0.5">
  Log in
</Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
<div className="flex gap-3">
  <div className="flex flex-col gap-1.5 flex-1 min-w-0">   
    <label className="text-white text-sm font-medium">First name</label>
    <input
      {...register('fName')}
      type="text"
      placeholder="John"
      className="bg-[#2a2b2d] text-white text-sm px-3 py-2 rounded-md ring-1 ring-white/10 focus:outline-none focus:ring-white/30 placeholder:text-neutral-500 w-full"
    />
    {errors.fName && (
      <p className="text-red-400 text-xs">{errors.fName.message}</p>
    )}
  </div>

  <div className="flex flex-col gap-1.5 flex-1 min-w-0"> 
    <label className="text-white text-sm font-medium">Last name</label>
    <input
      {...register('lName')}
      type="text"
      placeholder="Doe"
      className="bg-[#2a2b2d] text-white text-sm px-3 py-2 rounded-md ring-1 ring-white/10 focus:outline-none focus:ring-white/30 placeholder:text-neutral-500 w-full"
    />
    {errors.lName && (
      <p className="text-red-400 text-xs">{errors.lName.message}</p>
    )}
  </div>
</div>

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

            <div className="flex flex-col gap-1.5">
              <label className="text-white text-sm font-medium">Confirm password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="bg-[#2a2b2d] text-white text-sm px-3 py-2 rounded-md ring-1 ring-white/10 focus:outline-none focus:ring-white/30 placeholder:text-neutral-500"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3a3b3c] hover:bg-[#4a4b4c] text-white font-semibold py-2 rounded-md text-sm cursor-pointer transition-colors disabled:opacity-60 mt-1"
            >
              {isSubmitting ? 'Creating account...' : 'Sign up'}
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