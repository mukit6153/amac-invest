"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2 } from 'lucide-react'

export default function SplashScreen() {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true)
    }, 500) // Delay text appearance slightly after logo
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="animate-pulse">
          <Image
            src="/amac-logo.png"
            alt="AMAC Logo"
            width={120}
            height={120}
            priority
            className="drop-shadow-lg mb-6"
          />
        </div>
        {showText && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="mt-6 text-4xl font-extrabold text-center tracking-tight bangla-text"
          >
            এএমএসি ইনভেস্টমেন্ট
          </motion.h1>
        )}
        {showText && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="mt-2 text-lg text-center opacity-90 bangla-text"
          >
            আপনার বিনিয়োগের ভবিষ্যৎ
          </motion.p>
        )}
      </motion.div>
      <Loader2 className="h-10 w-10 animate-spin text-white" />
    </div>
  )
}
