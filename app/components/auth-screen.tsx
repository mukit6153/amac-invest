"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, LogIn, UserPlus, Play, Shield, Eye, EyeOff } from "lucide-react"
import { authFunctions, type User } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"
import { useHaptic } from "@/app/hooks/use-haptic"
import Image from "next/image"

interface AuthScreenProps {
  onLoginSuccess?: (user: User) => void
  onSignupSuccess?: (user: User) => void
}

export default function AuthScreen({ onLoginSuccess, onSignupSuccess }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false)
  const [agreeToMarketing, setAgreeToMarketing] = useState(false)

  const { playSound } = useSound()
  const { hapticFeedback } = useHaptic()

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "পাসওয়ার্ডে অন্তত একটি বড় হাতের অক্ষর, ছোট হাতের অক্ষর এবং সংখ্যা থাকতে হবে"
    }
    return null
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    hapticFeedback("click")
    setLoading(true)
    setError(null)

    if (!validateEmail(loginEmail)) {
      setError("সঠিক ইমেল ঠিকানা দিন")
      setLoading(false)
      playSound("error")
      hapticFeedback("error")
      return
    }

    try {
      const user = await authFunctions.signIn(loginEmail, loginPassword)
      if (user) {
        playSound("success")
        hapticFeedback("success")
        onLoginSuccess?.(user)
      } else {
        setError("ভুল ইমেল বা পাসওয়ার্ড।")
        playSound("error")
        hapticFeedback("error")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "লগইন ব্যর্থ হয়েছে।")
      playSound("error")
      hapticFeedback("error")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    playSound("click")
    hapticFeedback("click")
    setLoading(true)
    setError(null)
    try {
      const user = await authFunctions.handleDemoLogin()
      if (user) {
        playSound("success")
        hapticFeedback("success")
        onLoginSuccess?.(user)
      } else {
        setError("ডেমো লগইন ব্যর্থ হয়েছে।")
        playSound("error")
        hapticFeedback("error")
      }
    } catch (err: any) {
      console.error("Demo login error:", err)
      setError(err.message || "ডেমো লগইন ব্যর্থ হয়েছে।")
      playSound("error")
      hapticFeedback("error")
    } finally {
      setLoading(false)
    }
  }

  const handleSuperAdminLogin = async () => {
    playSound("click")
    hapticFeedback("click")
    setLoading(true)
    setError(null)
    try {
      const user = await authFunctions.signIn("superadmin@ajbell.com", "superadmin123")
      if (user) {
        playSound("success")
        hapticFeedback("success")
        onLoginSuccess?.(user)
      } else {
        setError("সুপার অ্যাডমিন লগইন ব্যর্থ হয়েছে।")
        playSound("error")
        hapticFeedback("error")
      }
    } catch (err: any) {
      console.error("Super admin login error:", err)
      setError(err.message || "সুপার অ্যাডমিন লগইন ব্যর্থ হয়েছে।")
      playSound("error")
      hapticFeedback("error")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    hapticFeedback("click")
    setLoading(true)
    setError(null)

    if (!signupName.trim()) {
      setError("নাম দিতে হবে")
      setLoading(false)
      playSound("error")
      hapticFeedback("error")
      return
    }

    if (!validateEmail(signupEmail)) {
      setError("সঠিক ইমেল ঠিকানা দিন")
      setLoading(false)
      playSound("error")
      hapticFeedback("error")
      return
    }

    const passwordError = validatePassword(signupPassword)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      playSound("error")
      hapticFeedback("error")
      return
    }

    if (signupPassword !== confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না")
      setLoading(false)
      playSound("error")
      hapticFeedback("error")
      return
    }

    if (!agreeToTerms) {
      setError("শর্তাবলী মেনে নিতে হবে")
      setLoading(false)
      playSound("error")
      hapticFeedback("error")
      return
    }

    if (!agreeToPrivacy) {
      setError("গোপনীয়তা নীতি মেনে নিতে হবে")
      setLoading(false)
      playSound("error")
      hapticFeedback("error")
      return
    }

    try {
      const user = await authFunctions.signUp(signupName, signupEmail, signupPassword)
      if (user) {
        playSound("success")
        hapticFeedback("success")
        onSignupSuccess?.(user)
      } else {
        setError("সাইনআপ ব্যর্থ হয়েছে।")
        playSound("error")
        hapticFeedback("error")
      }
    } catch (err: any) {
      console.error("Sign up error:", err)
      setError(err.message || "সাইনআপ ব্যর্থ হয়েছে।")
      playSound("error")
      hapticFeedback("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <CardHeader className="text-center">
          <Image src="/amac-investment-logo.png" alt="AMAC Logo" width={80} height={80} className="mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold bangla-text">এএমএসি ইনভেস্টমেন্ট</CardTitle>
          <p className="text-gray-600 bangla-text">আপনার বিনিয়োগ যাত্রা শুরু করুন</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-2">
            <Button
              onClick={handleDemoLogin}
              className="w-full bg-orange-600 hover:bg-orange-700 bangla-text"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ডেমো লগইন হচ্ছে...
                </span>
              ) : (
                <span className="flex items-center">
                  <Play className="mr-2 h-4 w-4" /> ডেমো লগইন (পরীক্ষা করুন)
                </span>
              )}
            </Button>

            <Button
              onClick={handleSuperAdminLogin}
              className="w-full bg-red-600 hover:bg-red-700 bangla-text"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  সুপার অ্যাডমিন লগইন হচ্ছে...
                </span>
              ) : (
                <span className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" /> সুপার অ্যাডমিন অ্যাক্সেস
                </span>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center bangla-text">
              ডেমো: demo@example.com / demo123 | অ্যাডমিন: superadmin@ajbell.com / superadmin123
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="bangla-text">
                লগইন
              </TabsTrigger>
              <TabsTrigger value="signup" className="bangla-text">
                সাইনআপ
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="bangla-text">
                    ইমেল
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="আপনার ইমেল"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bangla-text"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="bangla-text">
                    পাসওয়ার্ড
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="আপনার পাসওয়ার্ড"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="bangla-text pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center bangla-text">{error}</p>}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      লগইন হচ্ছে...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" /> লগইন
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name" className="bangla-text">
                    নাম *
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="আপনার পূর্ণ নাম"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    className="bangla-text"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="bangla-text">
                    ইমেল *
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="আপনার ইমেল ঠিকানা"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="bangla-text"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="bangla-text">
                    পাসওয়ার্ড *
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="একটি শক্তিশালী পাসওয়ার্ড"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="bangla-text pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 bangla-text">
                    কমপক্ষে ৬ অক্ষর, একটি বড় হাতের অক্ষর, ছোট হাতের অক্ষর এবং সংখ্যা
                  </p>
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="bangla-text">
                    পাসওয়ার্ড নিশ্চিত করুন *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড আবার লিখুন"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bangla-text pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm bangla-text leading-relaxed">
                      আমি <span className="text-blue-600 underline cursor-pointer">শর্তাবলী ও নিয়মাবলী</span> পড়েছি এবং
                      সম্মত আছি *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={agreeToPrivacy}
                      onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor="privacy" className="text-sm bangla-text leading-relaxed">
                      আমি <span className="text-blue-600 underline cursor-pointer">গোপনীয়তা নীতি</span> পড়েছি এবং সম্মত
                      আছি *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={agreeToMarketing}
                      onCheckedChange={(checked) => setAgreeToMarketing(checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor="marketing" className="text-sm bangla-text leading-relaxed">
                      আমি প্রমোশনাল ইমেইল ও বিজ্ঞপ্তি পেতে সম্মত (ঐচ্ছিক)
                    </Label>
                  </div>

                  <p className="text-xs text-gray-500 bangla-text">* চিহ্নিত ক্ষেত্রগুলি বাধ্যতামূলক</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center bangla-text">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 bangla-text"
                  disabled={loading || !agreeToTerms || !agreeToPrivacy}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      সাইনআপ হচ্ছে...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" /> সাইনআপ করুন
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
