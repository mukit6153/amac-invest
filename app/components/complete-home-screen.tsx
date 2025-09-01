"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/app/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Wallet, TrendingUp, Briefcase, Gift, Users, Settings, Volume2, VolumeX, Bell, Home, LayoutDashboard, Store, Handshake, PiggyBank, Eye, EyeOff } from 'lucide-react'
import Image from "next/image"
import { useSound } from "@/app/hooks/use-sound"
import SoundButton from "./sound-button"

interface CompleteHomeScreenProps {
  user: User
  onUserUpdate: (user: User) => void
  onLogout: () => void
  isMusicPlaying: boolean
  toggleMusic: () => void
}

export default function CompleteHomeScreen({ user, onUserUpdate, onLogout, isMusicPlaying, toggleMusic }: CompleteHomeScreenProps) {
  const router = useRouter()
  const [showBalance, setShowBalance] = useState(true)
  const { playSound } = useSound()

  const quickActions = [
    { name: "বিনিয়োগ", icon: TrendingUp, href: "/investment" },
    { name: "টাস্ক", icon: Briefcase, href: "/tasks" },
    { name: "ফ্রি গিফট", icon: Gift, href: "/free-gift" },
    { name: "রেফারেল", icon: Users, href: "/referral" },
  ]

  const navItems = [
    { name: "হোম", icon: Home, href: "/" },
    { name: "বিনিয়োগ", icon: PiggyBank, href: "/investment" },
    { name: "টাস্ক", icon: LayoutDashboard, href: "/tasks" },
    { name: "স্টোর", icon: Store, href: "/product-store" },
    { name: "রেফারেল", icon: Handshake, href: "/referral" },
  ]

  const handleNavigation = (href: string) => {
    playSound("click")
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/amac-logo.png" alt="AMAC Logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-gray-800 bangla-text">এএমএসি ইনভেস্টমেন্ট</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => { playSound("click"); /* Handle notifications */ }}>
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMusic}>
            {isMusicPlaying ? (
              <Volume2 className="h-5 w-5 text-gray-600" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-600" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { playSound("click"); router.push("/profile") }}>
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-6 w-6" />
                <span className="text-lg font-semibold bangla-text">মোট ব্যালেন্স</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { playSound("click"); setShowBalance(!showBalance) }}
                className="text-white/80 hover:bg-white/20"
              >
                {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
            </div>
            <div className="text-4xl font-bold bangla-text">
              ৳{showBalance ? user.balance.toFixed(2) : "******"}
            </div>
            <div className="flex justify-between text-sm opacity-90">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="bangla-text">বিনিয়োগ: ৳{user.invested.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="bangla-text">লেভেল: {user.level}</span>
              </div>
            </div>
            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 bangla-text" onClick={() => handleNavigation("/withdraw")}>
              উত্তোলন করুন
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card key={action.name} className="text-center shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => handleNavigation(action.href)}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <action.icon className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 bangla-text">{action.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Banner Carousel (Placeholder) */}
        <Card className="bg-white shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 bangla-text">
              <Image
                src="/placeholder.svg?height=160&width=600"
                alt="Banner Carousel"
                width={600}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Packages (Placeholder) */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">জনপ্রিয় বিনিয়োগ প্যাকেজ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white shadow-md rounded-lg">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-blue-600 bangla-text">স্টার্টার প্যাকেজ</h3>
              <p className="text-sm text-gray-700 bangla-text">দৈনিক ৩% রিটার্ন, ৩০ দিনের জন্য।</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="bangla-text">৳৫০০ - ৳২০০০</span>
                <Button variant="outline" size="sm" className="bangla-text" onClick={() => handleNavigation("/investment")}>
                  বিনিয়োগ করুন
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md rounded-lg">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-blue-600 bangla-text">প্রিমিয়াম প্যাকেজ</h3>
              <p className="text-sm text-gray-700 bangla-text">দৈনিক ৪% রিটার্ন, ৩০ দিনের জন্য।</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="bangla-text">৳২০০০ - ৳১০০০০</span>
                <Button variant="outline" size="sm" className="bangla-text" onClick={() => handleNavigation("/investment")}>
                  বিনিয়োগ করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white p-3 shadow-lg flex justify-around border-t border-gray-200">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className="flex flex-col items-center text-xs text-gray-600 data-[active=true]:text-blue-600"
            data-active={router.pathname === item.href}
            onClick={() => handleNavigation(item.href)}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="bangla-text">{item.name}</span>
          </Button>
        ))}
      </nav>
    </div>
  )
}
