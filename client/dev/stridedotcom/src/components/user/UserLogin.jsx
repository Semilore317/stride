import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "@/store/features/authSlice.js";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { IoLogInOutline } from "react-icons/io5";

const UserLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    // Show error toast when error changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.email.trim() || !credentials.password.trim()) {
            toast.warning("Please fill in all fields.");
            return;
        }

        const resultAction = await dispatch(loginUser(credentials));
        if (loginUser.fulfilled.match(resultAction)) {
            toast.success("Login successful! Welcome back.");
            navigate("/");
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 text-black dark:bg-black dark:text-white transition-colors duration-300 flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-black/5 dark:border-white/10">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Sign in to continue shopping
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wide opacity-70">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                                placeholder="john.doe@example.com"
                                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold uppercase tracking-wide opacity-70">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2
                                ${loading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 hover:scale-[1.01] hover:shadow-xl"
                                }`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <IoLogInOutline size={24} />
                                    Sign In
                                </>
                            )}
                        </button>

                        {/* Register Link */}
                        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                            >
                                Create one
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default UserLogin;
