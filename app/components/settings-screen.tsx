"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Volume2, VolumeX, Bell, Lock, LogOut, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { dataFunctions, User, subscribeToUserUpdates } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"
import { useBackgroundMusic } from "@/app/hooks/use-background-music"

interface SettingsScreenProps {
  user: User
  onUserUpdate: (user: User) => void
  onLogout: () => void
  isMusicPlaying: boolean
  toggleMusic: () => void
}

export default function SettingsScreen({ user, onUserUpdate, onLogout, isMusicPlaying, toggleMusic }: SettingsScreenProps) {
  const router = useRouter()
  const [enableNotifications, setEnableNotifications] = useState(true) // Mock state
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    // Initialize settings from user data or defaults
    // For demo, we'll just use a mock state for notifications
    // setEnableNotifications(user.settings?.enableNotifications || true);

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

  const handleSaveSettings = async () => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      // In a real app, save settings to user object in DB
      // const updatedUser = await dataFunctions.updateUserSettings(user.id, { enableNotifications });
      // onUserUpdate(updatedUser);
      setMessage({ type: "success", text: "সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।" })
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
        <h1 className="text-xl font-bold bangla-text">সেটিংস</h1>
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

        {/* General Settings */}
        <Card className="bg-white shadow-md rounded-lg p-4 space-y-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 bangla-text">সাধারণ সেটিংস</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="music-toggle" className="flex items-center gap-2 bangla-text">
                {isMusicPlaying ? <Volume2 className="h-5 w-5 text-blue-600" /> : <VolumeX className="h-5 w-5 text-gray-500" />}
                পটভূমি সঙ্গীত
              </Label>
              <Switch
                id="music-toggle"
                checked={isMusicPlaying}
                onCheckedChange={toggleMusic}
                onClick={() => playSound("click")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-toggle" className="flex items-center gap-2 bangla-text">
                <Bell className="h-5 w-5 text-blue-600" />
                বিজ্ঞপ্তি সক্ষম করুন
              </Label>
              <Switch
                id="notifications-toggle"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
                onClick={() => playSound("click")}
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" onClick={handleSaveSettings} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                "সেটিংস সংরক্ষণ করুন"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-white shadow-md rounded-lg p-4 space-y-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 bangla-text">অ্যাকাউন্ট সেটিংস</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-800 bangla-text"
              variant="ghost"
              onClick={() => { playSound("click"); router.push("/profile") }}
            >
              <Lock className="h-4 w-4 mr-2" /> পাসওয়ার্ড পরিবর্তন করুন
            </Button>
            <Button
              className="w-full justify-start bg-gray-100 hover:bg-gray-200 text-gray-800 bangla-text"
              variant="ghost"
              onClick={() => { playSound("click"); router.push("/profile") }}
            >
              <Bell className="h-4 w-4 mr-2" /> প্রোফাইল তথ্য আপডেট করুন
            </Button>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white bangla-text"
              onClick={() => { playSound("click"); onLogout() }}
              disabled={loading}
            >
              <LogOut className="h-4 w-4 mr-2" /> লগআউট
            </Button>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="bg-white shadow-md rounded-lg p-4 space-y-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 bangla-text">সম্পর্কে</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700 text-sm bangla-text">
            <p>সংস্করণ: 1.0.0</p>
            <p>আমাদের সাথে যোগাযোগ করুন: support@amac.com</p>
            <p>গোপনীয়তা নীতি</p>
            <p>ব্যবহারের শর্তাবলী</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
