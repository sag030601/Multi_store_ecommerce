"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res.error) setError(res.error);
    else router.push("/");
  };

  const handleGoogleSignIn = () => {
    // redirects automatically to Google sign-in
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-6 py-10">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">Sign in to your account to continue</p>

        {error && <div className="bg-red-100 text-red-700 text-center py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300">
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-gray-400">
          <span className="w-1/4 border-b border-gray-300"></span>
          <span>OR</span>
          <span className="w-1/4 border-b border-gray-300"></span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-300 hover:bg-gray-50"
        >
          <FcGoogle size={26} />
          <span className="font-medium text-gray-700">Sign in with Google</span>
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account? <a href="/register" className="text-indigo-600 font-medium hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
