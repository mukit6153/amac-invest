"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Phone, Mail, Lock, Gift, CheckCircle, AlertCircle } from "lucide-react"
import { authFunctions } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"

interface AuthScreenProps {
  onAuthSuccess: (user: any, dailyBonus?: number) => void
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form states
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  })

  const { playSound } = useSound()

  // Clear messages when switching tabs
  useEffect(() => {
    setError("")
    setSuccess("")
  }, [activeTab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      playSound("click")

      const result = await authFunctions.signIn(loginData.phone, loginData.password)

      if (result.success && result.user) {
        playSound("success")
        setSuccess("সফলভাবে লগইন হয়েছে!")

        if (result.dailyBonus && result.dailyBonus > 0) {
          setSuccess(`সফলভাবে লগইন হয়েছে! ৳${result.dailyBonus} দৈনিক বোনাস পেয়েছেন!`)
        }

        setTimeout(() => {
          onAuthSuccess(result.user, result.dailyBonus)
        }, 1500)
      } else {
        playSound("error")
        setError(result.error || "লগইনে সমস্যা হয়েছে")
      }
    } catch (error: any) {
      playSound("error")
      setError(error.message || "লগইনে সমস্যা হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      playSound("click")

      // Validation
      if (!signupData.name || !signupData.phone || !signupData.email || !signupData.password) {
        throw new Error("সব তথ্য পূরণ করুন")
      }

      if (signupData.password !== signupData.confirmPassword) {
        throw new Error("পাসওয়ার্ড মিলছে না")
      }

      if (signupData.password.length < 6) {
        throw new Error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      }

      const result = await authFunctions.signUp({
        name: signupData.name,
        phone: signupData.phone,
        email: signupData.email,
        password: signupData.password,
        referralCode: signupData.referralCode || undefined,
      })

      if (result.success && result.user) {
        playSound("success")
        setSuccess("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম বোনাস পেয়েছেন!")

        setTimeout(() => {
          onAuthSuccess(result.user)
        }, 2000)
      } else {
        playSound("error")
        setError(result.error || "অ্যাকাউন্ট তৈরিতে সমস্যা হয়েছে")
      }
    } catch (error: any) {
      playSound("error")
      setError(error.message || "অ্যাকাউন্ট তৈরিতে সমস্যা হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AMAC Investment
          </CardTitle>
          <CardDescription>আপনার বিনিয়োগ যাত্রা শুরু করুন</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">লগইন</TabsTrigger>
              <TabsTrigger value="signup">সাইন আপ</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-phone">ফোন নম্বর</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={loginData.phone}
                      onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">পাসওয়ার্ড</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="আপনার পাসওয়ার্ড"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">পূর্ণ নাম</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="আপনার পূর্ণ নাম"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">ফোন নম্বর</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">ইমেইল</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">পাসওয়ার্ড নিশ্চিত করুন</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-referral">রেফারেল কোড (ঐচ্ছিক)</Label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-referral"
                      type="text"
                      placeholder="রেফারেল কোড থাকলে লিখুন"
                      value={signupData.referralCode}
                      onChange={(e) => setSignupData({ ...signupData, referralCode: e.target.value.toUpperCase() })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Error Alert */}
          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600 mb-4">কেন AMAC বেছে নিবেন?</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>দৈনিক রিটার্ন</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>তাৎক্ষণিক উইথড্র</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>রেফারেল বোনাস</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>২৪/৭ সাপোর্ট</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
