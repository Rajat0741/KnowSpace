
import { useState } from "react";
// Optimized individual icon imports to reduce bundle size
import Eye from "lucide-react/dist/esm/icons/eye";
import EyeOff from "lucide-react/dist/esm/icons/eye-off";
import Mail from "lucide-react/dist/esm/icons/mail";
import Lock from "lucide-react/dist/esm/icons/lock";
import User from "lucide-react/dist/esm/icons/user";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/Components/ui/input";
import Button from "@/Components/ui/button";
import { useForm } from "react-hook-form";
import authService from "@/appwrite/auth";
import { toast } from "sonner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Watch password and confirmPassword fields
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const signup = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      const userData = await authService.createAccount(data);
      console.log("User data after signup:", userData);
      if (userData) {
        // Account created successfully and verification email sent
        toast.success("Account created! Please check your email to verify your account before logging in.");
        navigate("/");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-500
to-purple-500 dark:from-gray-900 dark:to-purple-900 p-4 px-8 rounded-xl ">
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl bg-slate-800/50 shadow-2xl backdrop-blur-lg md:grid-cols-2">
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400">Join us today and start your journey</p>
          </div>

          <form onSubmit={handleSubmit(signup)} className="flex flex-col gap-4">
            <div className="relative">
              <label
                htmlFor="name"
                className="mb-2 block text-sm text-slate-400"
              >
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 bg-white dark:bg-slate-800 text-black dark:text-white"
                  {...register("name", {required: true})}
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-slate-400"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="username@example.com"
                  className="pl-10 pr-10 bg-white text-black dark:bg-slate-800 dark:text-white"
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
                className="mb-2 block text-sm text-slate-400"
              >
                Password (minimum 8 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white text-black dark:bg-slate-800 dark:text-white"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
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

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm text-slate-400"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white text-black dark:bg-slate-800 dark:text-white"
                  {...register("confirmPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? (
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
              disabled={
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                password.length < 8 ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Password error message */}
                {typeof errors !== 'undefined' && errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-semibold">
                    {error}
                  </p>
                )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-purple-400 hover:text-purple-300"
              >
                Sign in
              </Link>
            </p>
            {error && <p className="text-sm text-red-600 font-semibold mt-2">{error}</p>}
          </div>


        </div>
        <div className="relative hidden items-center justify-center overflow-hidden rounded-r-2xl bg-gradient-to-br from-purple-400 to-red-400 dark:from-purple-500 dark:to-red-500 md:flex">
          <div className="z-10 text-center text-white">
            <h2 className="text-4xl font-bold">Welcome Aboard!</h2>
            <p className="mt-2 max-w-xs">
              Unlock a world of features by creating your account.
            </p>
          </div>
          <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-white/10"></div>
          <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-white/10"></div>
        </div>
      </div>
    </div>
  );
}

