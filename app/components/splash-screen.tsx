"use client"

import { useEffect, useState } from "react"
import { Gift, Sparkles } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    // Show logo animation
    const logoTimer = setTimeout(() => {
      setShowLogo(true)
    }, 500)

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => {
      clearTimeout(logoTimer)
      clearInterval(progressTimer)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full animate-bounce"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo */}
        <div className={`transition-all duration-1000 ${showLogo ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <Gift className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
            </div>
          </div>
        </div>

        {/* App Name */}
        <div
          className={`text-center transition-all duration-1000 delay-500 ${
            showLogo ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-bold text-white mb-2">AMAC Investment</h1>
          <p className="text-xl text-blue-100">আপনার স্বপ্নের বিনিয়োগ</p>
        </div>

        {/* Loading Progress */}
        <div
          className={`w-64 transition-all duration-1000 delay-1000 ${
            showLogo ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center mt-4 text-white/80 text-sm">লোড হচ্ছে... {progress}%</div>
        </div>

        {/* Features */}
        <div
          className={`text-center space-y-2 transition-all duration-1000 delay-1500 ${
            showLogo ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="text-white/60 text-sm">✨ দৈনিক রিটার্ন • 🎁 বোনাস সিস্টেম • 🔒 নিরাপদ বিনিয়োগ</div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 text-center text-white/40 text-xs">
        © 2024 AMAC Investment. All rights reserved.
      </div>
    </div>
  )
}
