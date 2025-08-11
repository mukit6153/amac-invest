'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function SplashScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 dark:from-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center space-y-4"
      >
        <Image
          src="/amac-logo.svg"
          alt="AMAC Investment App Logo"
          width={150}
          height={150}
          className="drop-shadow-lg"
        />
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          className="text-4xl font-bold text-white text-shadow-md"
        >
          AMAC Investment
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
          className="text-lg text-white/90 text-shadow-sm"
        >
          Your Path to Financial Growth
        </motion.p>
      </motion.div>
    </div>
  )
}
