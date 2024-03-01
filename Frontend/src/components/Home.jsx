import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'

export default function Home() {

    useEffect(() => {
        const fetchusers = async () => {
          let res = await axios.get('/api/userslist');
          console.log(res);
        }
        fetchusers();
      },[]);
    

  return (
    <>
     <h1>home</h1>   
    </>
  )
}
