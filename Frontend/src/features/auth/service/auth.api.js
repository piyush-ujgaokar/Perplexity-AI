import axios from "axios";




const api=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})


export async function register({username,email,password}){
    const response=await axios.post('/api/auth/register',{username,email,password})
    return response.data
}

export async function login({email,password}){
   const response=await axios.post('/api/auth/login',{email,password})
   return response.data
}

export async function getMe(){
        const response=await axios.get('/api/auth/get-me')
        return response.data
}