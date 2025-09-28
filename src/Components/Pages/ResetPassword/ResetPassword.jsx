import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import Button from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import Logo from '@/Components/ui/Logo';
import authService from '@/appwrite/auth';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get URL parameters - Appwrite uses userId and secret
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');
  
  // Form states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  
  // UI states
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [invalidLink, setInvalidLink] = useState(false);
  
  // Check if we have required parameters
  useEffect(() => {
    if (!userId || !secret) {
      setInvalidLink(true);
    }
  }, [userId, secret]);
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    if (newPassword.length < 8) {
      setErrors({ new: 'Password must be at least 8 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirm: 'Passwords do not match' });
      return;
    }
    
    setIsResetting(true);
    try {
      await authService.completePasswordRecovery(userId, secret, newPassword, confirmPassword);
      setResetSuccess(true);
      
      // Redirect to login after success
      setTimeout(() => {
        navigate('/', { 
          state: { message: 'Password reset successful! Please log in with your new password.' }
        });
      }, 3000);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to reset password' });
    } finally {
      setIsResetting(false);
    }
  };
  
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  if (invalidLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-purple-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-red-200 dark:border-red-800 rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-red-600 dark:text-red-300 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-purple-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-green-200 dark:border-green-800 rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
              Password Reset Successful!
            </h1>
            <p className="text-green-600 dark:text-green-300 mb-6">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <Logo size="lg" className="mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
            <p className="text-blue-100">Enter your new password</p>
          </div>
          
          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.new && (
                  <p className="text-sm text-red-500 mt-1">{errors.new}</p>
                )}
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirm && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>
                )}
              </div>
              
              {errors.submit && (
                <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <X className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700 dark:text-red-400">
                    {errors.submit}
                  </span>
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isResetting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isResetting ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
