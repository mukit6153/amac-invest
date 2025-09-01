"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserIcon, Mail, DollarSign, TrendingUp, Award, Lock, LogOut, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { dataFunctions, authFunctions, User, subscribeToUserUpdates } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"
import Image from "next/image"

interface ProfileScreenProps {
  user: User
  onUserUpdate: (user: User) => void
  onLogout: () => void
}

export default function ProfileScreen({ user, onUserUpdate, onLogout }: ProfileScreenProps) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    if (user?.id) {
      const channel = subscribeToUserUpdates(user.id, (payload) => {
        if (payload.new) {
          onUserUpdate(payload.new as User)
        }
      })
      return () => {
        channel.unsubscribe()
      }
    }
  }, [user?.id, onUserUpdate])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const updatedUser = await dataFunctions.updateUserSettings(user.id, { name, email })
      onUserUpdate(updatedUser)
      setMessage({ type: "success", text: "প্রোফাইল সফলভাবে আপডেট হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "প্রোফাইল আপডেট ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    setLoading(true)
    setMessage(null)

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "error", text: "নতুন পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মেলে না।" })
      playSound("error")
      setLoading(false)
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" })
      playSound("error")
      setLoading(false)
      return
    }

    try {
      // In a real app, oldPassword would be sent to backend for verification
      // For this demo, we're comparing with stored password_hash directly (DANGER in real app)
      const updatedUser = await dataFunctions.changePassword(user.id, oldPassword, newPassword)
      onUserUpdate(updatedUser)
      setMessage({ type: "success", text: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!" })
      playSound("success")
      setOldPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => { playSound("click"); router.back() }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bangla-text">প্রোফাইল</h1>
        <div className="w-5 h-5" /> {/* Placeholder for alignment */}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 overflow-auto">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="text-sm bangla-text">{message.text}</span>
          </div>
        )}

        {/* User Info Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg rounded-xl">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-md"
            />
            <h2 className="text-2xl font-bold bangla-text">{user.name}</h2>
            <p className="text-sm opacity-90 bangla-text">{user.email}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="bangla-text">ব্যালেন্স: ৳{user.balance.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="bangla-text">বিনিয়োগ: ৳{user.invested.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span className="bangla-text">লেভেল: {user.level}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Section */}
        <Card className="bg-white shadow-md rounded-lg p-4 space-y-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 bangla-text">প্রোফাইল এডিট করুন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="name" className="bangla-text">নাম</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 bangla-text"
                />
              </div>
              <div>
                <Label htmlFor="email" className="bangla-text">ইমেল</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bangla-text"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    আপডেট করা হচ্ছে...
                  </>
                ) : (
                  "প্রোফাইল আপডেট করুন"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card className="bg-white shadow-md rounded-lg p-4 space-y-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 bangla-text">পাসওয়ার্ড পরিবর্তন করুন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="oldPassword" className="bangla-text">পুরানো পাসওয়ার্ড</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-1 bangla-text"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="bangla-text">নতুন পাসওয়ার্ড</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 bangla-text"
                />
              </div>
              <div>
                <Label htmlFor="confirmNewPassword" className="bangla-text">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="mt-1 bangla-text"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 bangla-text" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    পরিবর্তন করা হচ্ছে...
                  </>
                ) : (
                  "পাসওয়ার্ড পরিবর্তন করুন"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white bangla-text"
          onClick={() => { playSound("click"); onLogout() }}
          disabled={loading}
        >
          <LogOut className="h-4 w-4 mr-2" /> লগআউট
        </Button>
      </main>
    </div>
  )
}
