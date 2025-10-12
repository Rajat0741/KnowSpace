import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import service from '../../../appwrite/config'
import { Query } from 'appwrite'
import Postcard from '../../ui/Custom/PostCard/Postcard'
import { SkeletonCard } from '../../ui/SkeletonCard'
import ProfilePicture from '../../ui/Custom/ProfilePicture/ProfilePicture'
import { CheckCircle, XCircle, User, Mail, Calendar, FileText } from 'lucide-react'

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
        <div className='min-h-screen relative overflow-hidden'>
            {/* Subtle, unified background with gentle gradients */}
            <div className="absolute inset-0 ">
                {/* Minimal ambient lighting effects */}
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/5 dark:bg-purple-400/8 rounded-full blur-3xl" />
            </div>

            <div className='relative z-10 container mx-auto px-4 py-8 space-y-8'>
                {/* User Information Section */}
                <div className='relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>

                    {/* Header */}
                    <div className='relative bg-slate-50/50 dark:bg-slate-800/50 p-6 border-b border-slate-200/50 dark:border-slate-700/40 rounded-t-xl'>
                        <div className='relative flex items-center gap-4'>
                            <div className='relative'>
                                <Link to="/settings" className="block focus:outline-none group">
                                    <div className='relative'>
                                        <ProfilePicture
                                            size="3xl"
                                            className="shadow-lg ring-4 ring-white/60 dark:ring-slate-700/60 cursor-pointer transition-all duration-300 group-hover:ring-blue-400/60 group-hover:shadow-blue-400/20 group-hover:shadow-xl"
                                        />
                                    </div>
                                </Link>
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-slate-800 dark:text-slate-200'>
                                    {userData?.name || 'User'}
                                </h1>
                                <p className='text-slate-600 dark:text-slate-400 font-medium'>Profile Dashboard</p>
                            </div>
                    </div>
                </div>

                {/* Bio Section - if user has a bio, display it prominently */}
                {userData?.prefs?.bio && (
                    <div className='relative bg-white/60 dark:bg-slate-800/60 rounded-xl p-6 mx-6 mt-4 mb-2 shadow-md border border-slate-200/50 dark:border-slate-600/40 backdrop-blur-sm top-3'>
                        <div className='flex items-start gap-3'>
                            <div className='p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm flex-shrink-0'>
                                <svg className='w-4 h-4 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2'>Bio</h3>
                                <p className='text-slate-800 dark:text-slate-200 leading-relaxed break-words'>
                                    {userData.prefs.bio}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Details Grid */}
                <div className='relative p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>                        {/* Name Card */}
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
                                <div className='p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-sm'>
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
                <div className='relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'>

                    <div className='relative p-8 border-b border-slate-200/50 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-xl'>
                        <div className='relative flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                            <div>
                                <h2 className='text-3xl font-bold text-slate-800 dark:text-slate-200'>
                                    My Posts
                                </h2>
                                <p className='text-slate-600 dark:text-slate-400 mt-2 font-medium'>
                                    {loading ? 'Loading...' : `${userPosts.length} posts published • Active and inactive posts`}
                                </p>
                            </div>
                            {!loading && userPosts.length > 0 && (
                                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                                    {/* Active/Inactive post counts */}
                                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm w-full sm:w-auto'>
                                        <div className='flex items-center gap-2 bg-green-50 dark:bg-green-950/50 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800 shadow-sm w-full sm:w-auto justify-center sm:justify-start'>
                                            <div className='w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full'></div>
                                            <span className='text-green-700 dark:text-green-300 font-semibold whitespace-nowrap'>
                                                {userPosts.filter(post => post.status === 'active').length} Active
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2 bg-red-50 dark:bg-red-950/50 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 shadow-sm w-full sm:w-auto justify-center sm:justify-start'>
                                            <div className='w-3 h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full'></div>
                                            <span className='text-red-700 dark:text-red-300 font-semibold whitespace-nowrap'>
                                                {userPosts.filter(post => post.status === 'inactive').length} Inactive
                                            </span>
                                        </div>
                                    </div>
                                    <div className='hidden md:block text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm font-medium whitespace-nowrap'>
                                        Last updated: {new Date(userPosts[0]?.$updatedAt || userPosts[0]?.$createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='relative p-10'>

                        {loading ? (
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
                                            {/* Status Badge */}
                                            <div className='absolute top-4 right-4 z-20'>
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all duration-300 group-hover:scale-105 ${post.status === 'active'
                                                        ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                                                        : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                                    }`}>
                                                    {post.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>

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
                                <div className='relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-12 max-w-lg shadow-lg border border-slate-200 dark:border-slate-600/40 overflow-hidden'>

                                    <div className='relative w-24 h-24 mx-auto mb-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shadow-inner'>
                                        <FileText className='relative w-12 h-12 text-slate-600 dark:text-slate-300' />
                                    </div>
                                    <h3 className='relative text-2xl font-bold text-slate-800 dark:text-white mb-4'>No posts yet</h3>
                                    <p className='relative text-slate-600 dark:text-slate-300 leading-relaxed text-lg'>
                                        You haven't published any posts yet. Start writing to share your thoughts with the world!
                                    </p>
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