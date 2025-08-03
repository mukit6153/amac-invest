"use client"

import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10">
        {/* Logo Container */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            animate ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 rotate-12"
          }`}
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-4">
            <img src="/amac-logo.svg" alt="AMAC Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Company Name */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-bold text-white mb-2">AMAC</h1>
          <p className="text-xl text-blue-100 mb-8">Investment Platform</p>
        </div>

        {/* Tagline in Bangla */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-lg text-blue-200 mb-8 bangla-text">আপনার বিনিয়োগের নিরাপদ সঙ্গী</p>
        </div>

        {/* Loading Animation */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-blue-200 mt-4 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  )
}
