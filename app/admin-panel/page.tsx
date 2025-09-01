"use client"

import AdminPanelScreen from "@/app/components/admin-panel-screen"
import { User } from "@/app/lib/database"
import { useState, useEffect } from "react"
import { authFunctions } from "@/app/lib/database"
import { useRouter } from "next/navigation"
import SplashScreen from "@/app/components/splash-screen"

export default function AdminPanelPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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

  if (loading) {
    return <SplashScreen />
  }

  if (!user) {
    return null // Should redirect by now
  }

  return <AdminPanelScreen user={user} onUserUpdate={setUser} />
}
