"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Home,
  TrendingUp,
  Users,
  User,
  Gift,
  Wallet,
  ShoppingBag,
  CheckCircle,
  Banknote,
  Target,
  Bell,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import TasksScreen from "./tasks-screen"
import InvestmentScreen from "./investment-screen"
import WithdrawScreen from "./withdraw-screen"
import ProfileScreen from "./profile-screen"

interface HomeScreenProps {
  user: any
}

export default function HomeScreen({ user }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [showLoginBonus, setShowLoginBonus] = useState(false)

  const quickActions = [
    { icon: CheckCircle, label: "Daily Task", labelBn: "দৈনিক কাজ", color: "bg-green-500", screen: "tasks" },
    { icon: TrendingUp, label: "Invest Now", labelBn: "এখনই বিনিয়োগ", color: "bg-blue-500", screen: "invest" },
    { icon: Gift, label: "Login Bonus", labelBn: "লগইন বোনাস", color: "bg-purple-500", action: "bonus" },
    { icon: ShoppingBag, label: "Product Store", labelBn: "পণ্যের দোকান", color: "bg-orange-500", screen: "store" },
    { icon: Users, label: "Refer & Earn", labelBn: "রেফার ও আয়", color: "bg-pink-500", screen: "referral" },
    { icon: Target, label: "My Progress", labelBn: "আমার অগ্রগতি", color: "bg-indigo-500", screen: "progress" },
  ]

  const handleQuickAction = (action: any) => {
    if (action.action === "bonus") {
      setShowLoginBonus(true)
      setTimeout(() => setShowLoginBonus(false), 3000)
    } else if (action.screen) {
      setActiveTab(action.screen)
    }
  }

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-48 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-xl font-bold bangla-text">স্বাগতম, {user?.name} ভাই!</h2>
          <p className="text-sm opacity-90">আপনার বিনিয়োগ যাত্রা শুরু করুন</p>
        </div>
        <div className="absolute top-4 right-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <img src="/amac-logo.svg" alt="AMAC" className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">মোট ব্যালেন্স</p>
                <p className="text-2xl font-bold">৳{user?.balance?.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">দৈনিক আয়</p>
                <p className="text-2xl font-bold">৳{user?.dailyEarning}</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 bangla-text">দ্রুত অ্যাকশন</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 flex-col gap-2 border-2 hover:border-primary bg-transparent"
              onClick={() => handleQuickAction(action)}
            >
              <action.icon className={cn("h-6 w-6 text-white rounded-full p-1", action.color)} />
              <span className="text-xs font-medium bangla-text">{action.labelBn}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Investment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <TrendingUp className="h-5 w-5" />
            বিনিয়োগের অবস্থা
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>সক্রিয় বিনিয়োগ</span>
              <span className="font-semibold">৳৮,০০০</span>
            </div>
            <div className="flex justify-between">
              <span>মোট রিটার্ন</span>
              <span className="font-semibold text-green-600">৳২,৪০০</span>
            </div>
            <div className="flex justify-between">
              <span>পরবর্তী পেমেন্ট</span>
              <span className="font-semibold">২৪ ঘন্টা</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Streak Bonus */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 bangla-text">লগইন স্ট্রিক বোনাস</p>
              <p className="text-lg font-bold">{user?.loginStreak} দিন 🔥</p>
              <p className="text-xs opacity-80">পরবর্তী বোনাস: ৳৫০</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => handleQuickAction({ action: "bonus" })}>
              সংগ্রহ করুন
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login Bonus Modal */}
      {showLoginBonus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 bangla-text">অভিনন্দন! 🎉</h3>
              <p className="text-gray-600 mb-4 bangla-text">আপনি ৫০ টাকা বোনাস পেয়েছেন!</p>
              <div className="text-2xl font-bold text-green-600 mb-4">+৳৫০</div>
              <Button className="w-full" onClick={() => setShowLoginBonus(false)}>
                ধন্যবাদ
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm">
            <img src="/amac-logo.svg" alt="AMAC" className="w-6 h-6" />
          </div>
          <span className="font-bold">AMAC</span>
          <span className="text-sm text-gray-500">Investment Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Bell className="h-4 w-4" />
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Settings className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {activeTab === "home" && renderHomeContent()}
        {activeTab === "tasks" && <TasksScreen />}
        {activeTab === "invest" && <InvestmentScreen />}
        {activeTab === "withdraw" && <WithdrawScreen user={user} />}
        {activeTab === "profile" && <ProfileScreen user={user} />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-5 gap-1">
            {[
              { id: "home", icon: Home, label: "Home", labelBn: "হোম" },
              { id: "tasks", icon: CheckCircle, label: "Tasks", labelBn: "কাজ" },
              { id: "invest", icon: TrendingUp, label: "Invest", labelBn: "বিনিয়োগ" },
              { id: "withdraw", icon: Banknote, label: "Withdraw", labelBn: "উইথড্র" },
              { id: "profile", icon: User, label: "Profile", labelBn: "প্রোফাইল" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center py-2 px-1 text-xs bangla-text",
                  activeTab === tab.id ? "text-blue-600" : "text-gray-600",
                )}
              >
                <tab.icon className="h-5 w-5 mb-1" />
                <span>{tab.labelBn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
