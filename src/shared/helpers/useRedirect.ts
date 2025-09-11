import { useNavigate } from 'react-router-dom';

export const useRedirect = () => {
  
  const navigate = useNavigate();

  const redirectTo = ( url: string ) => {
    navigate( url );
  };

  return { redirectTo };
};
