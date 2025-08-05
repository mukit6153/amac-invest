"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Shield,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Edit,
  Camera,
  CheckCircle,
  Clock,
  XCircle,
  Flame,
  Crown,
  Star,
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"

interface ProfileScreenProps {
  user: any
  onBack: () => void
}

export default function ProfileScreen({ user: initialUser, onBack }: ProfileScreenProps) {
  const [user, setUser] = useState(initialUser)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialUser?.name || "")
  const [email, setEmail] = useState(initialUser?.email || "")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "stats" | "achievements">("profile")

  const { sounds } = useSound()

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
      setName(initialUser.name)
      setEmail(initialUser.email || "")
    }
  }, [initialUser])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // In a real app, you would call an update function
      // For now, we'll just update the local state
      const updatedUser = { ...user, name, email }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setEditing(false)
      sounds.success()
      alert("প্রোফাইল আপডেট হয়েছে!")
    } catch (error) {
      sounds.error()
      alert("প্রোফাইল আপডেট করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getKycStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "অনুমোদিত"
      case "pending":
        return "অপেক্ষমাণ"
      case "rejected":
        return "প্রত্যাখ্যাত"
      default:
        return "অজানা"
    }
  }

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getUserLevel = (totalInvested: number) => {
    if (totalInvested >= 100000) return { level: "VIP", icon: Crown, color: "text-yellow-600" }
    if (totalInvested >= 50000) return { level: "Premium", icon: Star, color: "text-purple-600" }
    if (totalInvested >= 10000) return { level: "Gold", icon: Award, color: "text-orange-600" }
    return { level: "Silver", icon: User, color: "text-gray-600" }
  }

  const userLevel = getUserLevel(user?.total_invested || 0)
  const LevelIcon = userLevel.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SoundButton variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </SoundButton>
              <div>
                <h1 className="font-bold text-gray-800 text-lg">প্রোফাইল</h1>
                <p className="text-xs text-gray-600">আপনার তথ্য দেখুন ও সম্পাদনা করুন</p>
              </div>
            </div>
            <SoundButton variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
              <Edit className="h-4 w-4" />
            </SoundButton>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <SoundButton
                  variant="ghost"
                  size="sm"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white p-0"
                >
                  <Camera className="h-4 w-4" />
                </SoundButton>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
                <p className="text-sm opacity-80 mb-2">{user?.phone}</p>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${userLevel.color} bg-white/20`}>
                    <LevelIcon className="h-3 w-3 mr-1" />
                    {userLevel.level}
                  </Badge>
                  <Badge className="text-xs bg-white/20">
                    <Flame className="h-3 w-3 mr-1" />
                    {user?.login_streak} দিন
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <SoundButton
            variant={activeTab === "profile" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("profile")}
          >
            তথ্য
          </SoundButton>
          <SoundButton
            variant={activeTab === "stats" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("stats")}
          >
            পরিসংখ্যান
          </SoundButton>
          <SoundButton
            variant={activeTab === "achievements" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("achievements")}
          >
            অর্জন
          </SoundButton>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  ব্যক্তিগত তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">নাম</label>
                  {editing ? (
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{user?.name}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ফোন নম্বর</label>
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">{user?.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ইমেইল</label>
                  {editing ? (
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="আপনার ইমেইল"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">{user?.email || "ইমেইল যোগ করুন"}</p>
                    </div>
                  )}
                </div>

                {editing && (
                  <div className="flex gap-2">
                    <SoundButton className="flex-1" onClick={handleSaveProfile} disabled={loading}>
                      {loading ? "সংরক্ষণ..." : "সংরক্ষণ করুন"}
                    </SoundButton>
                    <SoundButton
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEditing(false)
                        setName(user?.name || "")
                        setEmail(user?.email || "")
                      }}
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
                  <Shield className="h-5 w-5 text-green-600" />
                  অ্যাকাউন্ট স্ট্যাটাস
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">KYC স্ট্যাটাস</span>
                  <Badge className={`text-xs ${getKycStatusColor(user?.kyc_status)}`}>
                    {getKycStatusIcon(user?.kyc_status)}
                    <span className="ml-1">{getKycStatusText(user?.kyc_status)}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">অ্যাকাউন্ট স্ট্যাটাস</span>
                  <Badge variant={user?.status === "active" ? "default" : "destructive"} className="text-xs">
                    {user?.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">সদস্য হওয়ার তারিখ</span>
                  <span className="text-sm font-medium">
                    {user?.created_at && new Date(user.created_at).toLocaleDateString("bn-BD")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">রেফারেল কোড</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold">{user?.referral_code}</span>
                    <SoundButton variant="outline" size="sm" className="text-xs px-2 py-1">
                      কপি
                    </SoundButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            {/* Balance Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <div className="text-xl font-bold">৳{user?.balance?.toLocaleString()}</div>
                  <p className="text-xs opacity-80">মূল ব্যালেন্স</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <div className="text-xl font-bold">৳{user?.bonus_balance?.toLocaleString()}</div>
                  <p className="text-xs opacity-80">বোনাস ব্যালেন্স</p>
                </CardContent>
              </Card>
            </div>

            {/* Investment Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  বিনিয়োগ পরিসংখ্যান
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">মোট বিনিয়োগ</span>
                  <span className="text-lg font-bold text-blue-600">৳{user?.total_invested?.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">মোট আয়</span>
                  <span className="text-lg font-bold text-green-600">৳{user?.total_earned?.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">লক করা ব্যালেন্স</span>
                  <span className="text-lg font-bold text-orange-600">৳{user?.locked_balance?.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  কার্যকলাপ পরিসংখ্যান
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">লগইন স্ট্রিক</span>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-lg font-bold text-orange-600">{user?.login_streak} দিন</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">শেষ লগইন</span>
                  <span className="text-sm font-medium">
                    {user?.last_login && new Date(user.last_login).toLocaleDateString("bn-BD")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ব্যবহারকারীর স্তর</span>
                  <Badge className={`text-xs ${userLevel.color}`}>
                    <LevelIcon className="h-3 w-3 mr-1" />
                    {userLevel.level}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  স্তর অগ্রগতি
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <LevelIcon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{userLevel.level}</h3>
                  <p className="text-sm text-gray-600">বর্তমান স্তর</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>পরবর্তী স্তরের জন্য</span>
                    <span>৳{(50000 - (user?.total_invested || 0)).toLocaleString()} বাকি</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                      style={{ width: `${Math.min(((user?.total_invested || 0) / 50000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  অর্জনসমূহ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">প্রথম বিনিয়োগ</h4>
                    <p className="text-xs text-gray-600">আপনার প্রথম বিনিয়োগ সম্পন্ন করেছেন</p>
                  </div>
                  <Badge variant="default" className="text-xs">
                    সম্পন্ন
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">রেফারেল মাস্টার</h4>
                    <p className="text-xs text-gray-600">৫ জন বন্ধুকে রেফার করেছেন</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    অগ্রগতিতে
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">দৈনিক চ্যাম্পিয়ন</h4>
                    <p className="text-xs text-gray-600">৭ দিন ধারাবাহিক লগইন</p>
                  </div>
                  <Badge variant={user?.login_streak >= 7 ? "default" : "secondary"} className="text-xs">
                    {user?.login_streak >= 7 ? "সম্পন্ন" : "অগ্রগতিতে"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}
