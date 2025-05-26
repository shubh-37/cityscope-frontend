import { authContext } from '@/context/AuthContextProvider';
import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function RequiresAuth({ children }) {
  const { authenticateUser } = useContext(authContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function authenticate() {
      const response = await authenticateUser();
      if (response === 'failure') {
        localStorage.removeItem('token');
        toast.error('Session expired, please login again.');
        setIsAuthenticated(false);
      } else if (response === 'success') {
        setIsAuthenticated(true);
      }
      setIsLoading(false); // Mark loading as complete
    }
    authenticate();
  }, []);

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
