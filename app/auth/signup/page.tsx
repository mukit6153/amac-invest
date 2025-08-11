"use client"

import AuthScreen from "@/app/components/auth-screen"
import { User } from "@/app/lib/database"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()

  const handleSignupSuccess = (user: User) => {
    // Redirect to home page after successful signup
    router.push("/")
  }

  return <AuthScreen onSignupSuccess={handleSignupSuccess} />
}
