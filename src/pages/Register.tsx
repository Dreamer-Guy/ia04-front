import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';
type FormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function Register() {
    const { register, getValues, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
    const { register: signup, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const password = watch('password');


    const onSubmit = async (data: FormValues) => {
        setErrorMsg(null);
        try {
            await signup({
                name: data.name,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
            toast.success('Đăng ký thành công 🎉');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Create an Account
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Join us and start your journey today
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Name required" })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
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
                            {...register("password", {
                                required: "Password required",
                                minLength: { value: 3, message: "Minimum 3 characters" },
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm password",
                                validate: (val) => val === password || "Passwords do not match",
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Error message */}
                    {errorMsg && (
                        <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg border border-red-100">
                            {errorMsg}
                        </p>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl 
                   hover:bg-indigo-700 transition-all duration-200 font-semibold 
                   shadow-md hover:shadow-lg hover:cursor-pointer"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <span className="h-px w-16 bg-gray-300"></span>
                        <span className="text-gray-400 text-sm">or continue with</span>
                        <span className="h-px w-16 bg-gray-300"></span>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <a href="/login" className="text-indigo-600 hover:underline font-medium">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>

    );
}
