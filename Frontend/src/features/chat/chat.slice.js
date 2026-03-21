import {createSlice} from '@reduxjs/toolkit'

const chatSlice=createSlice({
    name:"chat",
    initialState:{
            chats:{},
            currentChatId:null,
            isLoading:false,
            error:null,
    },
    reducers:{
        createNewchat:(state,action)=>{
            const {chatId,title}=action.payload
            state.chats[chatId]={
                id:chatId,
                title,
                messages:[],
                lastUpdated:new Date().toISOString(),
            }
            state.currentChatId=chatId
        },
        addNewMessage:(state,action)=>{
            const {chatId,content,role}=action.payload
            if(!state.chats[chatId]){
                state.chats[chatId] = {
                    id: chatId,
                    title: 'Untitled',
                    messages: [],
                    lastUpdated: new Date().toISOString()
                }
            }
            state.chats[chatId].messages.push({content,role})
        },
        updateLastMessage:(state,action)=>{
            const {chatId,content,role} = action.payload
            const chat = state.chats[chatId]
            if(!chat || !chat.messages.length) return
            const lastIndex = chat.messages.length - 1
            chat.messages[lastIndex] = {content,role}
        },
        addMessages:(state,action)=>{
            const {chatId,messages}=action.payload
            state.chats[chatId].messages.push(...messages)
        },
        removeChat:(state,action)=>{
            const {chatId} = action.payload
            if(state.chats[chatId]){
                delete state.chats[chatId]
            }
            if(state.currentChatId === chatId){
                state.currentChatId = null
            }
        },
        setChats:(state,action)=>{
            state.chats=action.payload
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId=action.payload
        },
        setLoading:(state,action)=>{
            state.isLoading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        }
    }
})


export const {setCurrentChatId,setChats,setLoading,setError,createNewchat,addNewMessage,updateLastMessage,addMessages,removeChat}=chatSlice.actions
export default chatSlice.reducer