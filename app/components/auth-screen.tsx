"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Flag, AlertTriangle } from "lucide-react"

interface AuthScreenProps {
  onLogin: (userData: any) => void
  onSignup: (userData: any) => void
}

export default function AuthScreen({ onLogin, onSignup }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "+880",
    walletPin: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    rememberMe: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const userData = {
      name: isLogin ? "Rakib" : formData.fullName.split(" ")[0] || "User",
      phone: formData.phone,
      balance: 2500,
      bonusBalance: 150,
      lockedBalance: 800,
      hasInvested: true,
      dailyEarning: 85,
      loginStreak: 3,
    }

    if (isLogin) {
      onLogin(userData)
    } else {
      onSignup(userData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 p-2">
            <img src="/amac-logo.svg" alt="AMAC Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AMAC</h1>
          <p className="text-gray-600">বিনিয়োগ প্ল্যাটফর্ম</p>
        </div>

        {!isLogin && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Flag className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">🇧🇩 আপনি বাংলাদেশ থেকে আমাদের সাথে আছেন</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{isLogin ? "লগইন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">পূর্ণ নাম *</Label>
                <Input
                  id="fullName"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">ফোন নম্বর {!isLogin && "*"}</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <span className="text-lg">🇧🇩</span>
                </div>
                <Input
                  id="phone"
                  placeholder="+880 1712345678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-16"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="walletPin">৪ সংখ্যার ওয়ালেট পিন *</Label>
                <Input
                  id="walletPin"
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  value={formData.walletPin}
                  onChange={(e) => handleInputChange("walletPin", e.target.value)}
                />
                <p className="text-xs text-gray-500">দ্রুত লেনদেনের জন্য ব্যবহৃত হবে</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{isLogin ? "পাসওয়ার্ড" : "৬ সংখ্যার অ্যাকাউন্ট পাসওয়ার্ড *"}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  maxLength={6}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••"
                      maxLength={6}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralCode">রেফারেল কোড (ঐচ্ছিক)</Label>
                  <Input
                    id="referralCode"
                    placeholder="রেফারেল কোড থাকলে লিখুন"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange("referralCode", e.target.value)}
                  />
                </div>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    পাসওয়ার্ড মনে রাখবেন - এটি আপনার অ্যাকাউন্ট সুরক্ষার জন্য গুরুত্বপূর্ণ
                  </AlertDescription>
                </Alert>
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    আমাকে মনে রাখুন
                  </Label>
                </div>
                <button className="text-sm text-blue-600 hover:underline">পাসওয়ার্ড ভুলে গেছেন?</button>
              </div>
            )}

            <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleSubmit}>
              {isLogin ? "লগইন করুন" : "অ্যাকাউন্ট তৈরি করুন"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "নতুন ব্যবহারকারী? " : "ইতিমধ্যে অ্যাকাউন্ট আছে? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
                  {isLogin ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {isLogin && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">এই ডিভাইস থেকে পরবর্তী লগইন স্বয়ংক্রিয় হবে</p>
          </div>
        )}
      </div>
    </div>
  )
}
