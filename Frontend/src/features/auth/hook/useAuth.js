import {useDispatch} from 'react-redux'
import { register,login,getMe } from '../service/auth.api'
import { setUser,setError,setLoading } from '../auth.slice'




export function useAuth(){
    const dispatch=useDispatch()

    async function handleRegister({username,email,password}){
        try{
            
            dispatch(setLoading(true))

            const data=await register({username,email,password})
            // registration does not log the user in; ask user to verify email
            // do not set `user` here to avoid treating unverified users as authenticated
        }catch(error){
            dispatch(setError(error.response?.data?.message || "Registration Failed"))
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email,password}){
        try {

            dispatch(setLoading(true))
            const data=await login({email,password})
            // save token (if provided) so we can use Authorization header as fallback
            if(data.token){
                localStorage.setItem('token', data.token)
            }
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login Failed"))
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe(){
        try {
            dispatch(setLoading(true))
            const data=await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user"))
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }

}






