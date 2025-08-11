"use client"

import AuthScreen from "@/app/components/auth-screen"
import { User } from "@/app/lib/database"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = (user: User) => {
    // Redirect to home page after successful login
    router.push("/")
  }

  return <AuthScreen onLoginSuccess={handleLoginSuccess} />
}
