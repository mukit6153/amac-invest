"use client"

import { useState, useEffect } from "react"
import SplashScreen from "./components/splash-screen"
import AuthScreen from "./components/auth-screen"
import CompleteHomeScreen from "./components/complete-home-screen"
import InvestmentScreen from "./components/investment-screen"
import type { User } from "./lib/database"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"splash" | "auth" | "home" | "investment">("splash")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("amac_user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setCurrentScreen("home")
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("amac_user")
      }
    }

    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!savedUser) {
        setCurrentScreen("auth")
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("amac_user", JSON.stringify(userData))
    setCurrentScreen("home")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("amac_user")
    setCurrentScreen("auth")
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("amac_user", JSON.stringify(updatedUser))
  }

  const handleNavigateToInvestment = () => {
    setCurrentScreen("investment")
  }

  const handleBackToHome = () => {
    setCurrentScreen("home")
  }

  if (currentScreen === "splash" || isLoading) {
    return <SplashScreen />
  }

  if (currentScreen === "auth") {
    return <AuthScreen onLogin={handleLogin} />
  }

  if (currentScreen === "investment" && user) {
    return (
      <InvestmentScreen 
        user={user} 
        onBack={handleBackToHome}
        onUserUpdate={handleUserUpdate}
      />
    )
  }

  if (currentScreen === "home" && user) {
    return (
      <CompleteHomeScreen
        user={user}
        onLogout={handleLogout}
        onUserUpdate={handleUserUpdate}
        onNavigateToInvestment={handleNavigateToInvestment}
      />
    )
  }

  return <AuthScreen onLogin={handleLogin} />
}
