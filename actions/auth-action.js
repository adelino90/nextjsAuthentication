'use server'

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signUp(prevState,formData){
    const email = formData.get('email')
    const password = formData.get('password')

    let errors = {}

    if(!email.includes('@')){
        errors.email = 'Please enter a valid email address.';
    }
    if(password.trim().length < 8 || !password ){
        errors.password = 'Password must be at least 8 characters long.';
    }
    if(Object.keys(errors).length > 0){
        return {
            errors,
        }
    }
    const hashPaswword = hashUserPassword(password)
    try{
        const result = createUser(email,hashPaswword);
        createAuthSession(result)
        
    }
    catch (error){
        if(error.code === "SQLITE_CONSTRAINT_UNIQUE"){
            return {errors:{
                    email:'It seems like an account for chosen email exists.'
                }
            }
        }
        throw errors;
    }
    redirect('/training');
    

}
export async function login(prevState,formData){
    const email = formData.get('email')
    const password = formData.get('password')
    const existingUser = getUserByEmail(email)

    if(!existingUser){
        return {errors:{
                        email:'Email not Found.'
                        }
                }   
    }
  
    const verrifiedPassword = verifyPassword(existingUser.password,password)
    
    if(!verrifiedPassword){
        return {errors:{
            password:'Password does not match!'
            }
        }  
    }

    createAuthSession(existingUser.id)
    redirect('/training');

}

export async function auth(mode,prevState,formData){
    if(mode === 'login'){
        return login(prevState,formData);
    }
    return signUp(prevState,formData)
}

export async function logout(){
   await destroySession();
   redirect('/');
}