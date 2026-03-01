import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/libs/prisma.js';

declare global{  
    namespace Express{
        interface User{  
            id:number
            username:string
        }
    }
}

passport.use(
    new LocalStrategy( async(username,password,done)=>{
        //usernamefield is usually not needed but since our db has email instead of username we have 
        try{
            const user = await prisma.user.findUnique({
                where:{username:username}
            });

            if(!user){
                console.log("No user found");
                return done(null,false,{message:"Incorrect Email"});
            }

            const match = await bcrypt.compare(password,user.password);
            if(!match){
                console.log("Password incorrect");
                return done(null,false,{message:"Incorrect password"})
            }
            console.log("Authentication success");
            return done(null,user)
        }
        catch(err){
            console.log("Strategy error:", err);
            return done(err);
        }
    })
)

