import {z} from 'zod'


export const signUpSchema = z.object({
    fName: z.string().min(1,'First name should not be empty'),
    lName: z.string().min(1,'Last name should not be empty '),
    email:z.string().email("Please enter a valid email"),
    password: z.string().min(5,'Password should be atleast 5 characters'),
    confirmPassword: z.string().min(5,'Password should be at least 5 characters')
}).refine(data=>data.password===data.confirmPassword,{
    message:"Password must match",
    path: ["confirmPassword"]
})


export type TSignUpSchema = z.infer<typeof signUpSchema>



export const logInSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(5,"Password should be atleast 5 characters")
})

export type TLogInSchema = z.infer<typeof logInSchema>

export type TLogInResponse={
    token:string
}

export type HeaderProps ={
    name:string
}