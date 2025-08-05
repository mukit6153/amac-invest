"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Users,
  Share2,
  Copy,
  Gift,
  TrendingUp,
  Award,
  Crown,
  Star,
  UserPlus,
  DollarSign,
  Calendar,
  Phone,
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import { dataFunctions, type Referral } from "../lib/database"

interface ReferralScreenProps {
  user: any
  onBack: () => void
}

export default function ReferralScreen({ user, onBack }: ReferralScreenProps) {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"invite" | "referrals" | "earnings">("invite")

  const { sounds } = useSound()

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = async () => {
    try {
      const data = await dataFunctions.getUserReferrals(user.id)
      setReferrals(data)
    } catch (error) {
      console.error("Error loading referrals:", error)
    }
  }

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(user.referral_code)
    sounds.success()
    alert("রেফারেল কোড কপি হয়েছে!")
  }

  const handleShareReferral = () => {
    const shareText = `AMAC এ যোগ দিন এবং বিনিয়োগ করে আয় করুন! আমার রেফারেল কোড: ${user.referral_code}`

    if (navigator.share) {
      navigator.share({
        title: "AMAC রেফারেল",
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      sounds.success()
      alert("রেফারেল লিংক কপি হয়েছে!")
    }
  }

  const totalReferrals = referrals.length
  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.total_earned, 0)
  const activeReferrals = referrals.filter((ref) => ref.status === "active").length

  const referralLevels = [
    { level: 1, commission: 10, count: referrals.filter((r) => r.level === 1).length },
    { level: 2, commission: 5, count: referrals.filter((r) => r.level === 2).length },
    { level: 3, commission: 2, count: referrals.filter((r) => r.level === 3).length },
  ]

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
                <h1 className="font-bold text-gray-800 text-lg">রেফারেল প্রোগ্রাম</h1>
                <p className="text-xs text-gray-600">বন্ধুদের আমন্ত্রণ জানান ও কমিশন পান</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">৳{totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-gray-500">মোট আয়</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <Users className="h-6 w-6 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{totalReferrals}</div>
              <p className="text-xs opacity-80">মোট রেফারেল</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{activeReferrals}</div>
              <p className="text-xs opacity-80">সক্রিয়</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <Award className="h-6 w-6 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">৳{totalEarnings}</div>
              <p className="text-xs opacity-80">আয়</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <SoundButton
            variant={activeTab === "invite" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("invite")}
          >
            আমন্ত্রণ
          </SoundButton>
          <SoundButton
            variant={activeTab === "referrals" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("referrals")}
          >
            রেফারেল ({totalReferrals})
          </SoundButton>
          <SoundButton
            variant={activeTab === "earnings" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("earnings")}
          >
            আয়
          </SoundButton>
        </div>

        {/* Invite Tab */}
        {activeTab === "invite" && (
          <div className="space-y-4">
            {/* Referral Code Card */}
            <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">আপনার রেফারেল কোড</h3>
                  <div className="bg-white/20 rounded-lg p-4 mb-4">
                    <p className="text-3xl font-bold font-mono tracking-wider">{user.referral_code}</p>
                  </div>
                  <div className="flex gap-2">
                    <SoundButton
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                      onClick={handleCopyReferralCode}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      কপি করুন
                    </SoundButton>
                    <SoundButton
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                      onClick={handleShareReferral}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      শেয়ার করুন
                    </SoundButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  কমিশন স্ট্রাকচার
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {referralLevels.map((level) => (
                  <div key={level.level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{level.level}</span>
                      </div>
                      <div>
                        <p className="font-medium">লেভেল {level.level}</p>
                        <p className="text-xs text-gray-600">{level.commission}% কমিশন</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{level.count}</p>
                      <p className="text-xs text-gray-500">রেফারেল</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  কিভাবে কাজ করে
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">বন্ধুদের আমন্ত্রণ জানান</p>
                    <p className="text-xs text-gray-600">আপনার রেফারেল কোড শেয়ার করুন</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">তারা সাইন আপ করবে</p>
                    <p className="text-xs text-gray-600">আপনার কোড দিয়ে অ্যাকাউন্ট তৈরি করবে</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">কমিশন পান</p>
                    <p className="text-xs text-gray-600">তাদের বিনিয়োগ থেকে কমিশন পাবেন</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === "referrals" && (
          <div className="space-y-3">
            {referrals.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">এখনো কোন রেফারেল নেই</p>
                  <SoundButton variant="outline" size="sm" className="mt-3" onClick={() => setActiveTab("invite")}>
                    বন্ধুদের আমন্ত্রণ জানান
                  </SoundButton>
                </CardContent>
              </Card>
            ) : (
              referrals.map((referral) => (
                <Card key={referral.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {referral.users?.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{referral.users?.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {referral.users?.phone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs mb-1">
                          লেভেল {referral.level}
                        </Badge>
                        <p className="text-xs text-gray-500">{referral.commission_rate}% কমিশন</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-gray-600">আয়</p>
                        <p className="font-bold text-green-600">৳{referral.total_earned}</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-gray-600">বিনিয়োগ</p>
                        <p className="font-bold text-blue-600">৳{referral.users?.total_invested || 0}</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="text-gray-600">যোগদান</p>
                        <p className="font-bold text-purple-600">
                          {new Date(referral.created_at).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <div className="space-y-4">
            {/* Total Earnings */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-80" />
                  <h3 className="text-2xl font-bold mb-1">৳{totalEarnings.toLocaleString()}</h3>
                  <p className="text-sm opacity-80">মোট রেফারেল আয়</p>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  আয়ের বিবরণ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {referralLevels.map((level) => {
                  const levelEarnings = referrals
                    .filter((r) => r.level === level.level)
                    .reduce((sum, r) => sum + r.total_earned, 0)

                  return (
                    <div key={level.level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{level.level}</span>
                        </div>
                        <div>
                          <p className="font-medium">লেভেল {level.level} আয়</p>
                          <p className="text-xs text-gray-600">{level.count} রেফারেল থেকে</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">৳{levelEarnings.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{level.commission}% হারে</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Monthly Earnings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  মাসিক আয়
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mb-1">
                    ৳{Math.floor(totalEarnings / 12).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">গড় মাসিক আয়</p>
                </div>
              </CardContent>
            </Card>

            {/* Bonus Information */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-yellow-800">বোনাস তথ্য</h4>
                    <p className="text-sm text-yellow-700">১০+ রেফারেল করলে অতিরিক্ত ৫% বোনাস পাবেন!</p>
                  </div>
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
