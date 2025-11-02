// src/pages/Login.tsx
import React from 'react';
import { set, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';
type FormValues = { email: string; password: string };

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const onSubmit = async (data: FormValues) => {
        setErrorMsg(null);
        try {
            await login(data);
            toast.success('Login successful 🎉');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err: any) {
            console.log("Login error:", err);
            toast.error(err?.response?.data?.message || err?.message);
            setErrorMsg(err?.response?.data?.message || err?.message);
        }
    };

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password required',
                                minLength: { value: 3, message: 'Min length 6' },
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Error Message */}
                    {errorMsg && (
                        <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg">
                            {errorMsg}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg 
                                   hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:cursor-pointer"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Don’t have an account?{' '}
                        <a
                            href="/register"
                            className="text-indigo-600 hover:underline font-medium"
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>

    );
}
