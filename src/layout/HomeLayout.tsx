import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { jwtDecode, JwtPayload } from "jwt-decode"

import Footer from "../components/UI/Footer"
import Header from "../components/UI/Header"
const HomeLayout = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          localStorage.removeItem('token'); // Opcional: remover token
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <div >
        <Header/>
        <div className="p-10">
          <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default HomeLayout