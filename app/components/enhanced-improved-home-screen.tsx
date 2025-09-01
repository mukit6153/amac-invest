"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  TrendingUp,
  User,
  Gift,
  Wallet,
  ShoppingBag,
  CheckCircle,
  Target,
  Bell,
  Settings,
  ChevronDown,
  Star,
  Calendar,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  Verified,
  Flame,
  Volume2,
  VolumeX,
} from "lucide-react"
import SoundButton from "./sound-button"
import { useSound } from "../hooks/use-sound"
import EnhancedSpinWheelScreen from "./enhanced-spin-wheel-screen"
import EnhancedEventsScreen from "./enhanced-events-screen"
import EnhancedFreeGiftScreen from "./enhanced-free-gift-screen"
interface EnhancedImprovedHomeScreenProps {
  user: any
}

export default function EnhancedImprovedHomeScreen({ user }: EnhancedImprovedHomeScreenProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showLoginBonus, setShowLoginBonus] = useState(false)
  const [animateCards, setAnimateCards] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { sounds } = useSound()

  useEffect(() => {
    // Animate cards on load
    const timer = setTimeout(() => setAnimateCards(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: "স্বাগতম, {name} ভাই!",
      subtitle: "আপনার বিনিয়োগ যাত্রা শুরু করুন",
      bg: "from-blue-600 via-purple-600 to-indigo-700",
      icon: "💎",
    },
    {
      title: "দৈনিক ২০-৩০% রিটার্ন",
      subtitle: "গ্যারান্টিযুক্ত মুনাফা পান",
      bg: "from-green-500 via-emerald-600 to-teal-700",
      icon: "📈",
    },
    {
      title: "নিরাপদ ও বিশ্বস্ত",
      subtitle: "আপনার টাকা সম্পূর্ণ সুরক্ষিত",
      bg: "from-orange-500 via-red-500 to-pink-600",
      icon: "🛡️",
    },
  ]

  const quickActions = [
    {
      icon: Target,
      label: "Spin Wheel",
      labelBn: "স্পিন হুইল",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      screen: "spin",
      hasDropdown: true,
      dropdownItems: [
        { label: "ডেইলি স্পিন", labelBn: "ডেইলি স্পিন", reward: "৫০-৫০০ টাকা", icon: "🎯" },
        { label: "লাকি স্পিন", labelBn: "লাকি স্পিন", reward: "১০০-১০০০ টাকা", icon: "🍀" },
        { label: "মেগা স্পিন", labelBn: "মেগা স্পিন", reward: "৫০০-৫০০০ টাকা", icon: "💫" },
      ],
    },
    {
      icon: Calendar,
      label: "Events",
      labelBn: "ইভেন্ট",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      screen: "events",
      hasDropdown: true,
      dropdownItems: [
        { label: "চলমান ইভেন্ট", labelBn: "চলমান ইভেন্ট", count: "৩টি", icon: "🎉" },
        { label: "আসছে শীঘ্রই", labelBn: "আসছে শীঘ্রই", count: "২টি", icon: "⏰" },
        { label: "সম্পন্ন ইভেন্ট", labelBn: "সম্পন্ন ইভেন্ট", count: "৫টি", icon: "✅" },
      ],
    },
    {
      icon: Gift,
      label: "Free Gift",
      labelBn: "ফ্রি গিফট",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
      screen: "freegift",
      hasDropdown: true,
      dropdownItems: [
        { label: "ডেইলি গিফট", labelBn: "ডেইলি গিফট", status: "উপলব্ধ", icon: "🎁" },
        { label: "প্রিমিয়াম গিফট", labelBn: "প্রিমিয়াম গিফট", status: "প্যাকেজ প্রয়োজন", icon: "💝" },
        { label: "স্পেশাল গিফট", labelBn: "স্পেশাল গিফট", status: "VIP সদস্য", icon: "🏆" },
      ],
    },
    {
      icon: CheckCircle,
      label: "Daily Task",
      labelBn: "দৈনিক কাজ",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      screen: "tasks",
      hasDropdown: true,
      dropdownItems: [
        { label: "সহজ কাজ", labelBn: "সহজ কাজ", reward: "১০-৫০ টাকা", icon: "✅" },
        { label: "ভিডিও দেখুন", labelBn: "ভিডিও দেখুন", reward: "২০-১০০ টাকা", icon: "📺" },
        { label: "রেফার করুন", labelBn: "রেফার করুন", reward: "১০০-৫০০ টাকা", icon: "👥" },
      ],
    },
    {
      icon: TrendingUp,
      label: "Invest Now",
      labelBn: "এখনই বিনিয়োগ",
      color: "bg-gradient-to-r from-indigo-500 to-purple-500",
      screen: "invest",
      hasDropdown: true,
      dropdownItems: [
        { label: "স্টার্টার", labelBn: "স্টার্টার", amount: "৩,০০০ টাকা", return: "২০%", icon: "🥉" },
        { label: "প্রিমিয়াম", labelBn: "প্রিমিয়াম", amount: "৮,০০০ টাকা", return: "২৫%", icon: "🥈" },
        { label: "ভিআইপি", labelBn: "ভিআইপি", amount: "১৫,০০০ টাকা", return: "৩০%", icon: "🥇" },
      ],
    },
    {
      icon: ShoppingBag,
      label: "Product Store",
      labelBn: "পণ্যের দোকান",
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
      screen: "store",
      hasDropdown: true,
      dropdownItems: [
        { label: "ইলেকট্রনিক্স", labelBn: "ইলেকট্রনিক্স", count: "১২টি", icon: "📱" },
        { label: "ফ্যাশন", labelBn: "ফ্যাশন", count: "৮টি", icon: "👕" },
        { label: "গিফট কার্ড", labelBn: "গিফট কার্ড", count: "৫টি", icon: "💳" },
      ],
    },
  ]

  const handleQuickAction = (action: any, dropdownItem?: any) => {
    setShowDropdown(null)
    if (soundEnabled) sounds.buttonClick()
    if (action.screen) {
      setActiveTab(action.screen)
    }
  }

  const toggleDropdown = (actionLabel: string) => {
    if (soundEnabled) sounds.buttonClick()
    setShowDropdown(showDropdown === actionLabel ? null : actionLabel)
  }

  const handleLoginBonus = () => {
    if (soundEnabled) sounds.rewardSmall()
    setShowLoginBonus(true)
  }

  const handleCloseLoginBonus = () => {
    if (soundEnabled) sounds.coinCollect()
    setShowLoginBonus(false)
  }

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Enhanced Hero Carousel */}
      <div className="relative h-56 rounded-2xl overflow-hidden shadow-2xl">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div key={index} className={`min-w-full h-full bg-gradient-to-br ${slide.bg} relative`}>
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
              </div>

              <div className="absolute bottom-6 left-6 text-white z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{slide.icon}</span>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <img src="/amac-logo.svg" alt="AMAC" className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-xl font-bold bangla-text mb-1">
                  {slide.title.replace("{name}", user?.name || "ব্যবহারকারী")}
                </h2>
                <p className="text-sm opacity-90 bangla-text">{slide.subtitle}</p>
              </div>

              {/* Trust Indicators */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Shield className="h-4 w-4 text-white" />
                  <span className="text-xs text-white font-medium">নিরাপদ</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Verified className="h-4 w-4 text-white" />
                  <span className="text-xs text-white font-medium">যাচাইকৃত</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <SoundButton
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all p-0 h-auto min-h-0 ${
                index === currentSlide ? "bg-white w-6" : "bg-white/50"
              }`}
              soundType="click"
              enableHoverSound={false}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Balance Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className={`bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white border-0 shadow-xl transform transition-all duration-700 hover:scale-105 cursor-pointer ${
            animateCards ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          onClick={() => soundEnabled && sounds.buttonClick()}
        >
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm opacity-90 bangla-text">মোট ব্যালেন্স</p>
                <p className="text-2xl font-bold">৳{user?.balance?.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs opacity-80">+১২% আজকে</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <Wallet className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white border-0 shadow-xl transform transition-all duration-700 delay-100 hover:scale-105 cursor-pointer ${
            animateCards ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          onClick={() => soundEnabled && sounds.buttonClick()}
        >
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-4 -translate-x-4"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm opacity-90 bangla-text">দৈনিক আয়</p>
                <p className="text-2xl font-bold">৳{user?.dailyEarning}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3" />
                  <span className="text-xs opacity-80">স্থিতিশীল</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions with Dropdowns */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold bangla-text">দ্রুত অ্যাকশন</h3>
          <Badge variant="outline" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            নতুন ফিচার
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <div key={index} className="relative">
              <SoundButton
                variant="outline"
                className={`h-20 w-full flex-col gap-2 border-2 hover:border-primary bg-white hover:bg-gray-50 relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  animateCards ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => (action.hasDropdown ? toggleDropdown(action.label) : handleQuickAction(action))}
                soundType="click"
              >
                <div
                  className={`absolute inset-0 ${action.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-full ${action.color} shadow-lg`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium bangla-text text-center">{action.labelBn}</span>
                  {action.hasDropdown && (
                    <ChevronDown
                      className={`h-3 w-3 text-gray-400 transition-transform ${
                        showDropdown === action.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </SoundButton>

              {/* Dropdown Menu */}
              {action.hasDropdown && showDropdown === action.label && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2">
                  {action.dropdownItems?.map((item, itemIndex) => (
                    <SoundButton
                      key={itemIndex}
                      onClick={() => handleQuickAction(action, item)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 group h-auto justify-start bg-transparent"
                      variant="ghost"
                      soundType="click"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className="font-medium text-sm bangla-text">{item.labelBn}</p>
                            <p className="text-xs text-gray-500">
                              {item.reward || item.count || item.status || item.amount}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </SoundButton>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Investment Status */}
      <Card
        className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-xl transition-shadow cursor-pointer"
        onClick={() => soundEnabled && sounds.buttonClick()}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <div className="bg-blue-500 rounded-full p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            বিনিয়োগের অবস্থা
            <Badge className="bg-green-100 text-green-800 ml-auto">সক্রিয়</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-gray-600 bangla-text">সক্রিয় বিনিয়োগ</p>
                <p className="text-xl font-bold text-blue-600">৳৮,০০০</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-gray-600 bangla-text">মোট রিটার্ন</p>
                <p className="text-xl font-bold text-green-600">৳২,৪০০</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 bangla-text">পরবর্তী পেমেন্ট</span>
                <span className="text-sm font-medium">২৪ ঘন্টা</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Login Streak Bonus */}
      <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-0 shadow-xl relative overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <CardContent className="p-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-3">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-90 bangla-text">লগইন স্ট্রিক বোনাস</p>
                <p className="text-lg font-bold">{user?.loginStreak} দিন 🔥</p>
                <p className="text-xs opacity-80">পরবর্তী বোনাস: ৳৫০</p>
              </div>
            </div>
            <SoundButton
              size="sm"
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={handleLoginBonus}
              soundType="success"
            >
              <Gift className="h-4 w-4 mr-1" />
              সংগ্রহ করুন
            </SoundButton>
          </div>
        </CardContent>
      </Card>

      {/* Trust & Security Section */}
      <Card
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => soundEnabled && sounds.buttonClick()}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="bg-green-500 rounded-full p-2 w-fit mx-auto mb-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-medium bangla-text">১০০% নিরাপদ</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 rounded-full p-2 w-fit mx-auto mb-2">
                <Verified className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-medium bangla-text">যাচাইকৃত</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 rounded-full p-2 w-fit mx-auto mb-2">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-medium bangla-text">প্রিমিয়াম</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Login Bonus Modal */}
      {showLoginBonus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-10"></div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
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
                <Gift className="h-10 w-10 text-white" />
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
                <p className="text-gray-600 mb-4 bangla-text">আপনি ৫০ টাকা বোনাস পেয়েছেন!</p>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-4 animate-pulse">+৳৫০</div>
              <SoundButton
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200"
                onClick={handleCloseLoginBonus}
                soundType="success"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                ধন্যবাদ
              </SoundButton>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(null)
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showDropdown])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/amac-logo.svg" alt="AMAC" className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg">AMAC</span>
              <p className="text-xs text-gray-500">Investment Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SoundButton
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2"
              soundType={soundEnabled ? "click" : "success"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </SoundButton>
            <div className="relative">
              <SoundButton variant="outline" size="sm" className="p-2" soundType="notification">
                <Bell className="h-5 w-5" />
              </SoundButton>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </div>
            <SoundButton variant="outline" size="sm" className="p-2" soundType="click">
              <Settings className="h-5 w-5" />
            </SoundButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {activeTab === "home" && renderHomeContent()}
        {activeTab === "spin" && <EnhancedSpinWheelScreen />}
        {activeTab === "events" && <EnhancedEventsScreen />}
        {activeTab === "freegift" && <EnhancedFreeGiftScreen user={user} />}
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-1 p-2">
            {[
              { id: "home", icon: Home, label: "Home", labelBn: "হোম", color: "from-blue-500 to-indigo-500" },
              { id: "spin", icon: Target, label: "Spin", labelBn: "স্পিন", color: "from-purple-500 to-pink-500" },
              {
                id: "events",
                icon: Calendar,
                label: "Events",
                labelBn: "ইভেন্ট",
                color: "from-green-500 to-emerald-500",
              },
              { id: "freegift", icon: Gift, label: "Gift", labelBn: "গিফট", color: "from-yellow-500 to-orange-500" },
              { id: "profile", icon: User, label: "Profile", labelBn: "প্রোফাইল", color: "from-gray-500 to-gray-600" },
            ].map((tab) => (
              <SoundButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-1 text-xs bangla-text rounded-lg transition-all duration-300 h-auto ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : "text-gray-600 hover:text-gray-800 bg-transparent"
                }`}
                variant="ghost"
                soundType="click"
              >
                <tab.icon className="h-5 w-5 mb-1" />
                <span className="font-medium">{tab.labelBn}</span>
              </SoundButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
