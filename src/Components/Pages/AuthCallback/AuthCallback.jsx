import { useEffect } from 'react';
import authService from '../../../appwrite/auth';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';

function AuthCallback() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');
        
        if (!userId || !secret) {
          throw new Error('Missing OAuth parameters');
        }

        // Create session manually
        await authService.handleOAuthCallback(userId, secret);
        
        // Set default preferences for new users
        const defaultPrefs = {
          pro_uses: 5,
          basic_uses: 10,
          ultra_uses: 3
        };
        
        // updatePreferences will merge defaults with existing prefs, only setting defaults for missing keys
        await authService.updatePreferences(defaultPrefs);
        
        // Get updated user data with preferences
        const updatedUser = await authService.getCurrentUser();
        
        // Update Redux
        dispatch(login({ userData: updatedUser }));
        
        // Redirect to home
        window.location.href = '/home';
      } catch (error) {
        console.error('Auth callback error:', error);
        window.location.href = '/';
      }
    };

    handleCallback();
  }, [dispatch]);

  return <div>Completing authentication...</div>;
}

export default AuthCallback;