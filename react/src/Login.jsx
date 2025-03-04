import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "./axios.client";
import { useStateContext } from "./context/ContextProvider";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { setUser, setToken } = useStateContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const { data } = await axiosClient.post("/login", payload);
            setUser(data.user);
            setToken(data.token);
        } catch (err) {
            console.error("Login error:", err);
            const message =
                err.response?.data?.message || "Invalid credentials";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-green-600 px-6 py-6">
                <h2 className="text-xl font-bold text-white text-center">
                    Sign in to your account
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isLoading
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        } transition duration-150`}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-green-600 hover:text-green-500"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
