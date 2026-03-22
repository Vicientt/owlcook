import { useNavigate } from "react-router";
import { Mail, Lock, ChefHat } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Footer } from "../components/Footer";
import loginService from "../services/login";
import foodService from "../services/food";
import userService from "../services/user";

import { useState } from 'react'
export default function Login() {
  const navigate = useNavigate();
  
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleLogin = async () => {
    try {
      if(email === '' || password === ''){
        setMessage({ type: 'error', text: 'Please fill in all fields!' })
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 5000)
        return
      }

      const response = await loginService.login({ email, password })
      window.localStorage.setItem("UserInformation", JSON.stringify(response))
      foodService.setToken(response.token)
      userService.setToken(response.token)
      navigate("/dashboard")
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Invalid email or password"
      setMessage({ type: 'error', text: errorMsg })
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 5000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#5A3DA3] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#0D9488] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#D97706] rounded-full opacity-15 blur-3xl"></div>
      
      <div className="w-full max-w-md">
        {/* Login form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-[#432C91] via-[#5A3DA3] to-[#0D9488] p-4 rounded-2xl">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl text-center mb-2" style={{ fontWeight: 800 }}>OwlCook</h1>
          <p className="text-center text-gray-600 mb-6">Sign in to start cooking</p>

          {message.text && (
            <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${
              message.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="your.email@college.edu"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-[#432C91] bg-white"
                  value={email}
                  onChange={(event) => SetEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-[#432C91] bg-white"
                  value={password}
                  onChange={(event) => SetPassword(event.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#432C91] via-[#0D9488] to-[#D97706] hover:from-[#362470] hover:via-[#0F766E] hover:to-[#B45309] text-white" 
              style={{ fontWeight: 700 }}
            >
              Login
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Button 
              onClick={() => navigate("/signup")}
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700" 
              style={{ fontWeight: 600 }}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
