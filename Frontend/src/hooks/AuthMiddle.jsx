import axios from 'axios';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const checkAuth = async () => {
      const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwtaccess='));
      if (!jwtCookie) {
        try {
          // Make Axios GET request to refresh token endpoint
          let res = await axios.get('/api/auth/refresh');
          // If the new token is not present, navigate to /login
          if (res.data.accessToken !== 'success') {
            navigate('/login',{replace:true});
          }
        } catch (error) {
          console.error('Error during token refresh:', error);
          navigate('/login',{replace:true});
        }
      }
    };

    // Invoke the checkAuth function
    checkAuth();


  }, [navigate]);

  // You can return an outlet component or anything else based on your requirements
  return <Outlet />;
};

export default useAuth;
