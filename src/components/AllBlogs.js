import { useState,useEffect } from "react"
import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "../config/axios"
export default function AllBlogs(){
    const navigate=useNavigate()
    const [blogs,setBlogs]=useState([])
    const [comment,setComment]=useState(null)
    const [click,setClick]=useState(false)
    const [edit,setEdit]=useState(false)
    const [id,setId]=useState('')

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

    const handleToggle=(id)=>{
     setClick(!click)
     setId(id)
    }
    
    const handleSubmit=(e)=>{
        e.preventDefault()
    }

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
                <button onClick={()=>{handleToggle(ele._id)}}>{click ? 'Cancel':'Comment'}</button>
                </>
            )
            })
        }
        {
            click && <form onSubmit={handleSubmit}>
                <textarea
                onChange={e=>{setComment(e.target.value)}}>

                </textarea>
                

                
            </form>
            
        }
        </div>
    )
}