import { initializeSocketConnection } from "../service/chat.socket"
import { sendMessage,getChats,getMessages,deleteMessage} from "../service/chat.api"
import { setChats,setCurrentChatId,setLoading,setError,createNewchat,addNewMessage,updateLastMessage,addMessages} from "../chat.slice"
import { useDispatch } from "react-redux"

export const useChat=()=>{

    const dispatch=useDispatch()

   async function handleSendMessage({message,chatId}){
            dispatch(setLoading(true))
            // Optimistic update for existing chats: show user message and AI placeholder immediately
            if(chatId){
                dispatch(addNewMessage({
                    chatId,
                    content:message,
                    role:"user"
                }))
                dispatch(addNewMessage({
                    chatId,
                    content:"Thinking...",
                    role:"ai"
                }))
                // send to backend and replace placeholder when response arrives
                const data=await sendMessage({message,chatId})
                const {aiMessage}=data
                dispatch(updateLastMessage({
                    chatId,
                    content:aiMessage.content,
                    role:aiMessage.role
                }))
                dispatch(setCurrentChatId(chatId))
                dispatch(setLoading(false))
            }else{
                // for new chats, keep existing flow (wait for backend to create chat)
                const data=await sendMessage({message,chatId})
                const {chat,aiMessage}=data
                if(!chatId)
                dispatch(createNewchat({
                    chatId:chat._id,
                    title:chat.title
                }))
                dispatch(addNewMessage({
                    chatId:chatId ||chat._id,
                    content:message,
                    role:"user"
                }))
                dispatch(addNewMessage({
                    chatId:chatId || chat._id,
                    content:aiMessage.content,
                    role:aiMessage.role
                }))
                dispatch(setCurrentChatId(chat._id))
                dispatch(setLoading(false))
            }
    }

    async function handleGetChats(){
        dispatch(setLoading(true))
        const data=await getChats()
        const {chats}=data
        dispatch(setChats(chats.reduce((acc,chat)=>{
            acc[chat._id]={
                id:chat._id,
                title:chat.title,
                messages:[],
                lastUpdated:chat.updatedAt,
            }
            return acc 
        },{})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId,chats){

        if(chats[chatId]?.messages.length===0){

        const data=await getMessages({chatId})
        const {messages}=data

        const formattedMessages=messages.map(msg=>({
            content:msg.content,
            role:msg.role
        }))
        dispatch(addMessages({
            chatId,
            messages:formattedMessages
        }))
    }
        dispatch(setCurrentChatId(chatId))
    }

    function handleCreateChat(){
        // Clear current selection so the main/new chat screen is shown
        dispatch(setCurrentChatId(null))
    }




    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleCreateChat,
    }
}