import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { SkeletonCard } from "../Components/ui/SkeletonCard"

export default function Protected({children, authentication}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        // If route requires auth but user is not authenticated
        if(authentication && !authStatus){
            navigate("/")
        } 
        // If route is for non-authenticated users but user is authenticated
        else if(!authentication && authStatus){
            navigate("/home")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ? (
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
    ) : <>{children}</>
}