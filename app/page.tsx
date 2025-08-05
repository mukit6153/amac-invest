"use client"

import { useState, useEffect } from "react"
import SplashScreen from "./components/splash-screen"
import AuthScreen from "./components/auth-screen"
import CompleteHomeScreen from "./components/complete-home-screen"
import type { User } from "./lib/database"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"splash" | "auth" | "home">("splash")
  const [user, setUser] = useState<User | null>(null)
  const [dailyBonus, setDailyBonus] = useState(0)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("amac_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setCurrentScreen("home")
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("amac_user")
      }
    }

    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      if (!storedUser) {
        setCurrentScreen("auth")
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("amac_user", JSON.stringify(userData))

    // Check for daily bonus
    const lastBonusDate = localStorage.getItem("lastBonusDate")
    const today = new Date().toDateString()

    if (lastBonusDate !== today) {
      setDailyBonus(50) // Daily bonus amount
    }

    setCurrentScreen("home")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("amac_user")
    localStorage.removeItem("lastBonusDate")
    setCurrentScreen("auth")
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("amac_user", JSON.stringify(updatedUser))
  }

  if (currentScreen === "splash") {
    return <SplashScreen />
  }

  if (currentScreen === "auth") {
    return <AuthScreen onLogin={handleLogin} />
  }

  if (currentScreen === "home" && user) {
    return (
      <CompleteHomeScreen user={user} dailyBonus={dailyBonus} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
    )
  }

  return <SplashScreen />
}
