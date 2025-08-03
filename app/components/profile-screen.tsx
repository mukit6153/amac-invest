"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import {
  ArrowLeft,
  User,
  Phone,
  Shield,
  Award,
  TrendingUp,
  Users,
  Edit,
  Camera,
  Star,
  Crown,
  Flame,
  CheckCircle,
  Settings,
} from "lucide-react"
import type { User as UserType } from "../lib/database"

interface ProfileScreenProps {
  user: UserType
  onBack: () => void
}

export default function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user.name)
  const [editedEmail, setEditedEmail] = useState(user.email || "")
  const { sounds } = useSound()

  const handleSave = () => {
    // Save profile changes
    sounds.success()
    setIsEditing(false)
  }

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getKycStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "যাচাইকৃত"
      case "pending":
        return "অপেক্ষমাণ"
      case "rejected":
        return "প্রত্যাখ্যাত"
      default:
        return "অযাচাইকৃত"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <SoundButton variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </SoundButton>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">প্রোফাইল</h1>
                <p className="text-xs text-gray-600">আপনার তথ্য দেখুন ও সম্পাদনা করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10" />
                )}
              </div>
              <SoundButton
                size="sm"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 p-0"
              >
                <Camera className="h-4 w-4" />
              </SoundButton>
            </div>
            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
            <p className="text-sm opacity-90 mb-3">{user.phone}</p>
            <div className="flex items-center justify-center gap-2">
              <Badge className={`text-xs ${getKycStatusColor(user.kyc_status)}`}>
                <Shield className="h-3 w-3 mr-1" />
                {getKycStatusText(user.kyc_status)}
              </Badge>
              {user.role === "admin" && (
                <Badge className="text-xs bg-yellow-100 text-yellow-800">
                  <Crown className="h-3 w-3 mr-1" />
                  অ্যাডমিন
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-bold">৳{user.total_invested.toLocaleString()}</p>
              <p className="text-xs opacity-90">মোট বিনিয়োগ</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-bold">৳{user.total_earned.toLocaleString()}</p>
              <p className="text-xs opacity-90">মোট আয়</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs opacity-90">রেফারেল</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-bold">{user.login_streak}</p>
              <p className="text-xs opacity-90">লগইন স্ট্রিক</p>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                ব্যক্তিগত তথ্য
              </CardTitle>
              <SoundButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(!isEditing)
                  sounds.buttonClick()
                }}
              >
                <Edit className="h-4 w-4" />
              </SoundButton>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">নাম</Label>
              {isEditing ? (
                <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="mt-1" />
              ) : (
                <p className="mt-1 text-sm text-gray-700">{user.name}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">ফোন নম্বর</Label>
              <p className="mt-1 text-sm text-gray-700">{user.phone}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">ইমেইল</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="mt-1"
                  placeholder="আপনার ইমেইল"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-700">{user.email || "ইমেইল যোগ করুন"}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">যোগদানের তারিখ</Label>
              <p className="mt-1 text-sm text-gray-700">{new Date(user.created_at).toLocaleDateString("bn-BD")}</p>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <SoundButton onClick={handleSave} className="flex-1">
                  সংরক্ষণ করুন
                </SoundButton>
                <SoundButton
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedName(user.name)
                    setEditedEmail(user.email || "")
                    sounds.buttonClick()
                  }}
                  className="flex-1"
                >
                  বাতিল
                </SoundButton>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              অ্যাকাউন্ট স্ট্যাটাস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">KYC যাচাইকরণ</span>
              <Badge className={getKycStatusColor(user.kyc_status)}>{getKycStatusText(user.kyc_status)}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">অ্যাকাউন্ট স্ট্যাটাস</span>
              <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {user.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">সর্বশেষ লগইন</span>
              <span className="text-sm text-gray-600">{new Date(user.last_login).toLocaleDateString("bn-BD")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Referral Code */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              রেফারেল কোড
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <p className="text-sm text-gray-600">আপনার রেফারেল কোড</p>
                <p className="text-lg font-bold font-mono text-indigo-600">{user.referral_code}</p>
              </div>
              <SoundButton size="sm" variant="outline">
                কপি করুন
              </SoundButton>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              অর্জনসমূহ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                <p className="text-xs font-medium">প্রথম বিনিয়োগ</p>
                <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-1" />
              </div>

              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                <p className="text-xs font-medium">৭ দিন স্ট্রিক</p>
                {user.login_streak >= 7 ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-1" />
                ) : (
                  <div className="text-xs text-gray-500 mt-1">{7 - user.login_streak} দিন বাকি</div>
                )}
              </div>

              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Award className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <p className="text-xs font-medium">১০০০ টাকা আয়</p>
                {user.total_earned >= 1000 ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-1" />
                ) : (
                  <div className="text-xs text-gray-500 mt-1">৳{1000 - user.total_earned} বাকি</div>
                )}
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                <p className="text-xs font-medium">৫ রেফারেল</p>
                <div className="text-xs text-gray-500 mt-1">৫টি বাকি</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">দ্রুত কাজ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SoundButton variant="outline" className="w-full justify-start" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              সেটিংস
            </SoundButton>

            <SoundButton variant="outline" className="w-full justify-start" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              KYC যাচাইকরণ
            </SoundButton>

            <SoundButton variant="outline" className="w-full justify-start" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              সাপোর্ট
            </SoundButton>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
