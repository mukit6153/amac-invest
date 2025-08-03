"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import { ArrowLeft, Users, Share2, Copy, Gift, TrendingUp, Award, Crown, Star, Phone, DollarSign } from "lucide-react"
import { dataFunctions, type User } from "../lib/database"

interface ReferralScreenProps {
  user: User
  onBack: () => void
}

export default function ReferralScreen({ user, onBack }: ReferralScreenProps) {
  const [referrals, setReferrals] = useState([])
  const [totalEarned, setTotalEarned] = useState(0)
  const { sounds } = useSound()

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = async () => {
    try {
      const referralsData = await dataFunctions.getUserReferrals(user.id)
      setReferrals(referralsData)

      // Calculate total referral earnings
      const total = referralsData.reduce((sum: number, ref: any) => sum + (ref.total_earned || 0), 0)
      setTotalEarned(total)
    } catch (error) {
      console.error("Error loading referrals:", error)
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referral_code)
    sounds.success()
  }

  const shareReferralLink = () => {
    const referralLink = `https://ajbell.com/signup?ref=${user.referral_code}`
    if (navigator.share) {
      navigator.share({
        title: "AJBell এ যোগ দিন",
        text: "AJBell এ বিনিয়োগ করে দৈনিক আয় করুন!",
        url: referralLink,
      })
    } else {
      navigator.clipboard.writeText(referralLink)
      sounds.success()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <SoundButton variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </SoundButton>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">রেফারেল প্রোগ্রাম</h1>
                <p className="text-xs text-gray-600">বন্ধুদের আমন্ত্রণ জানিয়ে আয় করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Referral Stats */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{referrals.length}</p>
                <p className="text-xs opacity-90">মোট রেফারেল</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">৳{totalEarned}</p>
                <p className="text-xs opacity-90">মোট আয়</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">১০%</p>
                <p className="text-xs opacity-90">কমিশন রেট</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Code */}
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="h-4 w-4 text-indigo-600" />
              আপনার রেফারেল কোড
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-dashed border-indigo-300">
              <div>
                <p className="text-sm text-gray-600">রেফারেল কোড</p>
                <p className="text-xl font-bold font-mono text-indigo-600">{user.referral_code}</p>
              </div>
              <SoundButton size="sm" onClick={copyReferralCode}>
                <Copy className="h-4 w-4 mr-1" />
                কপি
              </SoundButton>
            </div>

            <SoundButton className="w-full" onClick={shareReferralLink}>
              <Share2 className="h-4 w-4 mr-2" />
              রেফারেল লিংক শেয়ার করুন
            </SoundButton>
          </CardContent>
        </Card>

        {/* Commission Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              কমিশন স্ট্রাকচার
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">১</span>
                </div>
                <div>
                  <p className="font-medium text-sm">প্রথম লেভেল</p>
                  <p className="text-xs text-gray-600">সরাসরি রেফারেল</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">১০%</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">২</span>
                </div>
                <div>
                  <p className="font-medium text-sm">দ্বিতীয় লেভেল</p>
                  <p className="text-xs text-gray-600">রেফারেলের রেফারেল</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">৫%</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">৩</span>
                </div>
                <div>
                  <p className="font-medium text-sm">তৃতীয় লেভেল</p>
                  <p className="text-xs text-gray-600">তৃতীয় স্তরের রেফারেল</p>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-800">২%</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Referral List */}
        {referrals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  আপনার রেফারেল ({referrals.length})
                </div>
                <Badge variant="secondary" className="text-xs">
                  সক্রিয়
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {referrals.slice(0, 5).map((referral: any, index) => (
                <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{referral.users?.name?.charAt(0) || "U"}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{referral.users?.name || "ব্যবহারকারী"}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{referral.users?.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">৳{referral.total_earned || 0}</p>
                    <p className="text-xs text-gray-500">{new Date(referral.created_at).toLocaleDateString("bn-BD")}</p>
                  </div>
                </div>
              ))}

              {referrals.length > 5 && (
                <SoundButton variant="outline" size="sm" className="w-full text-xs">
                  আরও দেখুন (+{referrals.length - 5})
                </SoundButton>
              )}
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              কিভাবে কাজ করে
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white font-bold text-xs">১</span>
              </div>
              <div>
                <p className="font-medium text-sm">রেফারেল কোড শেয়ার করুন</p>
                <p className="text-xs text-gray-600">বন্ধুদের সাথে আপনার কোড শেয়ার করুন</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white font-bold text-xs">২</span>
              </div>
              <div>
                <p className="font-medium text-sm">বন্ধু সাইন আপ করবে</p>
                <p className="text-xs text-gray-600">আপনার কোড দিয়ে নতুন অ্যাকাউন্ট খুলবে</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white font-bold text-xs">৩</span>
              </div>
              <div>
                <p className="font-medium text-sm">কমিশন পাবেন</p>
                <p className="text-xs text-gray-600">তাদের বিনিয়োগ থেকে আপনি কমিশন পাবেন</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Tips */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-4 w-4 text-green-600" />
              রেফারেল টিপস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-green-500 mt-0.5" />
              <span className="text-sm text-gray-700">সোশ্যাল মিডিয়ায় শেয়ার করুন</span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-blue-500 mt-0.5" />
              <span className="text-sm text-gray-700">পরিবার ও বন্ধুদের বলুন</span>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-purple-500 mt-0.5" />
              <span className="text-sm text-gray-700">আয়ের সুবিধা তুলে ধরুন</span>
            </div>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
