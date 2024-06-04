import { useState,useEffect } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
export default function MyBlogs(){
    const [myBlogs,setMyBlogs]=useState([])
    const [serverErrors,setServerErrors]=useState(null)
    
    const navigate=useNavigate()
    
    useEffect(()=>{
        const fun=async()=>{
       try {
            const response=await axios.get('/api/posts/myPosts',{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
        console.log(response.data)
        setMyBlogs(response.data)
    }catch(err){
        console.log(err)
       setServerErrors(err.response.data.errors)
    }
 }
 fun()
},[])

const handleRemove=async(id)=>{
    try{ const response=await axios.delete(`/api/posts/${id}`,{
         headers:{
             Authorization:localStorage.getItem('token')
         }
     })
 
     const newArr=myBlogs.filter(ele=>{
         return ele._id!=id
     })
     setMyBlogs(newArr)
 
   }catch(err){
     console.log(err)
   }
 }

    return (
    <div>
        <h1>MyBlogs</h1>
        {
            myBlogs && 
            myBlogs.map((ele,i)=>{
                return (<>
                <h4 key={ele._id}> {ele.title}</h4>
                <p >{ele.content}</p>
                
                <button onClick={()=>{navigate(`/singlepost/${ele._id}`)}}>View</button>
                <button onClick={()=>{handleRemove(ele._id)}}>Delete</button>
                </>
            )
            })
        }
        <ul>
            { serverErrors && serverErrors.map((ele, i) => {
                return <li key={i}> { ele.msg } </li>
            })}
        </ul>
       
    </div>)
}