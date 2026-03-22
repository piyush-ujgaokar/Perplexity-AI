import axios from "axios";


const api=axios.create({
    baseURL:"https://perplexity-ai-1-umbd.onrender.com",
    withCredentials:true
})


export async function register({username,email,password}){
    const response=await api.post('/api/auth/register',{username,email,password})
    return response.data
}

export async function login({email,password}){
   const response=await api.post('/api/auth/login',{email,password})
   return response.data
}

export async function getMe(){
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.get('/api/auth/get-me', { headers })
    return response.data
}