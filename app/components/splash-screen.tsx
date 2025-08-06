"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8 text-center">
          {/* Logo */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-3xl font-bold text-white mb-2 bengali-text">AMAC</h1>
          <p className="text-white/80 text-lg mb-2 bengali-text">ইনভেস্টমেন্ট</p>
          <p className="text-white/60 text-sm mb-8 bengali-text">বাংলাদেশের নম্বর ১ বিনিয়োগ প্ল্যাটফর্ম</p>

          {/* Loading Animation */}
          <div className="space-y-4">
            <div className="loading-dots mx-auto">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-white/70 text-sm bengali-text">লোড হচ্ছে... {progress}%</p>
          </div>

          {/* Version */}
          <div className="mt-8 pt-4 border-t border-white/20">
            <p className="text-white/50 text-xs">Version 1.0.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
