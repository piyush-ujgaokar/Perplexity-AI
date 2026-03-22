import axios from 'axios'


const api=axios.create({
    baseURL:"https://perplexity-ai-1-umbd.onrender.com",
    withCredentials:true
})


export async function sendMessage({message,chatId}){
        const response=await api.post('/api/chats/message',{message,chat:chatId})
        return response.data

}

export async function getChats(){
    const response=await api.get('/api/chats/')
    return response.data
}

export async function getMessages({chatId}){
    const response=await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export async function deleteMessage({chatId}){
    const response=await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}