import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../../appwrite/auth';
import Button from '../../ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = searchParams.get('userId');
        const secret = searchParams.get('secret');

        if (userId && secret) {
            verifyEmail(userId, secret);
        } else {
            setVerificationStatus('error');
            setErrorMessage('Invalid verification link. Missing parameters.');
        }
    }, [searchParams]);

    const verifyEmail = async (userId, secret) => {
        try {
            await authService.confirmVerification(userId, secret);
            setVerificationStatus('success');
        } catch (error) {
            setVerificationStatus('error');
            setErrorMessage(error.message || 'Failed to verify your email. The link may have expired.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
            <div className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg border border-border/50">
                <div className="text-center">
                    {verificationStatus === 'verifying' && (
                        <>
                            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
                            <h2 className="mt-4 text-2xl font-bold">Verifying your email...</h2>
                            <p className="mt-2 text-muted-foreground">Please wait while we verify your email address.</p>
                        </>
                    )}

                    {verificationStatus === 'success' && (
                        <>
                            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                            <h2 className="mt-4 text-2xl font-bold text-green-600">Email Verified!</h2>
                            <p className="mt-2 text-muted-foreground">Your email has been successfully verified. You can now log in to your account.</p>
                            <Button 
                                className="mt-6 w-full" 
                                onClick={() => navigate('/')}
                            >
                                Go to Login
                            </Button>
                        </>
                    )}

                    {verificationStatus === 'error' && (
                        <>
                            <XCircle className="w-16 h-16 mx-auto text-destructive" />
                            <h2 className="mt-4 text-2xl font-bold text-destructive">Verification Failed</h2>
                            <p className="mt-2 text-muted-foreground">{errorMessage}</p>
                            <div className="mt-6 space-y-3">
                                <Button 
                                    className="w-full" 
                                    onClick={() => navigate('/')}
                                >
                                    Back to Login
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full" 
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign Up Again
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
