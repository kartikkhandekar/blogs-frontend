import { useEffect } from 'react';
import axios from './config/axios';
import { useAuth } from './auth/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link,Routes,Route} from 'react-router-dom'
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import AddBlogs from './components/AddBlogs';
import PrivateRoute from './components/PrivateRoute';
import AllBlogs from './components/AllBlogs';
import MyBlogs from './components/Myblogs';
import SinglePost from './components/SinglePost';
function App() {
  
  const {user,dispatch}=useAuth()

  useEffect(() => {
    if(localStorage.getItem('token'))  {
      
      (async () => {

        const response = await axios.get('api/users/profile', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        console.log(response.data)
        dispatch({ type: 'LOGIN', payload: { account: response.data } })
      })();
    }
  }, [])


  const registerIn=()=>{
    toast("successfully Registered !!")
     }

   const loggedIn=()=>{
      toast("successfully logged !!")
       }
  return (
    <div >
      <h1>Blogs App</h1>
      <Link to='/'>Home</Link>|
      <Link to='/allblogs'>AllBlogs</Link>|
      {
        user.isLoggedIn ? (
          <>
          <Link to='/addblogs'>AddBlogs</Link> | 
          <Link to='/myblogs'>MyBlogs</Link> |
          <Link to='/' onClick={()=>{
            localStorage.removeItem('token')
            dispatch({type:'LOGOUT'})
            }}>Logout</Link>
          </>
        ):(
          <>
            <Link to='/register'>Register</Link>|
            <Link to='/login'>Login</Link> 
          </>
        )
      }

      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/register' element={<Register registerIn={registerIn}/>}/>
        <Route path='/login' element={<Login loggedIn={loggedIn}/>}/>
        <Route path='/allblogs' element={ <AllBlogs/>}/>
        <Route path='/addblogs' element={
        <PrivateRoute>
          <AddBlogs/>
        </PrivateRoute>} />
        <Route path='/myblogs' element={
          <PrivateRoute><MyBlogs/></PrivateRoute>
        }/>
        <Route path='/singlepost/:postId' element={
          <PrivateRoute>
            <SinglePost/>
          </PrivateRoute>
        }/>
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
