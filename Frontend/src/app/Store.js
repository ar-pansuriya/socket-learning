import { configureStore } from '@reduxjs/toolkit'
import ChatReducer from '../redux-slice/ChatSlice'
export const store = configureStore({
    reducer: {
        Chats: ChatReducer
    }
});
