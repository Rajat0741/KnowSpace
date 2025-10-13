import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { SkeletonCard } from "../Components/ui/SkeletonCard"

export default function Protected({children, authentication}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const isInitialized = useSelector(state => state.auth.isInitialized)
    const isLoading = useSelector(state => state.auth.isLoading)

    useEffect(() => {
        // Wait for auth to be initialized before making routing decisions
        if (!isInitialized || isLoading) {
            return;
        }

        // If route requires auth but user is not authenticated
        if(authentication && !authStatus){
            navigate("/", { replace: true })
        } 
        // If route is for non-authenticated users but user is authenticated
        else if(!authentication && authStatus){
            navigate("/home", { replace: true })
        }
        
        // Only set loader to false after initialization is complete
        setLoader(false)
    }, [authStatus, isInitialized, isLoading, navigate, authentication])

    // Show loader while auth is initializing or during auth operations
    if (!isInitialized || isLoading || loader) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        )
    }

    return <>{children}</>
}