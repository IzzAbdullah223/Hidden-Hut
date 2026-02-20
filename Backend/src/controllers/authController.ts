import {type Request, type Response, type NextFunction} from 'express'
import { signUpSchema } from '../libs/types.js'
import * as db from '../db/queries.js'
import bcrypt from 'bcryptjs'
import jwt,{type JwtPayload, type Secret} from 'jsonwebtoken'

declare global{
        namespace Express{
                interface Request{
                        token?: string | undefined,
                }
        }
}


interface TokenPayload {
    user: {
        id: number
        email: string,
        fName:string,
        lname:string
    }
}


export async function signUpPost(req:Request,res:Response){
    const body: unknown = req.body
    const result = signUpSchema.safeParse(body);
    let zodErrors = {};
 

    if(!result.success){
        result.error.issues.forEach((issue)=>{
            zodErrors = {...zodErrors, [issue.path[0] as string]:issue.message}
        })
        return res.status(400).json({errors:zodErrors})
    }

    const exisitngUser = await db.findUserByEmail(result.data.email)

    if(exisitngUser){
        res.status(400).json({errors:{email:"Email already exists"}})
    }

    const hashedPassword = await bcrypt.hash(result.data.password,10)
    await db.signUp(result.data.email,result.data.fName,result.data.lName,hashedPassword)
    return res.status(200).json({success:true})
}




export async function logInPost(req:Request,res:Response){
        const user=req.user
        jwt.sign({user:user},process.env.SECRET_KEY as Secret,{expiresIn: '24h'},(err: Error | null, token: string | undefined)=>{
          res.json({
                token:token,
                currentUserId:user?.id
          })
        })

}

export function verifyToken(req: Request, res: Response, next: NextFunction){
    const bearerHeader = req.headers['authorization']
    
    if(typeof(bearerHeader) !== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        
        if(!bearerToken){
            return res.status(403).json({error: "Invalid token format"})
        }
        
        jwt.verify(bearerToken, process.env.SECRET_KEY as Secret, (err: Error | null, 	authData: string | JwtPayload | undefined) => {
            if(err){
                return res.status(403).json({error: "Invalid or expired token"})
            }
            
            const payload = authData as TokenPayload
            req.token = bearerToken    
            req.user = payload.user
            next()
        })
    }
    else{
        res.status(403).json({error: "No token provided"})
    }
}

