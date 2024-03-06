import React from 'react'
import { useSelector } from 'react-redux'


export default function GroupChats() {

const selectedGroup = useSelector(state=>state.Chats.selectGdata);
console.log(selectedGroup);
  return (
    <>
     <h1>selectedGroup.name</h1>   
    </>
  )
}
