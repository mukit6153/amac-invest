"use client"

import { useState, useEffect } from "react"
import SplashScreen from "./components/splash-screen"
import AuthScreen from "./components/auth-screen"
import CompleteHomeScreen from "./components/complete-home-screen"
import type { User } from "./lib/database"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"splash" | "auth" | "home">("splash")
  const [user, setUser] = useState<User | null>(null)
  const [dailyBonus, setDailyBonus] = useState<number>(0)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("amac_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setCurrentScreen("home")
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("amac_user")
      }
    }
  }, [])

  const handleSplashComplete = () => {
    if (user) {
      setCurrentScreen("home")
    } else {
      setCurrentScreen("auth")
    }
  }

  const handleAuthSuccess = (userData: User, bonus?: number) => {
    setUser(userData)
    setDailyBonus(bonus || 0)

    // Store user session
    localStorage.setItem("amac_user", JSON.stringify(userData))

    setCurrentScreen("home")
  }

  const handleLogout = () => {
    setUser(null)
    setDailyBonus(0)
    localStorage.removeItem("amac_user")
    setCurrentScreen("auth")
  }

  if (currentScreen === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (currentScreen === "auth") {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />
  }

  if (currentScreen === "home" && user) {
    return <CompleteHomeScreen user={user} dailyBonus={dailyBonus} onLogout={handleLogout} onUserUpdate={setUser} />
  }

  return <SplashScreen onComplete={handleSplashComplete} />
}
