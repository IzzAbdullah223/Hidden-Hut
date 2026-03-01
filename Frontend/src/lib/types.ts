import {z} from 'zod'


export const signUpSchema = z.object({
    fName: z.string().min(1,'First name should not be empty'),
    lName: z.string().min(1,'Last name should not be empty '),
    username: z.string().min(1,'Username should not be empty'),
    password: z.string().min(5,'Password should be atleast 5 characters'),
    confirmPassword: z.string().min(5,'Password should be at least 5 characters')
}).refine(data=>data.password===data.confirmPassword,{
    message:"Password must match",
    path: ["confirmPassword"]
})

export const logInSchema = z.object({
    username: z.string().min(1,'Username should not be empty'),
    password: z.string().min(5,"Password should be atleast 5 characters")
})


export type TSignUpSchema = z.infer<typeof signUpSchema>


export type TLogInSchema = z.infer<typeof logInSchema>

export type TLogInResponse={
    token:string,
    currentUserId:number
}

export type Messages={
    id:number
    content:string
    date:string
    senderId:number,
    imageUrl:string
    sender:{
        firstName:string,
        lastName:string,
        pictureURL:string,
    }
}

export type User={
    id:number
    firstName:string,
    lastName:string,
    username:string,
    pictureURL:string,
}

 