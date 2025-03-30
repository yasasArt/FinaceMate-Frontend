import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { User, Mail, Lock, CheckCircle2 } from "lucide-react";
import axios from "axios";

const Signup = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!displayName || !email || !password || !passwordConfirm) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agree) {
      toast.error("Please agree to Terms & Privacy Policy");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8088/api/v1/users/signup", {
        displayName,
        email,
        password,
        passwordConfirm,
      }, { withCredentials: false });

      if(response.data.status === "success") {
        toast.success("Account created successfully");
        navigate("/login");
      }

      toast.error("Signup failed");

    } catch (error) {
      console.log(error);
      toast.error("Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto flex items-center justify-center p-6">
        <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
          {/* Left Section - Signup Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-purple-700 mb-2">
                Create Account
              </h2>
              <p className="text-gray-500">
                Sign up to start managing your finances
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  displayName
                </label>
                <div className="flex items-center border rounded-lg">
                  <User className="ml-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="w-full px-4 py-3 pl-10 outline-none"
                    placeholder="Choose a displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                  Create Password
                </label>
                <div className="flex items-center border rounded-lg">
                  <Lock className="ml-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    className="w-full px-4 py-3 pl-10 outline-none"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="flex items-center border rounded-lg">
                  <Lock className="ml-3 text-gray-400" size={20} />
                  <input
                    type="password"
                    className="w-full px-4 py-3 pl-10 outline-none"
                    placeholder="Confirm your password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agree"
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                />
                <label
                  htmlFor="agree"
                  className="text-sm text-gray-600 flex items-center"
                >
                  <CheckCircle2
                    className={`mr-2 ${
                      agree ? "text-purple-600" : "text-gray-300"
                    }`}
                    size={20}
                  />
                  I agree to the{" "}
                  <a href="/terms" className="text-purple-600 ml-1 hover:underline">
                    Terms
                  </a>{" "}
                  &{" "}
                  <a href="/privacy" className="text-purple-600 ml-1 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/" className="text-purple-600 hover:underline font-semibold">
                  Sign in
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

export default Signup;