import Button from "../../button";
import { useDispatch } from "react-redux";
import { performLogout } from "@/store/authThunks";
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from "react-router-dom";
// Optimized individual icon imports to reduce bundle size
import LogOut from "lucide-react/dist/esm/icons/log-out";
import Shield from "lucide-react/dist/esm/icons/shield";
import { createPortal } from 'react-dom';

function Logoutbtn({ classname }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true)
    }

    const confirmLogout = async () => {
        setIsLoggingOut(true)
        try {
            await dispatch(performLogout()).unwrap()
            toast.success("Logged out successfully")
            navigate("/")
        } catch (error) {
            toast.error(`Error in logout: ${error.message || error}`)
        } finally {
            setIsLoggingOut(false)
            setShowLogoutConfirm(false)
        }
    }

    const cancelLogout = () => {
        setShowLogoutConfirm(false)
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            cancelLogout()
        }
    }

    return (
        <>
            <Button 
                variant="destructive" 
                size="lg"
                onClick={handleLogoutClick} 
                className={`${classname} min-h-[44px] bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 active:scale-95`}
            >
                <LogOut className="w-4 h-4" />
                Logout
            </Button>

            {/* Beautiful Logout Confirmation Modal */}
            {showLogoutConfirm && createPortal(
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
                    onClick={handleBackdropClick}
                >
                    <div
                        className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-0 zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <LogOut className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>

                        {/* Title and Message */}
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Sign Out</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Are you sure you want to sign out? You'll need to log in again to access your account.
                            </p>
                        </div>

                        {/* Security Info */}
                        <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">For your security:</p>
                                <p>Make sure you're signing out from a secure location and have saved any unsaved work.</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors duration-200 font-medium"
                            >
                                Stay Logged In
                            </button>
                            <button
                                onClick={confirmLogout}
                                disabled={isLoggingOut}
                                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing Out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export default Logoutbtn