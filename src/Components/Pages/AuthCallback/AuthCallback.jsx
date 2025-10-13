import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../../../store/authThunks';
import authService from '../../../appwrite/auth';

function AuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setError(null);

        // Extract parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');
        
        if (!userId || !secret) {
          throw new Error('Missing OAuth parameters');
        }

        // Use the auth thunk to handle OAuth callback
        await dispatch(handleOAuthCallback({ userId, secret })).unwrap();
        
        // Set default preferences for new users
        const defaultPrefs = {
          pro_uses: 5,
          basic_uses: 10,
          ultra_uses: 3
        };
        
        // updatePreferences will merge defaults with existing prefs, only setting defaults for missing keys
        await authService.updatePreferences(defaultPrefs);
        
        // Use React Router navigate with replace to avoid history issues
        navigate('/home', { replace: true });
      } catch (error) {
        setError(error.message || 'Authentication failed');
        
        // Wait a moment before redirecting to show error
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
        <div className="text-center p-8">
          <div className="text-red-500 text-xl mb-4">Authentication Failed</div>
          <div className="text-gray-600 dark:text-gray-300 mb-4">{error}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Redirecting to login page...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Completing authentication...
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          Please wait while we set up your account
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;