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
            state.chats[chatId].message.push({content,role})
        },
        addMessages:(state,action)=>{
            const {chatId,messages}=action.payload
            state.chats[chatId].messages.push(...messages)
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


export const {setCurrentChatId,setChats,setLoading,setError,createNewchat,addNewMessage,addMessages}=chatSlice.actions
export default chatSlice.reducer