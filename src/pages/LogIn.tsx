import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from '../components/LogInComponents/Form'

export const LogIn = () => {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Task 4 | Log In'
  },[])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      navigate('/home')
    }
  },[])

  return (
    <div className=' text-white flex flex-col items-center gap-10 px-10 py-20'>
        <h1 className=' text-4xl font-bold text-cyan-500 cursor-default'>Task 4</h1>
        <Form/>
    </div>
  )
}
