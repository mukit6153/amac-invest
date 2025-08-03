"use client"

import { useState, useEffect } from "react"
import SplashScreen from "./components/splash-screen"
import AuthScreen from "./components/auth-screen"
import CompleteHomeScreen from "./components/complete-home-screen"
import type { User } from "./lib/database"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"splash" | "auth" | "home">("splash")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setCurrentScreen("home")
    } else {
      // Show splash screen for 3 seconds
      const timer = setTimeout(() => {
        setCurrentScreen("auth")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAuthSuccess = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setCurrentScreen("home")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
    setCurrentScreen("auth")
  }

  if (currentScreen === "splash") {
    return <SplashScreen />
  }

  if (currentScreen === "auth") {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />
  }

  return <CompleteHomeScreen user={user} />
}
