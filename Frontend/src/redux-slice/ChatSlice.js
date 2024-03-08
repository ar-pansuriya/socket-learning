import { __DO_NOT_USE__ActionTypes, createSlice } from "@reduxjs/toolkit";

const initialState = {
    userlist: [],
    currentUser: '',
    selectGdata: [],
    curretnG: [],
    groupData: [],
    oneGMessage:'',
}

const ChatSlice = createSlice({
    name: 'ChatSlice',
    initialState,
    reducers: {
        adduserList: (state, action) => {
            console.log(action.payload);
            state.userlist = action.payload
        },
        addCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        addselectGdata: (state, action) => {
            state.selectGdata = action.payload
        },
        addcurretnG: (state, action) => {
            state.curretnG = action.payload
        },
        addgroupData: (state, action) => {
            console.log(action.payload);
            state.groupData = action.payload
        },
        addOneGmessage:(state,action)=>{
            state.oneGMessage = action.payload
        }
    }
});

export const { adduserList, addCurrentUser, addselectGdata, addcurretnG, addgroupData,addpreviousGroup,addOneGmessage } = ChatSlice.actions;
export default ChatSlice.reducer;