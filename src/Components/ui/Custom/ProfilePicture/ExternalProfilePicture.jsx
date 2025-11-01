import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import service from '@/appwrite/config';

/**
 * ExternalProfilePicture - Display profile pictures for users other than the current logged-in user
 * This component handles external user profile pictures without interfering with Redux state
 */
function ExternalProfilePicture({
  size = 'md',
  className = '',
  showFallback = true,
  onClick = null,
  profilePictureId = null
}) {
  const [profileUrl, setProfileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when profilePictureId changes
    setError(false);
    
    // If no profilePictureId, show fallback
    if (!profilePictureId || profilePictureId === '') {
      setProfileUrl(null);
      setLoading(false);
      return;
    }

    // Load the profile picture
    setLoading(true);
    try {
      // Check if profilePictureId is already a full URL or just an ID
      const isFullUrl = profilePictureId.startsWith('http://') || profilePictureId.startsWith('https://');
      const url = isFullUrl ? profilePictureId : service.getFileView(profilePictureId);
      setProfileUrl(url);
    } catch (err) {
      console.error('Error loading external profile picture:', err);
      setError(true);
      setProfileUrl(null);
    } finally {
      setLoading(false);
    }
  }, [profilePictureId]);

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

  // Loading state
  if (loading) {
    return (
      <div className={`${baseClasses} ${clickableClasses} animate-pulse`}>
        <div className="w-full h-full bg-muted-foreground/20 rounded-full"></div>
      </div>
    );
  }

  // Display image or fallback
  return (
    <div
      className={`${baseClasses} ${clickableClasses}`}
      onClick={onClick}
    >
      {profileUrl && !error ? (
        <img
          src={profileUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : showFallback ? (
        <User className={`${iconSizeClasses[size]} text-muted-foreground`} />
      ) : null}
    </div>
  );
}

export default ExternalProfilePicture;
