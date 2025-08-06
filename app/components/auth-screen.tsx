"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Phone, Lock, User, Mail, Users } from 'lucide-react'
import { signIn, signUp, type User } from "../lib/database"
import { useSound } from "../hooks/use-sound"
import SoundButton from "./sound-button"

interface AuthScreenProps {
  onLogin: (user: User) => void
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  })

  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  })

  const { playSound } = useSound()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      playSound("click")
      
      // Demo login check
      if (loginData.phone === "01700000000" && loginData.password === "password123") {
        const demoUser: User = {
          id: "demo-user-1",
          name: "ডেমো ইউজার",
          phone: "01700000000",
          email: "demo@amac.com",
          balance: 5000,
          invested: 2000,
          earned: 500,
          referralCode: "AMCDEMO123",
          joinDate: new Date().toISOString(),
        }
        
        playSound("success")
        onLogin(demoUser)
        return
      }

      const result = await signIn(loginData.phone, loginData.password)
      
      if (result.success && result.user) {
        playSound("success")
        onLogin(result.user)
      } else {
        playSound("error")
        setError(result.error || "লগইন ব্যর্থ হয়েছে")
      }
    } catch (error) {
      playSound("error")
      setError("লগইন করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না")
      setLoading(false)
      playSound("error")
      return
    }

    if (registerData.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      setLoading(false)
      playSound("error")
      return
    }

    try {
      playSound("click")
      
      const result = await signUp({
        name: registerData.name,
        phone: registerData.phone,
        email: registerData.email,
        password: registerData.password,
        referralCode: registerData.referralCode,
      })

      if (result.success && result.user) {
        playSound("success")
        onLogin(result.user)
      } else {
        playSound("error")
        setError(result.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে")
      }
    } catch (error) {
      playSound("error")
      setError("রেজিস্ট্রেশন করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const fillDemoData = () => {
    setLoginData({
      phone: "01700000000",
      password: "password123",
    })
    playSound("click")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <CardTitle className="text-2xl bengali-text">AMAC ইনভেস্টমেন্ট</CardTitle>
          <p className="text-gray-600 bengali-text">আপনার বিনিয়োগ যাত্রা শুরু করুন</p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="bengali-text">লগইন</TabsTrigger>
              <TabsTrigger value="register" className="bengali-text">রেজিস্ট্রেশন</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="bengali-text">ফোন নম্বর</Label>
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
                  <Label htmlFor="password" className="bengali-text">পাসওয়ার্ড</Label>
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
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm bengali-text">{error}</p>
                  </div>
                )}

                <SoundButton
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 bengali-text"
                  disabled={loading}
                  soundType="success"
                >
                  {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </SoundButton>

                <SoundButton
                  type="button"
                  variant="outline"
                  className="w-full bengali-text"
                  onClick={fillDemoData}
                  soundType="click"
                >
                  ডেমো ডেটা ব্যবহার করুন
                </SoundButton>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="bengali-text">পূর্ণ নাম</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                  <Label htmlFor="reg-phone" className="bengali-text">ফোন নম্বর</Label>
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
                  <Label htmlFor="email" className="bengali-text">ইমেইল</Label>
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
                  <Label htmlFor="reg-password" className="bengali-text">পাসওয়ার্ড</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড লিখুন"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
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

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="bengali-text">পাসওয়ার্ড নিশ্চিত করুন</Label>
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
                  <Label htmlFor="referral" className="bengali-text">রেফারেল কোড (ঐচ্ছিক)</Label>
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
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm bengali-text">{error}</p>
                  </div>
                )}

                <SoundButton
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 bengali-text"
                  disabled={loading}
                  soundType="success"
                >
                  {loading ? "রেজিস্ট্রেশন হচ্ছে..." : "রেজিস্ট্রেশন করুন"}
                </SoundButton>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-500 bengali-text">
              রেজিস্ট্রেশন করে আপনি আমাদের{" "}
              <a href="#" className="text-blue-600 hover:underline">
                শর্তাবলী
              </a>{" "}
              এবং{" "}
              <a href="#" className="text-blue-600 hover:underline">
                গোপনীয়তা নীতি
              </a>{" "}
              মেনে নিচ্ছেন।
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
