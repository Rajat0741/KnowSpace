import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleDarkMode } from '@/store/darkmodeSlice';
import { setProfilePicture, clearProfilePicture } from '@/store/profileSlice';
import authService from '@/appwrite/auth';
import { logout, updateUserData } from '@/store/authSlice';
import {
  Settings as SettingsIcon, Moon, Sun, Lock, Trash2, Eye, EyeOff, AlertTriangle, Check, X, Camera, User, Edit3
} from 'lucide-react';
import Button from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useSelector(state => state.darkMode);
  const { profilePictureUrl } = useSelector(state => state.profile);
  const { userData } = useSelector(state => state.auth);

  // Form states
  const [newBio, setNewBio] = useState(userData?.prefs?.bio || '');

  // UI states
  // These booleans control loading indicators, modals and success messages
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isUpdatingBio, setIsUpdatingBio] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [profilePictureSuccess, setProfilePictureSuccess] = useState(false);
  const [bioUpdateSuccess, setBioUpdateSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    // - ensure input is an image
    // - enforce a 5MB client-side limit to avoid large uploads
    if (!file.type.startsWith('image/')) {
      setErrors({ profilePicture: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors({ profilePicture: 'Image size must be less than 5MB' });
      return;
    }

    setIsUploadingPicture(true);
    setErrors({});

    try {
      const uploadedFile = await authService.uploadProfilePicture(file);
      if (uploadedFile) {
        // Get the new profile picture URL and update Redux state
        const newUrl = await authService.getProfilePictureUrl();
        if (newUrl) {
          dispatch(setProfilePicture(newUrl));
        }
        setProfilePictureSuccess(true);
        setTimeout(() => setProfilePictureSuccess(false), 3000);
      }
    } catch (error) {
      // surface user-friendly error to the UI
      setErrors({ profilePicture: error.message || 'Failed to upload profile picture' });
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    setIsUploadingPicture(true);
    try {
      await authService.deleteProfilePicture();
      dispatch(clearProfilePicture());
      setProfilePictureSuccess(true);
      setTimeout(() => setProfilePictureSuccess(false), 3000);
    } catch (error) {
      // show any server-side error returned while deleting
      setErrors({ profilePicture: error.message || 'Failed to remove profile picture' });
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleBioUpdate = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (newBio.length > 500) {
      setErrors({ bio: 'Bio must be less than 500 characters' });
      return;
    }
    if (newBio.trim() === (userData?.prefs?.bio || '')) {
      setErrors({ bio: 'New bio must be different from current bio' });
      return;
    }

    setIsUpdatingBio(true);
    try {
      // Update bio using Appwrite preferences
      await authService.uploadBio({ bio: newBio.trim() });

      // Update Redux store with new bio in user preferences
      dispatch(updateUserData({
        prefs: {
          ...userData?.prefs,
          bio: newBio.trim()
        }
      }));

      setBioUpdateSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setBioUpdateSuccess(false), 3000);
    } catch (error) {
      // Map error to form field so UI can display it inline
      setErrors({ bio: error.message || 'Failed to update bio' });
    } finally {
      setIsUpdatingBio(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setErrors({ delete: 'Please type "DELETE" to confirm' });
      return;
    }

    setIsDeletingAccount(true);
    try {
      // First, get the current user to get their ID
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        // Import service for database operations
        const service = await import('@/appwrite/config').then(m => m.default);
        const { Query } = await import('appwrite');

        // Query all posts by this user
        const userPosts = await service.getPosts([
          Query.equal('userid', currentUser.$id)
        ]);

        // Delete each post and its featured image if exists
        for (const post of userPosts.documents) {
          try {
            // Delete featured image if exists
            if (post.featuredimage) {
              try {
                const imageData = JSON.parse(post.featuredimage);
                if (imageData.fileId) {
                  await service.deleteFile(imageData.fileId);
                }
              } catch {
                // Old format or external URL, skip deletion
              }
            }
            // Delete the post
            await service.deletePost(post.$id);
          } catch (postError) {
            // Log but continue deleting other posts — we try to be resilient
            console.log('Error deleting post:', post.$id, postError);
            // Continue with other posts even if one fails
          }
        }

        // Delete profile picture if exists
        await authService.deleteProfilePicture();
      }

      // Finally, delete the account
      await authService.deleteAccount();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      // Populate the delete error slot shown near the confirmation
      setErrors({ delete: error.message || 'Failed to delete account' });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with animated gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/25 via-indigo-50/20 to-purple-50/30 dark:from-blue-950/15 dark:via-indigo-950/10 dark:to-purple-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent dark:from-gray-900/70" />
        {/* Floating orbs for settings theme */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-10">
          <div className="absolute top-20 left-20 w-60 h-60 bg-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }}></div>
        </div>
      </div>

      {/* Main container: centers content and provides responsive padding */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Page header: title and short description */}
        <div className="mb-8">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-blue-200/30 dark:border-purple-800/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Settings & Preferences
                </h1>
                <p className="text-muted-foreground mt-1">
                  Customize your account preferences and security settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stylish Divider */}
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-blue-400"></div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
          </div>
        </div>

        {/* All settings sections are stacked vertically with spacing */}
        <div className="space-y-8 mt-6 ">
          {/* Enhanced Preferences Section */}
          <section className="relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/80 to-purple-50/60 dark:from-blue-950/30 dark:via-gray-900/80 dark:to-purple-950/30 backdrop-blur-xl"></div>
            <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm"></div>

            {/* Preferences content card: holds profile picture, display name and dark mode */}
            <div className="relative border border-blue-200/40 dark:border-purple-800/40 rounded-2xl p-8 shadow-xl">
              {/* Section header with icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                  <span className="text-xl">🎨</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Preferences
                </h2>
              </div>

              {/* Profile Picture block */}
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-6 flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  Profile Picture
                </h3>

                {/* Success feedback when profile picture upload/remove succeeds */}
                {profilePictureSuccess && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl mb-6 backdrop-blur-sm">
                    <div className="p-1 bg-green-500 rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent font-medium">
                      Profile picture updated successfully!
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Profile picture preview: shows current image or placeholder icon */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative">
                      {/* Glowing background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-lg"></div>
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-white/50 dark:border-gray-700/50 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center shadow-xl">
                        {profilePictureUrl ? (
                          <img
                            src={profilePictureUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 dark:text-purple-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload controls: file input is visually hidden and controlled by the styled button */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-200/30 dark:border-purple-700/30">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <strong>Upload guidelines:</strong> Choose a clear profile picture.
                        <span className="hidden sm:inline"> Recommended size: 400x400px or larger.</span>
                        <span className="block sm:inline"> Maximum file size: 5MB.</span>
                        <span className="hidden sm:inline"> Supported formats: JPG, PNG, WebP.</span>
                      </p>
                    </div>

                    {/* Inline error for profile picture validation/upload errors */}
                    {errors.profilePicture && (
                      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl backdrop-blur-sm">
                        <div className="p-1 bg-red-500 rounded-full flex-shrink-0">
                          <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm bg-gradient-to-r from-red-700 to-pink-700 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent font-medium">
                          {errors.profilePicture}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                      <div className="relative flex-1 sm:flex-initial">
                        {/* Actual file input (screen-reader accessible). Invisible but fills button area */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          disabled={isUploadingPicture}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          id="profile-picture-upload"
                        />
                        {/* Visible label-styled button that triggers the hidden file input */}
                        <Button
                          as="label"
                          htmlFor="profile-picture-upload"
                          disabled={isUploadingPicture}
                          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                        >
                          <Camera className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {isUploadingPicture ? 'Uploading...' : 'Upload Picture'}
                          </span>
                        </Button>
                      </div>

                      {/* Remove button appears only when a profile picture is present */}
                      {profilePictureUrl && (
                        <Button
                          onClick={handleRemoveProfilePicture}
                          disabled={isUploadingPicture}
                          variant="outline"
                          className="w-full sm:w-auto border-red-200/50 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/30 backdrop-blur-sm text-sm sm:text-base"
                        >
                          <Trash2 className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Remove</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual divider between profile and bio sections */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-purple-800"></div>
                <div className="px-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-purple-800"></div>
              </div>

              {/* Bio update block */}
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-6 flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                    <Edit3 className="w-4 h-4 text-white" />
                  </div>
                  Bio Description
                </h3>

                {/* Success feedback when bio update succeeds */}
                {bioUpdateSuccess && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl mb-6 backdrop-blur-sm">
                    <div className="p-1 bg-green-500 rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent font-medium">
                      Bio updated successfully!
                    </span>
                  </div>
                )}

                {/* Bio update form and helper text */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-200/30 dark:border-purple-700/30">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      <span className="block sm:inline"> • Write a short bio to tell others about yourself.</span>
                      <span className="hidden sm:inline"> • Your bio will be displayed on your profile page.</span>
                    </p>
                  </div>

                  {/* Inline error for bio validation/update errors */}
                  {errors.bio && (
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl backdrop-blur-sm">
                      <div className="p-1 bg-red-500 rounded-full flex-shrink-0">
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm bg-gradient-to-r from-red-700 to-pink-700 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent font-medium">
                        {errors.bio}
                      </span>
                    </div>
                  )}

                  {/* Form: validates and sends bio update request */}
                  <form onSubmit={handleBioUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bio Description
                      </label>
                      <textarea
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        placeholder="Tell others about yourself..."
                        className="w-full h-32 px-3 py-2 bg-white/90 dark:bg-gray-900/50 border-2 border-blue-300/70 dark:border-purple-600/70 focus:border-blue-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-blue-400/20 dark:focus:ring-purple-500/20 transition-all duration-300 rounded-lg resize-none"
                        maxLength={500}
                        disabled={isUpdatingBio}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {newBio.length}/500 characters
                        </span>
                        {newBio.trim() && newBio.trim() !== (userData?.prefs?.bio || '') && (
                          <span className="text-xs text-blue-600 dark:text-purple-400 font-medium">
                            Preview: {newBio.trim().slice(0, 50)}{newBio.trim().length > 50 ? '...' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Buttons: submit (update) and reset to original bio */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                      <Button
                        type="submit"
                        disabled={isUpdatingBio || !newBio.trim() || newBio.trim() === (userData?.prefs?.bio || '')}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdatingBio ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Edit3 className="w-4 h-4" />
                            <span>Update Bio</span>
                          </div>
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => {
                          setNewBio(userData?.prefs?.bio || '');
                          setErrors(prev => ({ ...prev, bio: undefined }));
                        }}
                        disabled={isUpdatingBio || newBio === (userData?.prefs?.bio || '')}
                        variant="outline"
                        className="w-full sm:w-auto border-blue-200/50 dark:border-purple-700/50 text-blue-600 dark:text-purple-400 hover:bg-blue-50/50 dark:hover:bg-purple-950/30 backdrop-blur-sm text-sm sm:text-base"
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Divider between preferences and dark mode toggle */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-purple-800"></div>
                <div className="px-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-purple-800"></div>
              </div>

              {/* Dark mode toggle: dispatches to Redux to persist theme preference */}
              <div className="bg-gradient-to-r from-blue-50/60 to-purple-50/60 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-blue-200/30 dark:border-purple-700/30">
                <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  {/* Toggle label and description */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-400 to-yellow-500 dark:from-blue-500 dark:to-purple-600 rounded-xl shadow-lg transition-all duration-500 flex-shrink-0">
                      {isDarkMode ? (
                        <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground text-base sm:text-lg truncate">
                        <span className="hidden xs:inline">
                          {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                        </span>
                        <span className="xs:hidden">
                          {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {isDarkMode
                          ? 'Darker, easier-on-the-eyes interface'
                          : 'Bright, clean interface for daytime use'
                        }
                      </p>
                    </div>
                  </div>
                  {/* Switch button: updates theme in store when clicked */}
                  <button
                    onClick={() => dispatch(toggleDarkMode())}
                    className={`relative inline-flex h-7 w-14 sm:h-8 sm:w-16 items-center rounded-full transition-all duration-300 outline:none ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 shadow-lg hover:shadow-xl flex-shrink-0 ${isDarkMode
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 ring-purple-500/30'
                        : 'bg-gradient-to-r from-orange-400 to-yellow-500 ring-orange-500/30'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${isDarkMode ? 'translate-x-8 sm:translate-x-9' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Danger Zone Divider */}
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-400"></div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-lg animate-pulse">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-red-400 to-transparent"></div>
            </div>
          </div>

          {/* Enhanced Danger Zone */}
          <section className="relative overflow-hidden">
            {/* Warning background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-orange-50/60 to-pink-50/80 dark:from-red-950/40 dark:via-orange-950/30 dark:to-pink-950/40 backdrop-blur-xl"></div>
            <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"></div>

            {/* Content */}
            <div className="relative border-2 border-red-200/60 dark:border-red-800/60 rounded-2xl p-8 shadow-2xl">
              {/* Warning header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                    ⚠️ Danger Zone
                  </h2>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-medium">
                    Irreversible actions that permanently affect your account
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-50/90 to-pink-50/90 dark:from-red-900/30 dark:to-pink-900/30 backdrop-blur-sm rounded-xl p-6 border border-red-200/50 dark:border-red-800/50">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 text-lg mb-3 flex items-center gap-2">
                    🗑️ Delete Account
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-red-600 dark:text-red-300 font-medium">
                      ⚠️ <strong>Warning:</strong> This action cannot be undone!
                    </p>
                    <p className="text-red-600 dark:text-red-300 leading-relaxed">
                      Deleting your account will permanently remove:
                    </p>
                    <ul className="text-red-600 dark:text-red-300 ml-4 space-y-1">
                      <li>• All your posts and content</li>
                      <li>• Your profile and personal information</li>
                      <li>• Account settings and preferences</li>
                      <li>• All associated data and history</li>
                    </ul>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="destructive"
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account Permanently
                  </Button>
                ) : (
                  <div className="space-y-6 p-6 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 backdrop-blur-sm rounded-xl border-2 border-red-300/50 dark:border-red-800/50">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">
                        Final Confirmation Required
                      </h4>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-4">
                        Type <span className="bg-red-200 dark:bg-red-800 px-2 py-1 rounded font-mono">DELETE</span> to confirm account deletion:
                      </p>
                    </div>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                      className="bg-white/90 dark:bg-red-950/50 border-red-300 dark:border-red-700 text-center font-mono text-lg"
                    />
                    {errors.delete && (
                      <div className="flex items-center gap-2 p-3 bg-red-200/50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                        <X className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-700 dark:text-red-400 font-medium">
                          {errors.delete}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount || deleteConfirmText !== 'DELETE'}
                        variant="destructive"
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-50 shadow-lg"
                      >
                        {isDeletingAccount ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Deleting...
                          </div>
                        ) : (
                          'Confirm Delete'
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                          setErrors({});
                        }}
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50 backdrop-blur-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;
