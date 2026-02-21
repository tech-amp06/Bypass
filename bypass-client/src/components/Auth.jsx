import { useState } from "react";
import { useForm } from "react-hook-form";
import { verifyUser } from "../apis/verifyUser";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const verifyCredentials = async (credentials) => {
    const response = await verifyUser(credentials);

    if (response) {
      navigate('/home');
    } else {
      toast.error("Incorrect credentials!");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans">
      <div className="bg-white w-full max-w-md p-10 rounded-[2rem] border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <span className="text-white font-black text-2xl">B</span>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Bypass<span className="text-blue-600">.</span>
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            {isSignup ? "Create your medical account" : "Sign in to your dashboard"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(verifyCredentials)}>
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
              {...register('email')}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
              {...register('password')}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </button>

          <div className="flex flex-col gap-4 pt-2">
            {!isSignup && (
              <p className="text-center text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">
                Forgot Password?
              </p>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">Or continue with</span>
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 font-medium">
              {isSignup ? "Already have an account?" : "New to Bypass?"}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-600 font-bold ml-1 hover:underline underline-offset-4"
              >
                {isSignup ? "Sign In" : "Register Now"}
              </button>
            </p>
          </div>
        </form>
      </div>

      <ToastContainer autoClose={2000} position="top-right" />
    </div>
  );
}

export default Auth;