import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import service from '../../../appwrite/config'
import { Query } from 'appwrite'
import Postcard from '../../ui/Custom/PostCard/Postcard'
import { SkeletonCard } from '../../ui/SkeletonCard'
import ProfilePicture from '../../ui/Custom/ProfilePicture/ProfilePicture'
import { CheckCircle, XCircle, User, Mail, Calendar, FileText, Plus } from 'lucide-react'

function Profile() {
    const userData = useSelector(state => state.auth.userData)
    const [userPosts, setUserPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userData?.$id) {
            // Fetch all posts by user (both active and inactive) 
            // We pass only the userid query to override the default status filter
            const queries = [Query.equal('userid', userData.$id)]

            service.getPosts(queries).then(posts => {
                const sortedPosts = (posts.documents || []).sort((a, b) =>
                    new Date(b.$createdAt) - new Date(a.$createdAt)
                )
                setUserPosts(sortedPosts)
            }).catch(error => {
                console.error("Error fetching user posts:", error)
                setUserPosts([])
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [userData?.$id])

    return (
        <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
            {/* Animated Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-slate-700/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-purple-400/10 dark:bg-slate-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-400/10 dark:bg-slate-700/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8'>
                {/* User Information Section */}
                <div className='relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300'>

                    {/* Header */}
                    <div className='relative bg-gradient-to-br from-slate-50/80 to-purple-50/40 dark:from-slate-800/80 dark:to-slate-700/40 p-4 sm:p-6 lg:p-8 border-b border-slate-200/50 dark:border-slate-700/40 rounded-t-2xl'>
                        <div className='relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6'>
                            <div className='relative group'>
                                <Link to="/settings" className="block focus:outline-none">
                                    <div className='relative'>
                                        <ProfilePicture
                                            size="3xl"
                                            className="shadow-xl ring-4 ring-white/80 dark:ring-slate-700/80 cursor-pointer transition-all duration-300 group-hover:ring-purple-400/60 group-hover:shadow-purple-400/20 group-hover:shadow-2xl group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                                    </div>
                                </Link>
                            </div>
                            <div className='flex-1 text-center sm:text-left'>
                                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2'>
                                    {userData?.name || 'User'}
                                </h1>
                                <p className='text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium mb-3'>📊 Profile Dashboard</p>
                                <Link 
                                    to="/settings"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Edit Profile
                                </Link>
                            </div>
                    </div>
                </div>

                {/* Bio Section - if user has a bio, display it prominently */}
                {userData?.prefs?.bio && (
                    <div className='relative bg-gradient-to-br from-white/80 to-purple-50/40 dark:from-slate-800/80 dark:to-slate-700/40 rounded-xl p-4 sm:p-6 mx-4 sm:mx-6 mt-4 mb-2 shadow-lg border border-slate-200/60 dark:border-slate-600/50 backdrop-blur-sm'>
                        <div className='flex items-start gap-3'>
                            <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md flex-shrink-0'>
                                <User className='w-4 h-4 text-white' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2'>
                                    <span>About Me</span>
                                    <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">Bio</span>
                                </h3>
                                <p className='text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed break-words'>
                                    {userData.prefs.bio}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Details Grid */}
                <div className='relative p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>                        {/* Name Card */}
                        <div className='relative group bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 space-y-3 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200/50 dark:border-slate-600/40'>
                            <div className='relative flex items-center gap-3'>
                                <div className='p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm'>
                                    <User className='w-5 h-5 text-white' />
                                </div>
                                <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Name</span>
                            </div>
                            <p className='relative text-lg font-bold text-slate-800 dark:text-white'>{userData?.name || 'Not provided'}</p>
                        </div>

                        {/* Email Card */}
                        <div className='relative group bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 space-y-3 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200/50 dark:border-slate-600/40'>
                            <div className='relative flex items-center gap-3'>
                                <div className='p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm'>
                                    <Mail className='w-5 h-5 text-white' />
                                </div>
                                <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Email</span>
                            </div>
                            <p className='relative text-lg font-bold text-slate-800 dark:text-white break-all'>{userData?.email || 'Not provided'}</p>
                        </div>

                        {/* Email Verification Status */}
                        <div className='relative group bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 space-y-3 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200/50 dark:border-slate-600/40'>
                            <div className='relative flex items-center gap-3'>
                                <div className={`p-2 rounded-lg shadow-sm ${userData?.emailVerification
                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                    : 'bg-gradient-to-br from-red-500 to-red-600'
                                    }`}>
                                    {userData?.emailVerification ? (
                                        <CheckCircle className='w-5 h-5 text-white' />
                                    ) : (
                                        <XCircle className='w-5 h-5 text-white' />
                                    )}
                                </div>
                                <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Email Status</span>
                            </div>
                            <div className='relative flex items-center gap-2'>
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${userData?.emailVerification
                                        ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                        : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                    }`}>
                                    {userData?.emailVerification ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>
                        </div>

                        {/* Registration Date */}
                        <div className='relative group bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 space-y-3 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200/50 dark:border-slate-600/40'>
                            <div className='relative flex items-center gap-3'>
                                <div className='p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-sm'>
                                    <Calendar className='w-5 h-5 text-white' />
                                </div>
                                <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Member Since</span>
                            </div>
                            <p className='relative text-lg font-bold text-slate-800 dark:text-white'>
                                {userData?.registration ? new Date(userData.registration).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'Unknown'}
                            </p>
                        </div>

                        {/* Posts Count */}
                        <div className='relative group bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 space-y-3 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200/50 dark:border-slate-600/40'>
                            <div className='relative flex items-center gap-3'>
                                <div className='p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm'>
                                    <FileText className='w-5 h-5 text-white' />
                                </div>
                                <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Total Posts</span>
                            </div>
                            <p className='relative text-lg font-bold text-slate-800 dark:text-white'>
                                {loading ? '...' : userPosts.length}
                            </p>
                        </div>

                        {/* Account Status */}
                        <div className='relative group bg-white/80 dark:bg-slate-800/80 rounded-xl p-5 space-y-3 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200/50 dark:border-slate-600/40'>
                            <div className='relative flex items-center gap-3'>
                                <div className={`p-2 rounded-lg shadow-sm ${userData?.status
                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                    : 'bg-gradient-to-br from-slate-500 to-slate-600'
                                    }`}>
                                    {userData?.status ? (
                                        <CheckCircle className='w-5 h-5 text-white' />
                                    ) : (
                                        <XCircle className='w-5 h-5 text-white' />
                                    )}
                                </div>
                                <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Account Status</span>
                            </div>
                            <div className='relative flex items-center gap-2'>
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${userData?.status
                                        ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}>
                                    {userData?.status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Section */}
                <div className='relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300'>

                    <div className='relative p-4 sm:p-6 lg:p-8 border-b border-slate-200/50 dark:border-slate-700/40 bg-gradient-to-br from-slate-50/80 to-purple-50/40 dark:from-slate-800/80 dark:to-slate-700/40 rounded-t-2xl'>
                        <div className='relative flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                            <div>
                                <h2 className='text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2'>
                                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
                                    My Posts
                                </h2>
                                <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium'>
                                    {loading ? 'Loading...' : `${userPosts.length} ${userPosts.length === 1 ? 'post' : 'posts'} published • Active and inactive`}
                                </p>
                            </div>
                            {!loading && userPosts.length > 0 && (
                                <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                                    {/* Active/Inactive post counts */}
                                    <div className='flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/30 px-3 py-2 rounded-lg border border-green-200/50 dark:border-green-800/50 shadow-sm'>
                                        <div className='w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse'></div>
                                        <span className='text-xs sm:text-sm text-green-700 dark:text-green-300 font-bold whitespace-nowrap'>
                                            {userPosts.filter(post => post.status === 'active').length} Active
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/30 px-3 py-2 rounded-lg border border-red-200/50 dark:border-red-800/50 shadow-sm'>
                                        <div className='w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full'></div>
                                        <span className='text-xs sm:text-sm text-red-700 dark:text-red-300 font-bold whitespace-nowrap'>
                                            {userPosts.filter(post => post.status === 'inactive').length} Inactive
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='relative p-4 sm:p-6 lg:p-10'>

                        {loading ? (
                            <div className='space-y-6'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <SkeletonCard key={`post-${index}`} className="h-64 sm:h-72 lg:h-80 bg-slate-200/60 dark:bg-slate-700/60 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        ) : userPosts.length > 0 ? (
                            <div className='w-full space-y-8'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
                                    {userPosts.map((post) => (
                                        <div key={post.$id} className='w-full relative group'>
                                            {/* Status Badge */}
                                            <div className='absolute top-3 right-3 z-20'>
                                                <span className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-all duration-300 group-hover:scale-110 backdrop-blur-sm ${post.status === 'active'
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                        : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                                                    }`}>
                                                    {post.status === 'active' ? '✓ Active' : '✕ Inactive'}
                                                </span>
                                            </div>

                                            {/* Card with hover animation */}
                                            <div className='transform transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105'>
                                                <Postcard
                                                    post={post}
                                                    className="h-64 sm:h-72 lg:h-80 w-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-600/50 rounded-xl overflow-hidden"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 text-center'>
                                <div className='relative bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/40 rounded-2xl p-8 sm:p-12 max-w-lg shadow-xl border border-slate-200/60 dark:border-slate-600/50 backdrop-blur-xl'>
                                    <div className='relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-inner'>
                                        <FileText className='relative w-10 h-10 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400' />
                                    </div>
                                    <h3 className='relative text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4'>No posts yet</h3>
                                    <p className='relative text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6'>
                                        Start creating amazing content to share with the world!
                                    </p>
                                    <Link
                                        to="/create-post"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Create Your First Post
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile