"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Phone, ArrowLeft, Gift, Flame } from "lucide-react"
import { authFunctions } from "../../lib/database"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDailyBonus, setShowDailyBonus] = useState(false)
  const [dailyBonus, setDailyBonus] = useState({ amount: 0, streak: 0 })

  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      router.push("/")
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.phone.trim()) {
      setError("ফোন নম্বর প্রয়োজন")
      return false
    }
    if (!formData.password.trim()) {
      setError("পাসওয়ার্ড প্রয়োজন")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const result = await authFunctions.signIn(formData.phone, formData.password)

      if (result.user) {
        // Get user data
        const userData = await authFunctions.getCurrentUser(result.user.id)

        // Store user data
        localStorage.setItem("user", JSON.stringify(userData))

        // Show daily bonus if applicable
        const today = new Date().toDateString()
        const lastLogin = new Date(userData.last_login).toDateString()

        if (lastLogin !== today) {
          const bonusAmount = Math.min(userData.login_streak * 10, 100)
          setDailyBonus({ amount: bonusAmount, streak: userData.login_streak })
          setShowDailyBonus(true)

          // Auto-hide bonus after 3 seconds and redirect
          setTimeout(() => {
            setShowDailyBonus(false)
            router.push("/")
          }, 3000)
        } else {
          // Direct redirect if no bonus
          router.push("/")
        }
      }
    } catch (error: any) {
      setError("ভুল ফোন নম্বর বা পাসওয়ার্ড")
    } finally {
      setLoading(false)
    }
  }

  // Daily Bonus Modal
  if (showDailyBonus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-xl border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">দৈনিক বোনাস!</h2>
            <div className="text-4xl font-bold mb-2">৳{dailyBonus.amount}</div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-300" />
              <span className="text-lg">{dailyBonus.streak} দিনের স্ট্রিক</span>
            </div>
            <p className="text-sm opacity-90">আপনার অ্যাকাউন্টে বোনাস যোগ করা হয়েছে</p>
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">AJ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AJBell</h1>
          <p className="text-gray-600">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">লগইন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="আপনার পাসওয়ার্ড"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>

              {/* Signup Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  নতুন ব্যবহারকারী?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/signup")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    অ্যাকাউন্ট তৈরি করুন
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            হোমে ফিরে যান
          </button>
        </div>
      </div>
    </div>
  )
}
