import { useDispatch } from 'react-redux';
import { setRefreshUserDataStart } from '@/app/redux/reducers/auth/signUpReducer';

/**
 * Custom hook to refresh user data from the server
 * This ensures the Redux state always has the latest user information
 * 
 * @returns {Function} refreshUserData - Function to trigger user data refresh
 */
export const useRefreshUserData = () => {
  const dispatch = useDispatch();

  const refreshUserData = () => {
    dispatch(setRefreshUserDataStart());
  };

  return { refreshUserData };
};

export default useRefreshUserData;
