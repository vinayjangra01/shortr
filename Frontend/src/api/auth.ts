import { config } from '@/config/config'
import type { ApiResult, LoginParams, LoginResponse, RegisterParams, RegisterResponse } from '@/types';
import axios from 'axios'

export const register = async ({email, password, name}: RegisterParams) : Promise<ApiResult<RegisterResponse['data']>> => {
    try{
        const res = await axios.post<RegisterResponse>(`${config.BASE_URL}/api/auth/register`, {
            email: email, 
            password: password,
            name: name
        }) 

        return {
            success: res.data.success,
            message: res.data.message,
            data: res.data.success ? res.data.data : undefined,
        };
    }
    catch(error: any)
    {
       return {
            success: false,
            message: error.response?.data?.message || "Something went wrong",
        };
    }
}


export const login = async ({email, password}: LoginParams) : Promise<ApiResult<LoginResponse['data']>> => {
    try{
        const res = await axios.post<LoginResponse>(`${config.BASE_URL}/api/auth/login`, {
            email: email, 
            password: password,
        }) 

        return {
            success: res.data.success,
            message: res.data.message,
            data: res.data.success ? res.data.data : undefined
        }
    }
    catch(error: any)
    {
        return {
            success: false,
            message: error.response?.data?.message || "Something went wrong"
        }
    }
}