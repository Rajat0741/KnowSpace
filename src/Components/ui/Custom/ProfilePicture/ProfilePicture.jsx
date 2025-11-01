import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react';
import { loadProfilePicture, clearProfilePicture } from '@/store/profileSlice';

/**
 * ProfilePicture - Display profile picture for the CURRENT logged-in user only
 * For displaying other users' profile pictures, use ExternalProfilePicture component
 */
function ProfilePicture({
  size = 'md',
  className = '',
  showFallback = true,
  onClick = null
}) {
  const dispatch = useDispatch();
  const { profilePictureUrl, isLoading, hasCheckedProfilePicture } = useSelector(state => state.profile);
  const { status: isAuthenticated } = useSelector(state => state.auth);
  const preferences = useSelector(state => state.preferences);

  useEffect(() => {
    // Load current user's profile picture from Redux state
    if (isAuthenticated && !hasCheckedProfilePicture && !isLoading) {
      if (preferences?.profilePicture?.url) {
        dispatch(loadProfilePicture());
      } else {
        dispatch(clearProfilePicture());
      }
    }
  }, [dispatch, isAuthenticated, hasCheckedProfilePicture, isLoading, preferences?.profilePicture?.url]);

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

  if (isLoading) {
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
      {profilePictureUrl ? (
        <img
          src={profilePictureUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => dispatch(clearProfilePicture())}
        />
      ) : showFallback ? (
        <User className={`${iconSizeClasses[size]} text-muted-foreground`} />
      ) : null}
    </div>
  );
}

export default ProfilePicture;
