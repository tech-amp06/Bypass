import { useState } from "react";
import { useForm } from "react-hook-form";
import { verifyUser } from "../apis/authUser";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const verifyCredentials = async (credentials) => {
    const response = await verifyUser(credentials);

    if (response) {
      localStorage.setItem('username', response.user_name);
      localStorage.setItem('token', response.token);
      navigate('/home');
    } else {
      toast.error("Incorrect credentials!");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl">
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900">
            Bypass
        </h1>
        <p className="mt-4 text-center text-2xl sm:text-2xl font-bold text-green-700">
        {isSignup ? "Sign Up" : "Login"}
        </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(async (credentials) => {
          verifyCredentials(credentials);
        })}>
          <div>
            <label className="block text-gray-600 mb-2 text-sm">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('email')}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2 text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('password')}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full transition duration-300"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>

          {/* Forgot Password (Login only) */}
          {!isSignup && (
            <p className="text-center text-sm text-blue-600 hover:underline cursor-pointer">
              Forgot Password?
            </p>
          )}

          {/* Toggle Signup/Login */}
          <p className="text-center text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 font-semibold ml-1 cursor-pointer hover:underline"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </span>
          </p>

        </form>
      </div>

      <ToastContainer autoClose={2000} position="top-right" className="toast-container"  />
    </div>
  );
}

export default Auth;