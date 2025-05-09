import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; 
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import axios from "axios";
import {useCookies} from 'react-cookie';
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "./firebase"; 

const API_URL = import.meta.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [cookie, setCookie] = useCookies(["authToken"]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8088/api/v1/users/login`,
        { email, password },
        { withCredentials: true } // Allows cookies to be sent
      );

      console.log(`Login response: ${response.data.status}`);

      if (response.data.status === "success") {
        // Set authToken in cookies if login is successful
        setCookie("authToken", response.data.token, {
          path: "/",
          secure: false,
          sameSite: "Strict",
        });

        toast.success("Login successful");
        navigate("/");
      }

      toast.error("Invalid email or password");     

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({prompt: "select_account"});

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const result = await axios.post(
        `http://127.0.0.1:8088/api/v1/users/google`, 
        {
          uid : resultFromGoogle.user.uid,
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoURL: resultFromGoogle.user.photoURL,
        },
        { withCredentials: true } // Allows cookies to be sent
      );

      console.log(result);

      console.log(`Google login response: ${result.data.status}`);

      if (result.data.status === "success") {
        setCookie("authToken", result.data.token, {
          path: "/",
          secure: false,
          sameSite: "Strict",
        });
  
        toast.success("Login successful");
        navigate("/");
      }
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto flex items-center justify-center p-6">
        <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
          {/* Left Section - Login Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-purple-700 mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-500">
                Sign in to continue to MyFinanceMate
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center border rounded-lg">
                  <Mail className="ml-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    className="w-full px-4 py-3 pl-10 outline-none"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="flex items-center border rounded-lg">
                  <Lock className="ml-3 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pl-10 outline-none"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="keepLoggedIn"
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                    checked={keepLoggedIn}
                    onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                  />
                  <label
                    htmlFor="keepLoggedIn"
                    className="text-sm text-gray-600 flex items-center"
                  >
                    <CheckCircle2
                      className={`mr-2 ${
                        keepLoggedIn ? "text-purple-600" : "text-gray-300"
                      }`}
                      size={20}
                    />
                    Keep me signed in
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4">
                <hr className="w-1/4 border-gray-300" />
                <span className="text-gray-500">or</span>
                <hr className="w-1/4 border-gray-300" />
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 rounded-lg mt-6 hover:bg-gray-50 transition duration-300"
              >
                <FcGoogle className="text-[30px] mr-3" />
                Sign in with Google
              </button>

              <p className="mt-6 text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-600 hover:underline font-semibold">
                 Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Right Section - Decorative Image */}
          <div
            className="hidden md:block bg-cover bg-center"
            style={{
              backgroundImage: "url('/bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
