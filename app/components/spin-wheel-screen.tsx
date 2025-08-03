"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Star, Zap, Crown, Sparkles, Trophy, Coins } from "lucide-react"

export default function SpinWheelScreen() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [spinsLeft, setSpinsLeft] = useState(3)
  const wheelRef = useRef<HTMLDivElement>(null)

  const prizes = [
    { label: "৫০ টাকা", value: 50, color: "bg-red-500", icon: "💰" },
    { label: "১০০ টাকা", value: 100, color: "bg-blue-500", icon: "💎" },
    { label: "২৫ টাকা", value: 25, color: "bg-green-500", icon: "🪙" },
    { label: "২০০ টাকা", value: 200, color: "bg-purple-500", icon: "💸" },
    { label: "৭৫ টাকা", value: 75, color: "bg-yellow-500", icon: "⭐" },
    { label: "৫০০ টাকা", value: 500, color: "bg-pink-500", icon: "🏆" },
    { label: "১০ টাকা", value: 10, color: "bg-indigo-500", icon: "🎁" },
    { label: "১৫০ টাকা", value: 150, color: "bg-orange-500", icon: "💫" },
  ]

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return

    setIsSpinning(true)
    const randomRotation = Math.floor(Math.random() * 360) + 1440 // At least 4 full rotations
    const finalRotation = rotation + randomRotation
    setRotation(finalRotation)

    // Calculate which prize was won
    const normalizedRotation = (360 - (finalRotation % 360)) % 360
    const prizeIndex = Math.floor(normalizedRotation / (360 / prizes.length))
    const wonPrize = prizes[prizeIndex]

    setTimeout(() => {
      setIsSpinning(false)
      setResult(wonPrize)
      setSpinsLeft((prev) => prev - 1)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold bangla-text mb-2">স্পিন হুইল</h1>
        <p className="text-gray-600 bangla-text">ভাগ্য পরীক্ষা করুন এবং পুরস্কার জিতুন!</p>
      </div>

      {/* Spins Left */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="font-semibold bangla-text">বাকি স্পিন</span>
          </div>
          <div className="text-3xl font-bold text-blue-600">{spinsLeft}</div>
          <p className="text-sm text-gray-600 bangla-text">আজকের জন্য</p>
        </CardContent>
      </Card>

      {/* Spin Wheel */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="relative flex items-center justify-center">
            {/* Wheel */}
            <div className="relative">
              <div
                ref={wheelRef}
                className={`w-80 h-80 rounded-full border-8 border-white shadow-2xl transition-transform duration-3000 ease-out ${
                  isSpinning ? "animate-spin" : ""
                }`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index
                  return (
                    <div
                      key={index}
                      className={`absolute w-1/2 h-1/2 ${prize.color} flex items-center justify-center text-white font-bold text-sm origin-bottom-right`}
                      style={{
                        transform: `rotate(${angle}deg)`,
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      }}
                    >
                      <div className="flex flex-col items-center" style={{ transform: `rotate(${-angle + 22.5}deg)` }}>
                        <span className="text-lg mb-1">{prize.icon}</span>
                        <span className="text-xs bangla-text">{prize.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <Sparkles className="h-8 w-8 text-white" />
              </div>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center mt-6">
            <Button
              onClick={spinWheel}
              disabled={isSpinning || spinsLeft <= 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-bold bangla-text shadow-lg"
              size="lg"
            >
              {isSpinning ? (
                <>
                  <Zap className="h-5 w-5 mr-2 animate-spin" />
                  ঘুরছে...
                </>
              ) : spinsLeft <= 0 ? (
                "আজকের স্পিন শেষ"
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  স্পিন করুন
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-10"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div className="mb-4">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-2 bangla-text">অভিনন্দন! 🎉</h3>
                <p className="text-gray-600 mb-4 bangla-text">আপনি জিতেছেন</p>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-4 animate-pulse">
                {result.icon} ৳{result.value}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 bangla-text"
                onClick={() => setResult(null)}
              >
                <Coins className="h-4 w-4 mr-2" />
                সংগ্রহ করুন
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Spin Types */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bangla-text">
              <Crown className="h-5 w-5 text-purple-600" />
              স্পিন প্যাকেজ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white">🎯</span>
                </div>
                <div>
                  <p className="font-medium bangla-text">ডেইলি স্পিন</p>
                  <p className="text-sm text-gray-600">৫০-৫০০ টাকা</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                ফ্রি
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white">🍀</span>
                </div>
                <div>
                  <p className="font-medium bangla-text">লাকি স্পিন</p>
                  <p className="text-sm text-gray-600">১০০-১০০০ টাকা</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">৫০ টাকা</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white">💫</span>
                </div>
                <div>
                  <p className="font-medium bangla-text">মেগা স্পিন</p>
                  <p className="text-sm text-gray-600">৫০০-৫০০০ টাকা</p>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-800">২০০ টাকা</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
