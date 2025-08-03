"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Lock, Crown, Star, Sparkles, CheckCircle, Clock, Package, Zap } from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"

interface EnhancedFreeGiftScreenProps {
  user: any
}

export default function EnhancedFreeGiftScreen({ user }: EnhancedFreeGiftScreenProps) {
  const [selectedGift, setSelectedGift] = useState<any>(null)
  const [claimedGifts, setClaimedGifts] = useState<number[]>([])
  const { sounds } = useSound()

  const dailyGifts = [
    {
      id: 1,
      title: "ডেইলি চেক-ইন",
      titleBn: "ডেইলি চেক-ইন",
      description: "প্রতিদিন লগইন করে ফ্রি গিফট পান",
      reward: "২৫ টাকা",
      icon: "🎁",
      color: "from-green-500 to-emerald-500",
      requirement: "ফ্রি",
      available: true,
      claimed: false,
    },
    {
      id: 2,
      title: "সাপ্তাহিক বোনাস",
      titleBn: "সাপ্তাহিক বোনাস",
      description: "৭ দিন টানা লগইন করুন",
      reward: "১০০ টাকা",
      icon: "🏆",
      color: "from-blue-500 to-cyan-500",
      requirement: "৭ দিন স্ট্রিক",
      available: user?.loginStreak >= 7,
      claimed: false,
    },
    {
      id: 3,
      title: "মাসিক রিওয়ার্ড",
      titleBn: "মাসিক রিওয়ার্ড",
      description: "মাসিক সক্রিয় ব্যবহারকারী বোনাস",
      reward: "৫০০ টাকা",
      icon: "💎",
      color: "from-purple-500 to-pink-500",
      requirement: "৩০ দিন সক্রিয়",
      available: false,
      claimed: false,
    },
  ]

  const premiumGifts = [
    {
      id: 4,
      title: "স্টার্টার প্যাক",
      titleBn: "স্টার্টার প্যাক",
      description: "স্টার্টার প্যাকেজ কিনলে বিশেষ গিফট",
      reward: "২০০ টাকা + বোনাস",
      icon: "🥉",
      color: "from-orange-500 to-red-500",
      requirement: "স্টার্টার প্যাকেজ",
      packageRequired: "starter",
      available: false,
      claimed: false,
    },
    {
      id: 5,
      title: "প্রিমিয়াম প্যাক",
      titleBn: "প্রিমিয়াম প্যাক",
      description: "প্রিমিয়াম প্যাকেজ কিনলে এক্সক্লুসিভ গিফট",
      reward: "৫০০ টাকা + প্রিমিয়াম ফিচার",
      icon: "🥈",
      color: "from-blue-500 to-indigo-500",
      requirement: "প্রিমিয়াম প্যাকেজ",
      packageRequired: "premium",
      available: false,
      claimed: false,
    },
    {
      id: 6,
      title: "ভিআইপি প্যাক",
      titleBn: "ভিআইপি প্যাক",
      description: "ভিআইপি প্যাকেজ কিনলে সর্বোচ্চ গিফট",
      reward: "১০০০ টাকা + ভিআইপি স্ট্যাটাস",
      icon: "🥇",
      color: "from-yellow-500 to-orange-500",
      requirement: "ভিআইপি প্যাকেজ",
      packageRequired: "vip",
      available: false,
      claimed: false,
    },
  ]

  const specialGifts = [
    {
      id: 7,
      title: "রেফারেল মাস্টার",
      titleBn: "রেফারেল মাস্টার",
      description: "১০ জন বন্ধুকে রেফার করুন",
      reward: "১৫০০ টাকা",
      icon: "👥",
      color: "from-pink-500 to-rose-500",
      requirement: "১০ রেফারেল",
      available: false,
      claimed: false,
    },
    {
      id: 8,
      title: "টাস্ক চ্যাম্পিয়ন",
      titleBn: "টাস্ক চ্যাম্পিয়ন",
      description: "১০০টি টাস্ক সম্পন্ন করুন",
      reward: "৮০০ টাকা + বিশেষ ব্যাজ",
      icon: "⭐",
      color: "from-indigo-500 to-purple-500",
      requirement: "১০০ টাস্ক",
      available: false,
      claimed: false,
    },
  ]

  const handleClaimGift = (gift: any) => {
    if (!gift.available || claimedGifts.includes(gift.id)) return

    sounds.rewardSmall()
    setSelectedGift(gift)
    setClaimedGifts((prev) => [...prev, gift.id])
  }

  const handleCloseGiftModal = () => {
    sounds.coinCollect()
    setSelectedGift(null)
  }

  const renderGiftCard = (gift: any, category: string) => (
    <Card
      key={gift.id}
      className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
        !gift.available ? "opacity-60" : "hover:scale-105"
      }`}
    >
      <div className={`h-2 bg-gradient-to-r ${gift.color}`}></div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${gift.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}
            >
              {gift.icon}
            </div>
            <div>
              <CardTitle className="text-lg bangla-text">{gift.titleBn}</CardTitle>
              <p className="text-sm text-gray-600 bangla-text">{gift.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold bg-gradient-to-r ${gift.color} bg-clip-text text-transparent`}>
              {gift.reward}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {gift.available ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Lock className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm bangla-text">{gift.requirement}</span>
          </div>
          <Badge
            variant={gift.available ? "default" : "secondary"}
            className={gift.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
          >
            {gift.available ? "উপলব্ধ" : "লক"}
          </Badge>
        </div>

        {gift.available && !claimedGifts.includes(gift.id) ? (
          <SoundButton
            onClick={() => handleClaimGift(gift)}
            className={`w-full bg-gradient-to-r ${gift.color} hover:opacity-90 bangla-text transform hover:scale-105 transition-all duration-200`}
            soundType="success"
          >
            <Gift className="h-4 w-4 mr-2" />
            সংগ্রহ করুন
          </SoundButton>
        ) : claimedGifts.includes(gift.id) ? (
          <SoundButton disabled className="w-full bangla-text" soundType="click">
            <CheckCircle className="h-4 w-4 mr-2" />
            সংগ্রহ করা হয়েছে
          </SoundButton>
        ) : gift.packageRequired ? (
          <SoundButton
            variant="outline"
            className="w-full bangla-text bg-transparent hover:bg-gray-50"
            onClick={() => sounds.buttonClick()}
            soundType="click"
          >
            <Package className="h-4 w-4 mr-2" />
            প্যাকেজ কিনুন
          </SoundButton>
        ) : (
          <SoundButton disabled className="w-full bangla-text" soundType="click">
            <Clock className="h-4 w-4 mr-2" />
            শর্ত পূরণ করুন
          </SoundButton>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold bangla-text mb-2">ফ্রি গিফট</h1>
        <p className="text-gray-600 bangla-text">বিনামূল্যে গিফট সংগ্রহ করুন এবং পুরস্কার জিতুন</p>
      </div>

      {/* Gift Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => sounds.buttonClick()}
        >
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600">{dailyGifts.filter((g) => g.available).length}</div>
            <p className="text-xs text-green-700 bangla-text">উপলব্ধ গিফট</p>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => sounds.buttonClick()}
        >
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{claimedGifts.length}</div>
            <p className="text-xs text-blue-700 bangla-text">সংগ্রহ করা</p>
          </CardContent>
        </Card>

        <Card
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => sounds.buttonClick()}
        >
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">৳{claimedGifts.length * 100}</div>
            <p className="text-xs text-yellow-700 bangla-text">মোট আয়</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Gifts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Gift className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold bangla-text">দৈনিক গিফট</h2>
          <Badge className="bg-green-100 text-green-800">ফ্রি</Badge>
        </div>
        <div className="space-y-4">{dailyGifts.map((gift) => renderGiftCard(gift, "daily"))}</div>
      </div>

      {/* Premium Gifts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Crown className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold bangla-text">প্রিমিয়াম গিফট</h2>
          <Badge className="bg-blue-100 text-blue-800">প্যাকেজ প্রয়োজন</Badge>
        </div>
        <div className="space-y-4">{premiumGifts.map((gift) => renderGiftCard(gift, "premium"))}</div>
      </div>

      {/* Special Gifts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold bangla-text">স্পেশাল গিফট</h2>
          <Badge className="bg-purple-100 text-purple-800">চ্যালেঞ্জ</Badge>
        </div>
        <div className="space-y-4">{specialGifts.map((gift) => renderGiftCard(gift, "special"))}</div>
      </div>

      {/* Enhanced Gift Claim Modal */}
      {selectedGift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${selectedGift.color} opacity-10`}></div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                />
              ))}
            </div>

            <CardContent className="p-6 text-center relative z-10">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${selectedGift.color} rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce`}
              >
                <span className="text-3xl">{selectedGift.icon}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2 bangla-text">অভিনন্দন! 🎉</h3>
                <p className="text-gray-600 mb-2 bangla-text">আপনি পেয়েছেন</p>
                <p className="font-bold bangla-text">{selectedGift.titleBn}</p>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-4 animate-pulse">{selectedGift.reward}</div>
              <SoundButton
                className={`w-full bg-gradient-to-r ${selectedGift.color} hover:opacity-90 bangla-text transform hover:scale-105 transition-all duration-200`}
                onClick={handleCloseGiftModal}
                soundType="success"
              >
                <Zap className="h-4 w-4 mr-2" />
                সংগ্রহ সম্পন্ন
              </SoundButton>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gift Rules */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Star className="h-5 w-5 text-blue-600" />
            গিফট নিয়মাবলী
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm bangla-text">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span>প্রতিদিন একবার ডেইলি গিফট সংগ্রহ করা যাবে</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span>প্রিমিয়াম গিফটের জন্য সংশ্লিষ্ট প্যাকেজ কিনতে হবে</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span>স্পেশাল গিফটের জন্য নির্দিষ্ট শর্ত পূরণ করতে হবে</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span>গিফট সংগ্রহের পর তাৎক্ষণিক ব্যালেন্সে যোগ হবে</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
