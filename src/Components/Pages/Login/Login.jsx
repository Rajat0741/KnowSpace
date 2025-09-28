import { useState } from "react";
// Optimized individual icon imports to reduce bundle size
import Eye from "lucide-react/dist/esm/icons/eye";
import EyeOff from "lucide-react/dist/esm/icons/eye-off";
import Mail from "lucide-react/dist/esm/icons/mail";
import Lock from "lucide-react/dist/esm/icons/lock";
import LogIn from "lucide-react/dist/esm/icons/log-in";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Check from "lucide-react/dist/esm/icons/check";
import X from "lucide-react/dist/esm/icons/x";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/Components/ui/input";
import Button from "@/Components/ui/button";
import { login as authLogin } from "@/store/authSlice";
import { useForm } from "react-hook-form";
import authService from "@/appwrite/auth";
import { useDispatch } from "react-redux";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {register, handleSubmit, watch} = useForm();
  const [error, setError] = useState("")
  
  // Check for success message from password reset
  const successMessage = location.state?.message;

  // Watch password field
  const password = watch("password");

  const login = async (data) =>{
    try {
      setIsLoading(true);
      setError("");
      setShowResendButton(false);
        const session = await authService.login(data)
        if (session){
        const userData = await authService.getCurrentUser()
        if (userData){
            // Check if email is verified
            const isVerified = await authService.isEmailVerified();
            
            if (!isVerified) {
                setError("Please verify your email before logging in. Check your inbox for the verification link.");
                setShowResendButton(true);
                // Logout the session since email is not verified
                await authService.logout();
                return;
            }
            
            // Email is verified, proceed with login
            dispatch(authLogin({userData}));
            navigate("/home")
        }
    }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Invalid Credentials!");
    } finally {
      setIsLoading(false);
    }
  }

  const resendVerification = async () => {
    try {
      setIsResending(true);
      await authService.sendVerificationEmail();
      setError("Verification email sent! Please check your inbox.");
      setShowResendButton(false);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to send verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    
    if (!forgotPasswordEmail) {
      setForgotPasswordError('Email is required');
      return;
    }

    setIsSendingRecovery(true);
    try {
      await authService.sendPasswordRecovery(forgotPasswordEmail);
      setRecoveryEmailSent(true);
      setForgotPasswordEmail('');
      
      // Hide success message after 5 seconds
      setTimeout(() => setRecoveryEmailSent(false), 5000);
    } catch (error) {
      setForgotPasswordError(error.message || 'Failed to send recovery email');
    } finally {
      setIsSendingRecovery(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-500
to-purple-500 dark:from-gray-900 dark:to-purple-900 p-4 px-8 rounded-xl ">
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl bg-slate-800/50 shadow-2xl backdrop-blur-lg md:grid-cols-2">
        <div className="relative hidden items-center justify-center overflow-hidden rounded-l-2xl bg-gradient-to-br from-purple-600 to-pink-600 md:flex">
          <div className="z-10 text-center text-white">
            <h2 className="text-4xl font-bold">Welcome Back!</h2>
            <p className="mt-2 max-w-xs">
              Sign in to access your account and continue your journey.
            </p>
          </div>
          <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-white/10"></div>
          <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-white/10"></div>
        </div>
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Success message from password reset */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400">
                {successMessage}
              </span>
            </div>
          )}

          {!showForgotPassword ? (
            // Login Form
            <>
              <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4">
            <div className="relative">
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-slate-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="username@example.com"
                  className="pl-10"
                  {...register("email", { required: true,
                    validate: {
                      matchPattern : (value) => {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return emailPattern.test(value) || "Invalid email format";
                      }
                    }
                   })}
                  />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-slate-400">
                Password (minimum 8 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("password", { required: true, minLength: 8 })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="group mt-4"
              disabled={!password || password.length < 8 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm font-medium text-purple-400 hover:text-purple-300 underline hover:no-underline transition-all duration-200 block mx-auto"
            >
              Forgot password?
            </button>
          </div>
          {error && <div className="mt-6 text-center">
            <p className="text-sm text-red-600 font-semibold">{error}</p>
            {showResendButton && (
              <Button 
                type="button" 
                variant="outline" 
                className="mt-3 w-full"
                onClick={resendVerification}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            )}
          </div>}
          </>
          ) : (
            // Forgot Password Form
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                <p className="text-slate-400">
                  Enter your email to receive a password reset link
                </p>
              </div>

              {recoveryEmailSent && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Recovery email sent! Check your inbox for further instructions.
                  </span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                <div className="relative">
                  <label
                    htmlFor="resetEmail"
                    className="mb-2 block text-sm text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                  </div>
                  {forgotPasswordError && (
                    <p className="text-sm text-red-500 mt-1">{forgotPasswordError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSendingRecovery}
                  className="group mt-4"
                >
                  {isSendingRecovery ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Recovery Email...
                    </>
                  ) : (
                    <>
                      Send Recovery Email
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordError('');
                    setRecoveryEmailSent(false);
                    setForgotPasswordEmail('');
                  }}
                  className="text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
