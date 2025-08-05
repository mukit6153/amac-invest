"use client"

import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-2">AMAC</h1>
        <p className="text-xl text-white/90 mb-2 bengali-text">ইনভেস্টমেন্ট</p>
        <p className="text-sm text-white/70 mb-8 bengali-text">নিরাপদ ও লাভজনক বিনিয়োগ</p>

        {/* Loading Animation */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}

        {/* Version */}
        <p className="text-xs text-white/50 mt-8">Version 1.0.0</p>
      </div>
    </div>
  )
}
