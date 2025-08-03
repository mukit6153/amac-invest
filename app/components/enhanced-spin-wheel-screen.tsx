"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Star, Zap, Crown, Sparkles, Trophy, Coins, Volume2, VolumeX } from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"

export default function EnhancedSpinWheelScreen() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [spinsLeft, setSpinsLeft] = useState(3)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const wheelRef = useRef<HTMLDivElement>(null)
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { sounds } = useSound()

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

    // Play spin start sound
    if (soundEnabled) sounds.spinStart()

    const randomRotation = Math.floor(Math.random() * 360) + 1440 // At least 4 full rotations
    const finalRotation = rotation + randomRotation
    setRotation(finalRotation)

    // Play ticking sounds during spin
    if (soundEnabled) {
      let tickCount = 0
      const maxTicks = 20
      tickIntervalRef.current = setInterval(() => {
        if (tickCount < maxTicks) {
          sounds.spinTick()
          tickCount++
        } else if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current)
        }
      }, 150)
    }

    // Calculate which prize was won
    const normalizedRotation = (360 - (finalRotation % 360)) % 360
    const prizeIndex = Math.floor(normalizedRotation / (360 / prizes.length))
    const wonPrize = prizes[prizeIndex]

    setTimeout(() => {
      setIsSpinning(false)

      // Clear tick interval
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current)
        tickIntervalRef.current = null
      }

      // Play stop sound
      if (soundEnabled) {
        sounds.spinStop()

        // Play reward sound based on prize value
        setTimeout(() => {
          if (wonPrize.value >= 200) {
            sounds.rewardBig()
          } else {
            sounds.rewardSmall()
          }
        }, 500)
      }

      setResult(wonPrize)
      setSpinsLeft((prev) => prev - 1)
    }, 3000)
  }

  const handleClaimReward = () => {
    if (soundEnabled) sounds.coinCollect()
    setResult(null)
  }

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header with Sound Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold bangla-text mb-2">স্পিন হুইল</h1>
          <p className="text-gray-600 bangla-text">ভাগ্য পরীক্ষা করুন এবং পুরস্কার জিতুন!</p>
        </div>
        <SoundButton
          variant="outline"
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="ml-4"
          soundType={soundEnabled ? "click" : "success"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </SoundButton>
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
                  isSpinning ? "" : ""
                }`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter: isSpinning ? "blur(1px)" : "none",
                }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index
                  return (
                    <div
                      key={index}
                      className={`absolute w-1/2 h-1/2 ${prize.color} flex items-center justify-center text-white font-bold text-sm origin-bottom-right transition-all duration-300`}
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

              {/* Center Circle with Pulsing Animation */}
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${isSpinning ? "animate-pulse" : ""}`}
              >
                <Sparkles className="h-8 w-8 text-white" />
              </div>

              {/* Pointer with Glow Effect */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div
                  className={`w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 ${isSpinning ? "animate-bounce" : ""}`}
                ></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center mt-6">
            <SoundButton
              onClick={spinWheel}
              disabled={isSpinning || spinsLeft <= 0}
              className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-bold bangla-text shadow-lg transform transition-all duration-200 ${
                !isSpinning && spinsLeft > 0 ? "hover:scale-105 hover:shadow-xl" : ""
              }`}
              size="lg"
              soundType="success"
              enableHoverSound={!isSpinning && spinsLeft > 0}
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
            </SoundButton>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Result Modal */}
      {result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-10"></div>

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
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Trophy className="h-10 w-10 text-white" />
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
                <p className="text-gray-600 mb-4 bangla-text">আপনি জিতেছেন</p>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-4 animate-pulse">
                {result.icon} ৳{result.value}
              </div>
              <SoundButton
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 bangla-text transform hover:scale-105 transition-all duration-200"
                onClick={handleClaimReward}
                soundType="success"
              >
                <Coins className="h-4 w-4 mr-2" />
                সংগ্রহ করুন
              </SoundButton>
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
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
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

            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white">🍀</span>
                </div>
                <div>
                  <p className="font-medium bangla-text">লাকি স্পিন</p>
                  <p className="text-sm text-gray-600">১০০-১০০০ টাকা</p>
                </div>
              </div>
              <SoundButton size="sm" className="bg-blue-100 text-blue-800 hover:bg-blue-200" soundType="click">
                ৫০ টাকা
              </SoundButton>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white">💫</span>
                </div>
                <div>
                  <p className="font-medium bangla-text">মেগা স্পিন</p>
                  <p className="text-sm text-gray-600">৫০০-৫০০০ টাকা</p>
                </div>
              </div>
              <SoundButton size="sm" className="bg-purple-100 text-purple-800 hover:bg-purple-200" soundType="click">
                ২০০ টাকা
              </SoundButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sound Settings Info */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-600" />
            ) : (
              <VolumeX className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm bangla-text">সাউন্ড ইফেক্ট {soundEnabled ? "চালু" : "বন্ধ"}</span>
          </div>
          <p className="text-xs text-gray-600 bangla-text">উপরের সাউন্ড বাটনে ক্লিক করে সাউন্ড চালু/বন্ধ করুন</p>
        </CardContent>
      </Card>
    </div>
  )
}
