import {useState,useEffect} from 'react'
import axios from '../config/axios'
import { useParams } from "react-router-dom"
export default function SinglePost(){
    const {postId}=useParams()
    const [blogs,setBlogs]=useState(null)
    const [title,setTitle]=useState('')
    const [content,setContent]=useState('')
    const [errors,setErrors]=useState(null)
    const [commentEr,setCommentEr]=useState(null)
    const [postServerErrors,setPostServerErrors]=useState(null)
    const [postClientErrors,setPostClientErrors]=useState({})
    const [edit,setEdit]=useState(false)
    const [comment,setComment]=useState('')
    const [commentCreate,setCommentCreate]=useState(false)
    const [commentEdit,setCommentEdit]=useState(false)
    const [commentServerErrors,setCommentServerErrors]=useState(null)
    const [commentClientErrors,setCommentClientErrors]=useState({})
    const [myComments,setMyComments]=useState([])
    const [commentId,setCommentId]=useState(null)


    useEffect(()=>{
      const fun=async()=>{
        try{
        const response =await axios.get(`/api/posts/${postId}`)
        console.log(response.data)
        setBlogs(response.data)
        setErrors(null)
      }catch(err){
         setErrors('Somthing went wrong')
         setBlogs(null)
      }
      }
      fun()
    },[])


    useEffect(()=>{
      const fun=async()=>{
        try{
            const response =await axios.get(`/api/posts/${postId}/comments`)
            console.log(response.data)
            setMyComments(response.data)
            setCommentEr(null)
          }catch(err){
             setCommentEr('Somthing went wrong')
          }
      }
      fun()
    },[])
    

    const postError={}

    const runValidations = () => {
        
        if(title.trim().length === 0) {
            postError.title = 'title is required'
        }

        if(content.trim().length === 0) {
            postError.content = 'content is required'
        }
    }

    const commentErrors={}

    const commentValidation=()=>{
    if(comment.trim().length===0){
        commentErrors.comment='commentis required'
    }
   }


    const handleSubmit1 = async (e) => {
        e.preventDefault()
        const formData = {
            title:title,
            content:content,
            
        }
        
        runValidations()

        if(Object.keys(postError).length === 0) {
            try {
                const response = await axios.put(`/api/posts/${postId}`, formData,
                {
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                }
                ) 
                console.log(response.data)
                
                setBlogs(response.data)
            } catch(err) {
                console.log(err.response.data)
                setPostServerErrors(err.response.data)
            }
        } else {
            setPostClientErrors(postError)
        }
    }
   

    const handleSubmit2=async(e)=>{
        e.preventDefault()
        
        commentValidation()
  
        if(Object.keys(commentErrors).length === 0) {
          try {
              const response = await axios.post(`/api/posts/${postId}/comments`,{content:comment},
              {
                  headers:{
                      Authorization:localStorage.getItem('token')
                  }
              }
              ) 
              console.log(response.data)

              const res =await axios.get(`/api/posts/${postId}/comments`)

              console.log(res.data)
              setMyComments(res.data)
              setComment('')
    
          } catch(err) {
              console.log(err.response.data)
              setCommentServerErrors(err.response.data)
          }
      } else {
          console.log(commentErrors)
          setCommentClientErrors(commentErrors)
      }
  
     }

     const handleSubmit3=async(e)=>{
        e.preventDefault()
        
        commentValidation()
  
        if(Object.keys(commentErrors).length === 0) {
          try {
              const response = await axios.put(`/api/posts/${postId}/comments/${commentId}`,{content:comment},
              {
                  headers:{
                      Authorization:localStorage.getItem('token')
                  }
              }
              ) 
              
              console.log(response.data)
              
             const newArr= myComments.map(ele=>{
                if(ele._id==commentId){
                    return response.data
                }else{
                    return ele
                }
              })
              setMyComments(newArr)
    
          } catch(err) {
              console.log(err.response.data)
              setCommentServerErrors(err.response.data)
          }
      } else {
          console.log(commentErrors)
          setCommentClientErrors(commentErrors)
      }
  
     }
   

     const handleRemove=async(id)=>{
       
        const response=await axios.delete(`/api/posts/${postId}/comments/${id}`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })

    
        const newArr=myComments.filter(ele=>{
            return ele._id !== id
        })
        setMyComments(newArr)
     }

   const handleToggle1=()=>{
       setEdit(!edit)
   }

   const handleToggle2=()=>{
    setCommentCreate(!commentCreate)
   }

   const handleToggle3=(id)=>{
    setCommentEdit(!commentEdit)
    setCommentId(id)
   }
   

   const displayPostErrors = () => {
    let result 
    if(typeof postServerErrors == 'string') {
        result = <p> { postServerErrors } </p>
    } else {
        result = (
            <div>
                <h3>Theses errors prohibitted the form from being saved: </h3>
                <ul>
                    { postServerErrors.map((ele, i) => {
                        return <li key={i}> { ele.msg } </li>
                    })}
                </ul>
            </div>
        )
    }
    return result 
}

