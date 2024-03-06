import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    userlist:[],
    currentUser:'',
    selectGdata:[],
}

const ChatSlice = createSlice({
    name:'ChatSlice',
    initialState,
    reducers:{
        adduserList:(state,action)=>{
            console.log(action.payload);
            state.userlist=action.payload
        },
        addCurrentUser:(state,action)=>{
            state.currentUser = action.payload
        },
        addselectGdata:(state,action)=>{
            state.selectGdata= action.payload
        }
    }
});

export const  {adduserList,addCurrentUser,addselectGdata} = ChatSlice.actions;
export default ChatSlice.reducer;