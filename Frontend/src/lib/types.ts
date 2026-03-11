import {z} from 'zod'


export const signUpSchema = z.object({
    fName: z.string().trim().min(1,'First name should not be empty'),
    lName: z.string().trim().min(1,'Last name should not be empty '),
    username: z.string().trim().min(1,'Username should not be empty'),
    password: z.string().trim().min(5,'Password should be atleast 5 characters'),
    confirmPassword: z.string().trim().min(5,'Password should be at least 5 characters')
}).refine(data=>data.password===data.confirmPassword,{
    message:"Password must match",
    path: ["confirmPassword"]
})

export const logInSchema = z.object({
    username: z.string().min(1,'Username should not be empty'),
    password: z.string().min(5,"Password should be atleast 5 characters")
})

export const editProfileSchema = z.object({
    fName: z.string().trim().min(1,'First name must not be  empty'),
    lName: z.string().trim().min(1,'Last name must not be empty'),
    username:z.string().trim().min(1,'User name must not be empty'),
    bio:z.string().optional()
})

export const changePasswordSchema = z.object({
    password:z.string().trim().min(5,'Password should be at least 5 characters'),
    newPassword:z.string().trim().min(5,'New password should be at least 5 characters'),
    confirmPassword:z.string().trim().min(5,'New password should be at least 5 characters')
}).refine(data=>data.newPassword===data.confirmPassword,{
    message:"Password must match",
    path: ['confirmPassword']
})

export const createGroupSchema = z.object({
    groupName:z.string().trim().min(3,'Group name should be at least 3 characters'),
 
})

 

export type TSignUpSchema = z.infer<typeof signUpSchema>

export type TcreateGroupSchema = z.infer<typeof createGroupSchema>

export type TLogInSchema = z.infer<typeof logInSchema>

export type TeditProfileSchema = z.infer<typeof editProfileSchema>

export type TchangePasswordSchema = z.infer<typeof changePasswordSchema>




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
    profileBanner:string,
    bio:string
    friends:User[]
}

export type Groups={
    id:number,
    name: string,
    pictureUrl: string,
    users: User[]
}

export type Group={
    groups: Groups[]
    count:number
}

 