const displayCommentErrors = () => {
    let result 
    if(typeof commentServerErrors == 'string') {
        result = <p> { commentServerErrors } </p>
    } else if(Array.isArray(commentServerErrors)){
        result = (
            <div>
                <h3>Theses errors prohibitted the form from being saved: </h3>
                <ul>
                    { commentServerErrors.map((ele, i) => {
                        return <li key={i}> { ele.msg } </li>
                    })}
                </ul>
            </div>
        )
    }else{
        result=<p> { commentServerErrors.msg } </p>
    }
    return result 
}

   
    return (
        <div>
              {
                blogs &&
                <div>
                <h4>{blogs.title}</h4>
                <p>{blogs.content}</p>
                <button onClick={handleToggle1}>{ edit ? 'Cancel' : 'Update' }</button>
                <button onClick={handleToggle2}>{ commentCreate ? 'Cancel' : 'Comment' }</button>

                </div>
              }

               {
                edit &&  <form onSubmit={handleSubmit1}>
                <label htmlFor="title">Enter title</label><br />
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e=>{setTitle(e.target.value)}} 
                        id="title"
                    /> 
                    { postClientErrors.title && <span> { postClientErrors.title }</span>}
            
                    <br />
    
                    <label htmlFor="content">Enter content</label><br />
                    <input 
                        type="text" 
                        value={content} 
                        onChange={e=>{setContent(e.target.value)}} 
                        id="content"
                        disabled={!edit}
                    /> 
                    { postClientErrors.content && <span> { postClientErrors.content }</span>}
            
                    <br />
                    <input type="submit"/>
                </form>
            }
        
        {
            commentCreate && 
            <form onSubmit={handleSubmit2}>
                <br/>
                <textarea 
                        type="text" 
                        value={comment} 
                        onChange={e=>{setComment(e.target.value)}} 
                        disabled={!commentCreate}
                > 
                </textarea>
                { commentClientErrors.comment && <span> { commentClientErrors.comment }</span>}
                <br/>
                <input type='submit'/>

            </form>
        }

        {
            commentEdit && 
            <form onSubmit={handleSubmit3}>
                <br/>
                <textarea 
                        type="text" 
                        value={comment} 
                        onChange={e=>{setComment(e.target.value)}} 
                        disabled={!commentEdit}
                > 
                </textarea>
                { commentClientErrors.comment && <span> { commentClientErrors.comment }</span>}
                <br/>
                <input type='submit'/>

            </form>
        }


        {
            myComments && 
            <ul>
                <br/>
                {
                    myComments.map((ele)=>{
                        return <li key={ele._id}>{ele.content}<button onClick={()=>{handleToggle3(ele._id)}}>{ commentEdit ? 'Cancel' : 'Edit' }</button>
                        <button onClick={()=>{handleRemove(ele._id)}}>Delete</button></li>
                    })
                }
            </ul>
        }

        {commentEr &&  <h3 style={{color:'red'}}>{commentEr}</h3> }

           {commentServerErrors && displayCommentErrors()}

            { postServerErrors && displayPostErrors() }
      
              {
                errors && 
                <h3 style={{color:'red'}}>{errors}</h3>
              }
        </div>
    )
}