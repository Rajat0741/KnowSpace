import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react';
import { loadProfilePicture, clearProfilePicture } from '@/store/profileSlice';
import service from '@/appwrite/config';

function ProfilePicture({
  size = 'md',
  className = '',
  showFallback = true,
  onClick = null,
  profilePictureId = null
}) {
  const dispatch = useDispatch();
  const { profilePictureUrl, isLoading, hasCheckedProfilePicture } = useSelector(state => state.profile);
  const { status: isAuthenticated } = useSelector(state => state.auth);
  const preferences = useSelector(state => state.preferences);
  const [customProfileUrl, setCustomProfileUrl] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);

  const isCurrentlyLoading = profilePictureId ? customLoading : isLoading;
  const currentProfileUrl = profilePictureId ? customProfileUrl : profilePictureUrl;

  useEffect(() => {
    // If profilePictureId is provided, load that specific user's profile picture
    if (profilePictureId) {
      setCustomLoading(true);
      try {
        const url = service.getFileView(profilePictureId);
        setCustomProfileUrl(url);
      } catch (error) {
        console.log('Error loading profile picture:', error);
        setCustomProfileUrl(null);
      } finally {
        setCustomLoading(false);
      }
    } else {
      // For current user's profile picture
      if (isAuthenticated && !hasCheckedProfilePicture && !isLoading) {
        // Check if user has profile picture in preferences first
        const hasProfilePictureInPrefs = preferences?.profilePicture?.url;
        
        if (hasProfilePictureInPrefs) {
          // User has profile picture, load it
          dispatch(loadProfilePicture());
        } else {
          // User doesn't have profile picture, mark as checked to prevent infinite calls
          dispatch(clearProfilePicture());
        }
      }
    }
  }, [dispatch, isAuthenticated, hasCheckedProfilePicture, isLoading, profilePictureId, preferences?.profilePicture?.url]);

  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24'
  };

  // Icon size classes
  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12'
  };

  const baseClasses = `${sizeClasses[size]} rounded-full border-2 border-border/50 overflow-hidden bg-muted flex items-center justify-center ${className}`;
  const clickableClasses = onClick ? 'cursor-pointer hover:border-primary/50 transition-colors' : '';



  if (isCurrentlyLoading) {
    return (
      <div className={`${baseClasses} ${clickableClasses} animate-pulse`}>
        <div className="w-full h-full bg-muted-foreground/20 rounded-full"></div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${clickableClasses}`}
      onClick={onClick}
    >
      {currentProfileUrl ? (
        <img
          src={currentProfileUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => {
            if (profilePictureId) {
              setCustomProfileUrl(null);
            } else {
              dispatch(clearProfilePicture());
            }
          }}
        />
      ) : showFallback ? (
        <User className={`${iconSizeClasses[size]} text-muted-foreground`} />
      ) : null}
    </div>
  );
}

export default ProfilePicture;
