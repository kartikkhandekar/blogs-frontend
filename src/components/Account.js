import { useState,useEffect } from "react"
import axios from "../config/axios"
export default function Account(){
    const [account,setAccount]=useState([])
    useEffect(()=>{
       const fetch=async()=>{
          const response=await axios.get('api/users/profile',{
            headers:{
                Authorization:localStorage.getItem('token')
            }
          })
          console.log(response.data)
          setAccount(response.data)
       }
       fetch()
    },[])
    return (
        <div>
            <h3>Account</h3>
           
           {
            account &&
            <>
            <img src={`http://localhost:5555/${account.profilePicture}`}
            alt="profilePic"
            style={{width:'30px',height:'30px',objectFit:'cover' }}/><b >{account.username}</b>
            <h6>{account.email}</h6>
            </>
           }

        </div>
    )
}