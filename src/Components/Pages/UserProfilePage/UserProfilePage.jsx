import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { Calendar, User, CheckCircle, XCircle, ArrowLeft, FileText } from 'lucide-react'
import ProfilePicture from '../../ui/Custom/ProfilePicture/ProfilePicture'
import { SkeletonCard } from '../../ui/SkeletonCard'
import { Postcard } from '../../ui/Custom/PostCard'
import service from '@/appwrite/config'
import { Query } from 'appwrite'

function UserProfilePage() {

    const { userId } = useParams()
    const location = useLocation()
    const { user: initialUser } = location.state || {}
    const [user, setUser] = useState(initialUser)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [postsLoading, setPostsLoading] = useState(false)

    // User data state variables
    // eslint-disable-next-line no-unused-vars
    const [userIdState, setUserIdState] = useState('')
    const [userName, setUserName] = useState('')
    const [userBio, setUserBio] = useState('')
    const [userProfilePictureId, setUserProfilePictureId] = useState('')
    const [userRegistrationDate, setUserRegistrationDate] = useState('')

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let userData = user;
                // If user is not set from navigation, try to fetch by userId
                if (!(userData?.registrationDate) && userId) {
                    const response = await service.getUserById(userId);
                    if (response?.user) {
                        userData = response.user;
                        setUser(userData);
                    } else {
                        setError('User not found.');
                        return;
                    }
                }
                if (userData?.$id) {
                    // Populate state variables with user data
                    setUserIdState(userData.$id || '');
                    setUserName(userData.name || '');
                    setUserBio(userData.bio || '');
                    setUserProfilePictureId(userData.profilePictureId?.url || '');
                    setUserRegistrationDate(userData.registrationDate || '');

                    setPostsLoading(true);
                    // Only fetch active posts for public profile view
                    const queries = [
                        Query.equal('userid', userData.$id),
                        Query.equal('status', 'active')
                    ];
                    const posts = await service.getPosts(queries);
                    const sortedPosts = (posts.documents || []).sort((a, b) =>
                        new Date(b.$createdAt) - new Date(a.$createdAt)
                    );
                    setUserPosts(sortedPosts);
                } else {
                    setError('User not found.');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError('Failed to load user data.');
                setUserPosts([]);
            } finally {
                setLoading(false);
                setPostsLoading(false);
            }
        };
        fetchUserData();
    }, [userId, user])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatJoinDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now - date)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays < 30) {
            return `${diffDays} days ago`
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30)
            return `${months} month${months > 1 ? 's' : ''} ago`
        } else {
            const years = Math.floor(diffDays / 365)
            return `${years} year${years > 1 ? 's' : ''} ago`
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen relative overflow-hidden'>
                {/* Enhanced Background */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-purple-50/30 to-indigo-50/20 dark:from-slate-900/30 dark:via-slate-800/20 dark:to-slate-900/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-slate-950/60" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-15">
                        <div className="absolute top-32 left-16 w-64 h-64 bg-blue-400/10 dark:bg-slate-700/25 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute top-20 right-20 w-80 h-80 bg-purple-400/10 dark:bg-slate-600/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        <div className="absolute bottom-32 left-1/2 w-72 h-72 bg-indigo-400/10 dark:bg-slate-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-400/10 dark:bg-slate-800/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4.5s' }}></div>
                    </div>
                </div>

                <div className='relative z-10 container mx-auto px-4 py-8 space-y-8'>
                    <div className='max-w-4xl mx-auto space-y-8'>
                        {/* Back button skeleton */}
                        <div className='h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse'></div>

                        {/* Hero skeleton */}
                        <div className='bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-purple-200/30 dark:border-slate-700/50 rounded-2xl shadow-xl p-8'>
                            <div className='flex flex-col md:flex-row items-center gap-8'>
                                <div className='w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse'></div>
                                <div className='flex-1 text-center md:text-left space-y-4'>
                                    <div className='h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mx-auto md:mx-0'></div>
                                    <div className='h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mx-auto md:mx-0'></div>
                                    <div className='h-16 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse'></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats skeleton */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className='bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-purple-200/30 dark:border-slate-700/50 rounded-xl p-6 animate-pulse'>
                                    <div className='h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3'></div>
                                    <div className='h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg'></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='min-h-screen relative overflow-hidden flex items-center justify-center'>
                {/* Enhanced Background */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/40 via-orange-50/30 to-pink-50/40 dark:from-slate-900/30 dark:via-slate-800/20 dark:to-slate-900/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-slate-950/60" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-15">
                        <div className="absolute top-32 left-16 w-64 h-64 bg-red-400/15 dark:bg-slate-700/25 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute top-20 right-20 w-80 h-80 bg-orange-400/15 dark:bg-slate-600/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        <div className="absolute bottom-32 left-1/2 w-72 h-72 bg-pink-400/15 dark:bg-slate-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                    </div>
                </div>

                <div className='relative z-10 text-center p-8'>
                    <div className='bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-red-200/30 dark:border-slate-700/50 rounded-2xl shadow-xl p-8 max-w-md'>
                        <div className='w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <XCircle className='w-8 h-8 text-red-600 dark:text-red-400' />
                        </div>
                        <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>User Not Found</h2>
                        <p className='text-slate-600 dark:text-slate-300 mb-6'>{error}</p>
                        <Link
                            to="/search"
                            className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
                        >
                            <ArrowLeft className='w-4 h-4' />
                            Back to Search
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen relative overflow-hidden'>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-purple-50/30 to-indigo-50/20 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/20">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-400/10 dark:bg-slate-700/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-400/10 dark:bg-slate-600/20 rounded-full blur-3xl" />
            </div>

            <div className='relative z-10 container mx-auto px-4 py-8 space-y-8'>
                    {/* Back button */}
                    <Link 
                        to="/search" 
                        className='inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-lg shadow-md hover:shadow-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Back to Search
                    </Link>

                    {/* User Profile Card */}
                    <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-purple-200/40 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>
                        
                        {/* Header with gradient */}
                        <div className='relative bg-gradient-to-br from-slate-50/80 via-purple-50/40 to-indigo-50/30 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/50 p-8 border-b border-purple-200/30 dark:border-slate-700/40 rounded-t-xl'>
                            <div className='relative flex flex-col md:flex-row items-center md:items-start gap-6'>
                                
                                {/* Profile Picture */}
                                <div className='relative group'>
                                    <ProfilePicture
                                        size="3xl"
                                        className="shadow-lg ring-4 ring-white/60 dark:ring-slate-700/60 transition-all duration-300 group-hover:ring-purple-400/60 group-hover:shadow-purple-400/20 group-hover:shadow-xl"
                                        profilePictureId={userProfilePictureId}
                                    />
                                </div>

                                {/* User Info */}
                                <div className='flex-1 text-center md:text-left space-y-4'>
                                    <div>
                                        <h1 className='text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2'>
                                            {userName || 'Anonymous User'}
                                        </h1>
                                        <p className='text-slate-600 dark:text-slate-400 font-medium'>
                                            Public Profile
                                        </p>
                                    </div>

                                    {/* Bio */}
                                    {userBio && (
                                        <div className='bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 shadow-md border border-purple-200/40 dark:border-slate-600/40'>
                                            <div className='flex items-start gap-3'>
                                                <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm flex-shrink-0'>
                                                    <User className='w-4 h-4 text-white' />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2'>About</h3>
                                                    <p className='text-slate-800 dark:text-slate-200 leading-relaxed'>
                                                        {userBio}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Public metadata */}
                                    <div className='flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400'>
                                        {userRegistrationDate && (
                                            <div className='flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 px-3 py-2 rounded-lg border border-purple-200/40 dark:border-slate-600/40'>
                                                <Calendar className='w-4 h-4 text-purple-500' />
                                                <span>Joined {formatJoinDate(userRegistrationDate)}</span>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className='p-8'>
                            <h2 className='text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2'>
                                <User className='w-5 h-5 text-purple-500' />
                                Public Information
                            </h2>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Member since */}
                                {userRegistrationDate && (
                                    <div className='bg-white/70 dark:bg-slate-800/70 rounded-xl p-5 space-y-3 shadow-md border border-purple-200/40 dark:border-slate-600/40'>
                                        <div className='flex items-center gap-3'>
                                            <div className='p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-sm'>
                                                <Calendar className='w-5 h-5 text-white' />
                                            </div>
                                            <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Member Since</span>
                                        </div>
                                        <p className='text-lg font-bold text-slate-800 dark:text-white'>
                                            {formatDate(userRegistrationDate)}
                                        </p>
                                    </div>
                                )}

                                {/* Total Posts */}
                                <div className='bg-white/70 dark:bg-slate-800/70 rounded-xl p-5 space-y-3 shadow-md border border-purple-200/40 dark:border-slate-600/40'>
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm'>
                                            <FileText className='w-5 h-5 text-white' />
                                        </div>
                                        <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Total Posts</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='px-4 py-2 rounded-lg text-sm font-bold shadow-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'>
                                            {userPosts.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts Section */}
                <div className='relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-purple-200/40 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>

                    <div className='relative p-8 border-b border-purple-200/30 dark:border-slate-700/40 bg-gradient-to-br from-slate-50/80 via-purple-50/40 to-indigo-50/30 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/50 rounded-t-xl'>
                        <div className='relative flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                            <div>
                                <h2 className='text-3xl font-bold text-slate-800 dark:text-slate-200'>
                                    Posts
                                </h2>
                                <p className='text-slate-600 dark:text-slate-400 mt-2 font-medium'>
                                    {postsLoading ? 'Loading posts...' : `${userPosts.length} posts published`}
                                </p>
                            </div>
                            {!postsLoading && userPosts.length > 0 && (
                                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                                    <div className='hidden md:block text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm font-medium whitespace-nowrap'>
                                        Last updated: {new Date(userPosts[0]?.$updatedAt || userPosts[0]?.$createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='relative p-10'>

                        {postsLoading ? (
                            <div className='space-y-6'>
                                <div className='h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse'></div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8'>
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <SkeletonCard key={`post-${index}`} className="h-72 sm:h-80 bg-slate-200/60 dark:bg-slate-700/60 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        ) : userPosts.length > 0 ? (
                            <div className='w-full space-y-8'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10'>
                                    {userPosts.map((post) => (
                                        <div key={post.$id} className='w-full relative group'>

                                            {/* Card with hover animation */}
                                            <div className='transform transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105'>
                                                <Postcard
                                                    post={post}
                                                    className="h-72 sm:h-80 w-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-600/50 rounded-xl overflow-hidden"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-20 px-6 text-center'>
                                <div className='relative bg-gradient-to-br from-slate-50/80 via-purple-50/40 to-indigo-50/30 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/50 rounded-2xl p-12 max-w-lg shadow-lg border border-purple-200/30 dark:border-slate-600/40 overflow-hidden'>

                                    <div className='relative w-24 h-24 mx-auto mb-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shadow-inner'>
                                        <FileText className='relative w-12 h-12 text-slate-600 dark:text-slate-300' />
                                    </div>
                                    <h3 className='relative text-2xl font-bold text-slate-800 dark:text-white mb-4'>No posts yet</h3>
                                    <p className='relative text-slate-600 dark:text-slate-300 leading-relaxed text-lg'>
                                        This user hasn't published any posts yet. Check back later for new content!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                    {/* Note about limited information */}
                    <div className='bg-purple-50/80 dark:bg-slate-800/80 backdrop-blur-xl border border-purple-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-md'>
                        <div className='flex items-start gap-3'>
                            <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm'>
                                <User className='w-4 h-4 text-white' />
                            </div>
                            <div>
                                <h3 className='font-semibold text-purple-800 dark:text-purple-200 mb-1'>Public Profile</h3>
                                <p className='text-sm text-purple-700 dark:text-purple-300'>
                                    This is a public profile view with limited information. Only publicly available details are shown to respect user privacy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default UserProfilePage