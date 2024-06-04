import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../config/axios"
export default function AllBlogs(){
    const navigate=useNavigate()
    const [blogs,setBlogs]=useState([])

    useEffect(()=>{
       const fun=async()=>{
       try {
            const response=await axios.get('/api/posts' )
            console.log(response.data)
            setBlogs(response.data)
       }catch(err){
          console.log(Error)
       }
     }
       fun()
    },[])

 
    
   

    return (
        <div>
            <h1>All Blogs</h1>
            {
            blogs && 
            blogs.map((ele,i)=>{
                return (<>
                <h4 key={ele._id}> {ele.title}</h4>
                <p >{ele.content}</p>
                <button onClick={()=>{navigate(`/singlepost/${ele._id}`)}}>View</button>
                </>
            )
            })
        }
        </div>
    )
}