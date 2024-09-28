import { useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode, type JwtPayload } from 'jwt-decode';




const HelperRedirect = () => {
    const navigate = useNavigate();

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
            }else {
              navigate('/home')
            }
          } catch (error) {
            navigate('/login');
          }
        }
      }, [navigate]);
  return (
    <div>loading...</div>
  )
}

export default HelperRedirect