"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Home, TrendingUp, Wallet, Gift, Users, Settings, Bell, Eye, EyeOff, Copy, Share2, ChevronRight, Target, Calendar, ArrowUpRight, LogOut, UserIcon, ShoppingBag, Gamepad2, PartyPopper, Volume2, VolumeX } from 'lucide-react'
import { useSound } from "../hooks/use-sound"
import SoundButton from "./sound-button"
import InvestmentScreen from "./investment-screen"
import type { User as UserType, InvestmentPackage, Transaction } from "../lib/database"

interface CompleteHomeScreenProps {
  user: UserType
  dailyBonus?: number
  onLogout?: () => void
  onUserUpdate?: (user: UserType) => void
}

export default function CompleteHomeScreen({
  user: initialUser,
  dailyBonus = 0,
  onLogout,
  onUserUpdate,
}: CompleteHomeScreenProps) {
  const [user, setUser] = useState<UserType | null>(initialUser || null)
  const [currentScreen, setCurrentScreen] = useState("home")
  const [showBalance, setShowBalance] = useState(true)
  const [showDailyBonus, setShowDailyBonus] = useState(false)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Data states
  const [investments, setInvestments] = useState<InvestmentPackage[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { sounds, isEnabled: soundEnabled, setIsEnabled: setSoundEnabled, playSound } = useSound()

  const investmentPackages = [
    {
      id: 1,
      name: "স্টার্টার প্যাকেজ",
      minAmount: 500,
      maxAmount: 2000,
      dailyReturn: 3,
      duration: 30,
      totalReturn: 90,
      popular: false,
    },
    {
      id: 2,
      name: "প্রিমিয়াম প্যাকেজ",
      minAmount: 2000,
      maxAmount: 10000,
      dailyReturn: 4,
      duration: 30,
      totalReturn: 120,
      popular: true,
    },
    {
      id: 3,
      name: "ভিআইপি প্যাকেজ",
      minAmount: 10000,
      maxAmount: 50000,
      dailyReturn: 5,
      duration: 30,
      totalReturn: 150,
      popular: false,
    },
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "investment",
      amount: 1000,
      status: "completed",
      date: "2024-01-15",
      description: "প্রিমিয়াম প্যাকেজে বিনিয়োগ",
    },
    {
      id: 2,
      type: "earning",
      amount: 40,
      status: "completed",
      date: "2024-01-14",
      description: "দৈনিক রিটার্ন",
    },
    {
      id: 3,
      type: "referral",
      amount: 100,
      status: "completed",
      date: "2024-01-13",
      description: "রেফারেল বোনাস",
    },
  ]

  const quickActions = [
    { id: "invest", icon: TrendingUp, label: "বিনিয়োগ", color: "bg-blue-500" },
    { id: "withdraw", icon: Wallet, label: "উত্তোলন", color: "bg-green-500" },
    { id: "tasks", icon: Target, label: "টাস্ক", color: "bg-purple-500" },
    { id: "referral", icon: Users, label: "রেফার", color: "bg-orange-500" },
    { id: "spin", icon: Gamepad2, label: "স্পিন", color: "bg-pink-500" },
    { id: "events", icon: Calendar, label: "ইভেন্ট", color: "bg-indigo-500" },
    { id: "gifts", icon: Gift, label: "গিফট", color: "bg-red-500" },
    { id: "store", icon: ShoppingBag, label: "স্টোর", color: "bg-cyan-500" },
  ]

  const bannersData = [
    {
      id: 1,
      title: "বিশেষ বোনাস অফার!",
      subtitle: "৫০% পর্যন্ত বোনাস পান",
      image: "/placeholder.svg?height=120&width=300&text=Special+Bonus",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      title: "নতুন প্যাকেজ চালু!",
      subtitle: "দৈনিক ৫% রিটার্ন",
      image: "/placeholder.svg?height=120&width=300&text=New+Package",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      title: "রেফার করুন ও আয় করুন",
      subtitle: "১০% কমিশন পান",
      image: "/placeholder.svg?height=120&width=300&text=Referral+Bonus",
      color: "from-green-500 to-emerald-500",
    },
  ]

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannersData.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [bannersData.length])

  // Check for daily bonus
  useEffect(() => {
    const lastBonusDate = localStorage.getItem("lastBonusDate")
    const today = new Date().toDateString()

    if (lastBonusDate !== today) {
      setShowDailyBonus(true)
    }
  }, [])

  const handleDailyBonus = () => {
    playSound("success")
    localStorage.setItem("lastBonusDate", new Date().toDateString())
    setShowDailyBonus(false)
    // Add bonus logic here
  }

  const handleQuickAction = async (action: string, data?: any) => {
    if (soundEnabled) sounds.buttonClick()
    playSound("click")

    switch (action) {
      case "spin":
        setCurrentScreen("spin")
        break
      case "events":
        setCurrentScreen("events")
        break
      case "freegift":
        setCurrentScreen("freegift")
        break
      case "tasks":
        setCurrentScreen("tasks")
        break
      case "invest":
        setCurrentScreen("investment")
        break
      case "withdraw":
        setCurrentScreen("withdraw")
        break
      case "referral":
        setCurrentScreen("referral")
        break
      case "store":
        setCurrentScreen("store")
        break
      case "profile":
        setCurrentScreen("profile")
        break
      case "settings":
        setCurrentScreen("settings")
        break
      default:
        setCurrentScreen("home")
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referralCode || "")
    playSound("success")
    alert("রেফারেল কোড কপি হয়েছে!")
  }

  const shareReferralCode = () => {
    if (user?.referralCode && navigator.share) {
      navigator.share({
        title: "AMAC Investment এ যোগ দিন",
        text: `আমার রেফারেল কোড ব্যবহার করে AMAC Investment এ যোগ দিন এবং বোনাস পান: ${user.referralCode}`,
        url: `https://amac-investment.com/register?ref=${user.referralCode}`,
      })
    }
    if (soundEnabled) sounds.buttonClick()
  }

  const handleInvestmentSuccess = (updatedUser: UserType) => {
    setUser(updatedUser)
    if (onUserUpdate) {
      onUserUpdate(updatedUser)
    }
    setCurrentScreen("home")
  }

  // Safe access to user properties with defaults
  const safeUser = user
    ? {
        ...user,
        balance: user.balance || 0,
        invested: user.invested || 0,
        earned: user.earned || 0,
      }
    : null

  // Show investment screen
  if (currentScreen === "investment") {
    return (
      <InvestmentScreen
        user={safeUser!}
        onBack={() => setCurrentScreen("home")}
        onInvestmentSuccess={handleInvestmentSuccess}
      />
    )
  }

  if (currentScreen !== "home") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center bengali-text">
              {currentScreen === "withdraw" && "উত্তোলন"}
              {currentScreen === "tasks" && "টাস্ক"}
              {currentScreen === "referral" && "রেফারেল"}
              {currentScreen === "spin" && "স্পিন হুইল"}
              {currentScreen === "events" && "ইভেন্ট"}
              {currentScreen === "gifts" && "গিফট"}
              {currentScreen === "store" && "স্টোর"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4 bengali-text">এই ফিচারটি শীঘ্রই আসছে...</p>
            <Button onClick={() => setCurrentScreen("home")} className="bengali-text">
              হোমে ফিরুন
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!safeUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <p className="text-gray-600">লগইন করুন</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="font-semibold bengali-text">স্বাগতম, {safeUser.name}</h1>
              <p className="text-xs opacity-90">ID: {safeUser.id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <SoundButton
              soundType="click"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="relative h-8 w-8 p-0"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </SoundButton>
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 border-0">{unreadCount}</Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-white/20">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Banner Slider */}
      <div className="relative h-32 overflow-hidden">
        {bannersData.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-transform duration-500 ${
              index === currentBannerIndex
                ? "translate-x-0"
                : index < currentBannerIndex
                  ? "-translate-x-full"
                  : "translate-x-full"
            }`}
          >
            <div
              className={`h-full bg-gradient-to-r ${banner.color} flex items-center justify-between px-4 text-white`}
            >
              <div>
                <h3 className="font-bold text-lg bengali-text">{banner.title}</h3>
                <p className="text-sm opacity-90 bengali-text">{banner.subtitle}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}

        {/* Banner Indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {bannersData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentBannerIndex ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Balance Cards */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90 bengali-text">মোট ব্যালেন্স</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xl font-bold">{showBalance ? `৳${safeUser.balance.toLocaleString()}` : "৳****"}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90 bengali-text">মোট বিনিয়োগ</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold">{showBalance ? `৳${safeUser.invested.toLocaleString()}` : "৳****"}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm opacity-90 bengali-text">মোট আয়</span>
                <p className="text-2xl font-bold">{showBalance ? `৳${safeUser.earned.toLocaleString()}` : "৳****"}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+12.5%</span>
                </div>
                <span className="text-xs opacity-75 bengali-text">গত মাসের তুলনায়</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-semibold mb-3 bengali-text">দ্রুত অ্যাকশন</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              onClick={() => handleQuickAction(action.id)}
              className="flex flex-col items-center p-3 h-auto space-y-2 hover:bg-gray-100"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-xs bengali-text">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Investment Packages */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold bengali-text">বিনিয়োগ প্যাকেজ</h2>
          <Button variant="ghost" size="sm" className="text-blue-600">
            <span className="bengali-text">সব দেখুন</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {investmentPackages.map((pkg) => (
            <Card key={pkg.id} className="relative overflow-hidden">
              {pkg.popular && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-orange-500 text-white">জনপ্রিয়</Badge>
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold bengali-text">{pkg.name}</h3>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{pkg.dailyReturn}%</p>
                    <p className="text-xs text-gray-500 bengali-text">দৈনিক</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 bengali-text">সর্বনিম্ন</p>
                    <p className="font-semibold">৳{pkg.minAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 bengali-text">সময়কাল</p>
                    <p className="font-semibold">{pkg.duration} দিন</p>
                  </div>
                  <div>
                    <p className="text-gray-500 bengali-text">মোট রিটার্ন</p>
                    <p className="font-semibold text-green-600">{pkg.totalReturn}%</p>
                  </div>
                </div>

                <Button
                  className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 bengali-text"
                  onClick={() => handleQuickAction("invest")}
                >
                  বিনিয়োগ করুন
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold bengali-text">সাম্প্রতিক লেনদেন</h2>
          <Button variant="ghost" size="sm" className="text-blue-600">
            <span className="bengali-text">সব দেখুন</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {recentTransactions.map((transaction, index) => (
              <div key={transaction.id} className={`p-4 ${index !== recentTransactions.length - 1 ? "border-b" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "investment"
                          ? "bg-blue-100 text-blue-600"
                          : transaction.type === "earning"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {transaction.type === "investment" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : transaction.type === "earning" ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <Users className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm bengali-text">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "investment" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {transaction.type === "investment" ? "-" : "+"}৳{transaction.amount}
                    </p>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {transaction.status === "completed" ? "সম্পন্ন" : "অপেক্ষমাণ"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Referral Section */}
      <div className="px-4 mb-4">
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold bengali-text">রেফারেল কোড</h3>
                <p className="text-sm opacity-90 bengali-text">বন্ধুদের আমন্ত্রণ জানান</p>
              </div>
              <Users className="w-8 h-8 opacity-75" />
            </div>

            <div className="bg-white/20 rounded-lg p-3 mb-3">
              <p className="text-center text-xl font-bold tracking-wider">{safeUser.referralCode}</p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={copyReferralCode}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Copy className="w-4 h-4 mr-2" />
                <span className="bengali-text">কপি</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={shareReferralCode}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span className="bengali-text">শেয়ার</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Running Notice */}
      <div className="px-4 mb-20">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm text-yellow-800 animate-marquee whitespace-nowrap bengali-text">
                  🎉 নতুন ব্যবহারকারীদের জন্য ৫০% বোনাস! আজই রেজিস্ট্রেশন করুন এবং বিশেষ অফার পান।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 py-2">
          {[
            { icon: Home, label: "হোম", active: true },
            { icon: TrendingUp, label: "বিনিয়োগ", active: false },
            { icon: Wallet, label: "ওয়ালেট", active: false },
            { icon: Gift, label: "গিফট", active: false },
            { icon: Settings, label: "সেটিংস", active: false },
          ].map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`flex flex-col items-center py-2 px-1 h-auto space-y-1 ${
                item.active ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs bengali-text">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Daily Bonus Dialog */}
      <Dialog open={showDailyBonus} onOpenChange={setShowDailyBonus}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center bengali-text">🎉 দৈনিক বোনাস!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 bengali-text">অভিনন্দন!</h3>
            <p className="text-gray-600 mb-4 bengali-text">আপনি আজকের দৈনিক বোনাস পেয়েছেন</p>
            <div className="bg-green-100 rounded-lg p-4 mb-4">
              <p className="text-2xl font-bold text-green-600">+৳50</p>
              <p className="text-sm text-green-700 bengali-text">বোনাস যোগ হয়েছে</p>
            </div>
            <Button
              onClick={handleDailyBonus}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 bengali-text"
            >
              বোনাস সংগ্রহ করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
