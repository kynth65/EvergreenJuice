import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "./axios.client";
import { useStateContext } from "./context/ContextProvider";
import { User, Mail, Lock, AlertCircle } from "lucide-react";

export default function Signup() {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser, setToken } = useStateContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Basic validation
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (passwordRef.current.value.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        const payload = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: confirmPasswordRef.current.value,
        };

        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((error) => {
                console.error("Signup error:", error);
                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "An error occurred during signup";
                setError(message);

                // If there are validation errors, show the first one
                if (error.response?.data?.errors) {
                    const firstError = Object.values(
                        error.response.data.errors
                    )[0];
                    setError(
                        Array.isArray(firstError) ? firstError[0] : firstError
                    );
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-green-600 px-6 py-6">
                <h2 className="text-xl font-bold text-white text-center">
                    Create Your Account
                </h2>
            </div>

            <div className="px-6 py-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                ref={usernameRef}
                                type="text"
                                id="username"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Your name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                ref={emailRef}
                                type="email"
                                id="email"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                ref={passwordRef}
                                type="password"
                                id="password"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Minimum 8 characters"
                                required
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 8 characters long
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                ref={confirmPasswordRef}
                                type="password"
                                id="confirmPassword"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Re-enter password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            loading
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        } transition duration-150`}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-green-600 hover:text-green-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
