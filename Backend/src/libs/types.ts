import {z} from 'zod'


export const signUpSchema = z.object({
    fName: z.string().trim().min(1,'First name should not be empty'),
    lName: z.string().trim().min(1,'Last name should not be empty '),
    username:z.string().trim().min(1,'username should not be empty'),
    password: z.string().trim().min(5,'Password should be atleast 5 characters'),
    confirmPassword: z.string().min(5,'Password should be at least 5 characters')
}).refine(data=>data.password===data.confirmPassword,{
    message:"Password must match",
    path: ["confirmPassword"]
})

export const editProfileSchema = z.object({
    fName: z.string().trim().min(1,'First name must not be  empty'),
    lName: z.string().trim().min(1,'Last name must not be empty'),
    username:z.string().trim().min(1,'User name must not be empty'),
    bio:z.string().optional()
})



export type TSignUpSchema = z.infer<typeof signUpSchema>
