"use client"

import SettingsScreen from "@/app/components/settings-screen"
import { User } from "@/app/lib/database"
import { useState, useEffect } from "react"
import { authFunctions } from "@/app/lib/database"
import { useRouter } from "next/navigation"
import SplashScreen from "@/app/components/splash-screen"
import { useSound } from "@/app/hooks/use-sound"
import { useBackgroundMusic } from "@/app/hooks/use-background-music"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { playSound } = useSound()
  const { isPlaying, toggleMusic, stopMusic } = useBackgroundMusic()

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = localStorage.getItem("currentUserId")
      if (storedUserId) {
        const fetchedUser = await authFunctions.getCurrentUser(storedUserId)
        if (fetchedUser) {
          setUser(fetchedUser)
        } else {
          router.replace("/auth/login")
        }
      } else {
        router.replace("/auth/login")
      }
      setLoading(false)
    }
    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await authFunctions.signOut()
    setUser(null)
    localStorage.removeItem("currentUserId")
    playSound("click")
    stopMusic()
    router.replace("/auth/login")
  }

  if (loading) {
    return <SplashScreen />
  }

  if (!user) {
    return null // Should redirect by now
  }

  return <SettingsScreen user={user} onUserUpdate={setUser} onLogout={handleLogout} isMusicPlaying={isPlaying} toggleMusic={toggleMusic} />
}
