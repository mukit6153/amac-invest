"use client"

import { useState, useEffect } from "react"
import SplashScreen from "./components/splash-screen"
import AuthScreen from "./components/auth-screen"
import CompleteHomeScreen from "./components/complete-home-screen"
import { type User, authFunctions, subscribeToUserUpdates } from "./lib/database"
import { useSound } from "./hooks/use-sound"
import { useBackgroundMusic } from "./hooks/use-background-music"
import React from "react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const soundHook = useSound()
  const musicHook = useBackgroundMusic()

  const playSound = soundHook.playSound
  const isPlaying = musicHook.isPlaying
  const toggleMusic = musicHook.toggleMusic
  const playMusic = musicHook.playMusic
  const stopMusic = musicHook.stopMusic

  useEffect(() => {
    const checkUser = async () => {
      const storedUserId = localStorage.getItem("currentUserId")
      if (storedUserId) {
        try {
          const fetchedUser = await authFunctions.getCurrentUser(storedUserId)
          if (fetchedUser) {
            setUser(fetchedUser)
          } else {
            localStorage.removeItem("currentUserId")
          }
        } catch (error) {
          console.error("Failed to fetch user:", error)
          localStorage.removeItem("currentUserId")
        }
      }
      setIsLoading(false)
    }

    checkUser()
  }, [])

  useEffect(() => {
    if (user?.id) {
      const channel = subscribeToUserUpdates(user.id, (payload) => {
        if (payload.new) {
          setUser(payload.new as User)
        }
      })
      return () => {
        channel.unsubscribe()
      }
    }
  }, [user?.id])

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser)
    localStorage.setItem("currentUserId", loggedInUser.id)
    playSound("success")
    playMusic("peaceful")
  }

  const handleLogout = async () => {
    await authFunctions.signOut()
    setUser(null)
    localStorage.removeItem("currentUserId")
    playSound("click")
    stopMusic()
  }

  if (isLoading) {
    return React.createElement(SplashScreen)
  }

  if (!user) {
    return React.createElement(AuthScreen, { onLoginSuccess: handleLoginSuccess })
  }

  return React.createElement(CompleteHomeScreen, {
    user: user,
    onUserUpdate: setUser,
    onLogout: handleLogout,
    isMusicPlaying: isPlaying,
    toggleMusic: toggleMusic,
  })
}
