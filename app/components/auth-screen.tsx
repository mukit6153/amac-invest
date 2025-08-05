"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Phone, Lock, Mail, Users } from "lucide-react"
import { signIn, signUp } from "../lib/database"

interface AuthScreenProps {
  onLogin: (user: any) => void
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Demo account check
      if (loginData.phone === "01700000000" && loginData.password === "password123") {
        const demoUser = {
          id: "demo-user-1",
          name: "ডেমো ব্যবহারকারী",
          phone: "01700000000",
          email: "demo@amac.com",
          balance: 5000,
          invested: 10000,
          earned: 2500,
          referralCode: "AMCDEMO",
          joinDate: new Date().toISOString(),
        }
        onLogin(demoUser)
        return
      }

      const result = await signIn(loginData.phone, loginData.password)

      if (result.success && result.user) {
        onLogin(result.user)
      } else {
        setError(result.error || "লগইন ব্যর্থ হয়েছে")
      }
    } catch (error) {
      setError("লগইন করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না")
      setLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      setLoading(false)
      return
    }

    try {
      const result = await signUp({
        name: registerData.name,
        phone: registerData.phone,
        email: registerData.email,
        password: registerData.password,
        referralCode: registerData.referralCode,
      })

      if (result.success && result.user) {
        setSuccess("রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।")
        // Reset form
        setRegisterData({
          name: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
          referralCode: "",
        })
      } else {
        setError(result.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে")
      }
    } catch (error) {
      setError("রেজিস্ট্রেশন করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setLoginData({
      phone: "01700000000",
      password: "password123",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <CardTitle className="text-2xl bengali-text">AMAC ইনভেস্টমেন্ট</CardTitle>
          <p className="text-gray-600 bengali-text">আপনার বিনিয়োগ যাত্রা শুরু করুন</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="bengali-text">
                লগইন
              </TabsTrigger>
              <TabsTrigger value="register" className="bengali-text">
                রেজিস্ট্রেশন
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="bengali-text">
                    ফোন নম্বর
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
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
                  <Label htmlFor="password" className="bengali-text">
                    পাসওয়ার্ড
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড লিখুন"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="bengali-text">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bengali-text" disabled={loading}>
                  {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bengali-text bg-transparent"
                  onClick={fillDemoCredentials}
                >
                  ডেমো অ্যাকাউন্ট ব্যবহার করুন
                </Button>

                <div className="text-center text-sm text-gray-600 bengali-text">
                  <p>ডেমো: 01700000000 / password123</p>
                </div>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="bengali-text">
                    পূর্ণ নাম
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="আপনার নাম লিখুন"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone" className="bengali-text">
                    ফোন নম্বর
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="bengali-text">
                    ইমেইল
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="bengali-text">
                    পাসওয়ার্ড
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড লিখুন"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="bengali-text">
                    পাসওয়ার্ড নিশ্চিত করুন
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড আবার লিখুন"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral" className="bengali-text">
                    রেফারেল কোড (ঐচ্ছিক)
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="referral"
                      type="text"
                      placeholder="রেফারেল কোড লিখুন"
                      value={registerData.referralCode}
                      onChange={(e) => setRegisterData({ ...registerData, referralCode: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="bengali-text">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription className="bengali-text text-green-600">{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bengali-text" disabled={loading}>
                  {loading ? "রেজিস্ট্রেশন হচ্ছে..." : "রেজিস্ট্রেশন করুন"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
