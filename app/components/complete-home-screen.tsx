"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  TrendingUp,
  Users,
  Settings,
  Bell,
  Target,
  Award,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  ChevronRight,
  Play,
  Pause,
  ShoppingBag,
  Crown,
  Flame,
  CheckCircle,
  Sparkles,
  Volume2,
  VolumeX,
  User,
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import InvestmentScreen from "./investment-screen"
import WithdrawScreen from "./withdraw-screen"
import TasksScreen from "./tasks-screen"
import ProfileScreen from "./profile-screen"
import SettingsScreen from "./settings-screen"
import ReferralScreen from "./referral-screen"
import ProductStoreScreen from "./product-store-screen"
import EnhancedSpinWheelScreen from "./enhanced-spin-wheel-screen"
import EnhancedEventsScreen from "./enhanced-events-screen"
import EnhancedFreeGiftScreen from "./enhanced-free-gift-screen"
import {
  authFunctions,
  realtimeFunctions,
  dataFunctions,
  actionFunctions,
  type Banner,
  type InvestmentPackage,
  type Transaction,
  type Investment,
  type Task,
  type Event,
  type Notification,
} from "../lib/database"

interface HomeScreenProps {
  user?: any
}

export default function CompleteHomeScreen({ user: initialUser }: HomeScreenProps) {
  const [user, setUser] = useState<any | null>(initialUser || null)
  const [activeScreen, setActiveScreen] = useState("home")
  const [showBalance, setShowBalance] = useState(true)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [bannerAutoPlay, setBannerAutoPlay] = useState(true)
  const [loading, setLoading] = useState(false)

  // Data states
  const [banners, setBanners] = useState<Banner[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [gifts, setGifts] = useState<any[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [referrals, setReferrals] = useState<any[]>([])

  const { sounds, isEnabled: soundEnabled, setIsEnabled: setSoundEnabled } = useSound()

  useEffect(() => {
    // Load user from localStorage if not provided
    if (!user) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }

    if (user) {
      loadAllData()
      setupRealtimeSubscriptions()
    }
  }, [user])

  // Auto-slide banners
  useEffect(() => {
    if (bannerAutoPlay && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [bannerAutoPlay, banners.length])

  const loadAllData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load all data in parallel
      const [
        bannersData,
        investmentsData,
        transactionsData,
        packagesData,
        tasksData,
        eventsData,
        giftsData,
        notificationsData,
        referralsData,
      ] = await Promise.all([
        dataFunctions.getBanners(),
        dataFunctions.getUserInvestments(user.id),
        dataFunctions.getUserTransactions(user.id, 10),
        dataFunctions.getInvestmentPackages(),
        dataFunctions.getActiveTasks(),
        dataFunctions.getActiveEvents(),
        dataFunctions.getActiveGifts(),
        dataFunctions.getUserNotifications(user.id),
        dataFunctions.getUserReferrals(user.id),
      ])

      setBanners(bannersData)
      setInvestments(investmentsData)
      setTransactions(transactionsData)
      setPackages(packagesData)
      setTasks(tasksData)
      setEvents(eventsData)
      setGifts(giftsData)
      setNotifications(notificationsData)
      setReferrals(referralsData)

      // Refresh user data
      const updatedUser = await authFunctions.getCurrentUser(user.id)
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscriptions = () => {
    if (!user) return

    // Subscribe to user updates
    const userSubscription = realtimeFunctions.subscribeToUserUpdates(user.id, (updatedUser) => {
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      if (soundEnabled) sounds.success()
    })

    // Subscribe to new transactions
    const transactionSubscription = realtimeFunctions.subscribeToTransactions(user.id, (newTransaction) => {
      setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)])
      if (soundEnabled) sounds.coinCollect()
    })

    // Subscribe to new notifications
    const notificationSubscription = realtimeFunctions.subscribeToNotifications(user.id, (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])
      if (soundEnabled) sounds.notification()
    })

    // Subscribe to investment updates
    const investmentSubscription = realtimeFunctions.subscribeToInvestments(user.id, (updatedInvestment) => {
      setInvestments((prev) => prev.map((inv) => (inv.id === updatedInvestment.id ? updatedInvestment : inv)))
      if (soundEnabled) sounds.success()
    })

    // Cleanup subscriptions on unmount
    return () => {
      userSubscription.unsubscribe()
      transactionSubscription.unsubscribe()
      notificationSubscription.unsubscribe()
      investmentSubscription.unsubscribe()
    }
  }

  const handleQuickAction = async (action: string, data?: any) => {
    if (soundEnabled) sounds.buttonClick()

    switch (action) {
      case "spin":
        setActiveScreen("spin")
        break
      case "events":
        setActiveScreen("events")
        break
      case "freegift":
        setActiveScreen("freegift")
        break
      case "tasks":
        setActiveScreen("tasks")
        break
      case "invest":
        setActiveScreen("invest")
        break
      case "withdraw":
        setActiveScreen("withdraw")
        break
      case "referral":
        setActiveScreen("referral")
        break
      case "store":
        setActiveScreen("store")
        break
      case "profile":
        setActiveScreen("profile")
        break
      case "settings":
        setActiveScreen("settings")
        break
      default:
        setActiveScreen("home")
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length
  const activeInvestments = investments.filter((i) => i.status === "active")
  const totalDailyReturn = activeInvestments.reduce((sum, inv) => sum + inv.daily_return, 0)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/amac-logo.svg" alt="AMAC" className="w-10 h-10" />
          </div>
          <p className="text-gray-600">লগইন করুন</p>
        </div>
      </div>
    )
  }

  // Render different screens based on activeScreen
  if (activeScreen === "invest") {
    return <InvestmentScreen user={user} onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "withdraw") {
    return <WithdrawScreen user={user} onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "tasks") {
    return <TasksScreen user={user} onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "profile") {
    return <ProfileScreen user={user} onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "settings") {
    return <SettingsScreen user={user} onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "referral") {
    return <ReferralScreen user={user} onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "store") {
    return <ProductStoreScreen user={user} onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "spin") {
    return <EnhancedSpinWheelScreen onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "events") {
    return <EnhancedEventsScreen onBack={() => setActiveScreen("home")} />
  }

  if (activeScreen === "freegift") {
    return <EnhancedFreeGiftScreen user={user} onBack={() => setActiveScreen("home")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <img src="/amac-logo.svg" alt="AMAC" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800 text-lg">AMAC</h1>
                <p className="text-xs text-gray-600">স্বাগতম, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SoundButton
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="relative"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </SoundButton>
              <SoundButton variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-red-500">
                    {unreadNotifications}
                  </Badge>
                )}
              </SoundButton>
              <SoundButton variant="ghost" size="sm" onClick={() => handleQuickAction("settings")}>
                <Settings className="h-4 w-4" />
              </SoundButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-3 space-y-4">
        {/* Banner Slider */}
        {banners.length > 0 && (
          <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="min-w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 relative cursor-pointer"
                  onClick={() => handleQuickAction("banner", { banner })}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                    <h3 className="text-lg font-bold mb-1">{banner.title_bn}</h3>
                    <p className="text-sm opacity-90">{banner.description_bn}</p>
                  </div>
                  {/* Animated elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
                </div>
              ))}
            </div>

            {/* Banner Controls */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBannerIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-3 right-3">
              <SoundButton
                variant="ghost"
                size="sm"
                onClick={() => setBannerAutoPlay(!bannerAutoPlay)}
                className="text-white hover:bg-white/20"
              >
                {bannerAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </SoundButton>
            </div>
          </div>
        )}

        {/* Balance Cards - Compact */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <Wallet className="h-4 w-4 opacity-80" />
                <SoundButton
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-1 h-6 w-6"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </SoundButton>
              </div>
              <div className="text-lg font-bold">{showBalance ? `৳${user.balance.toLocaleString()}` : "••••••"}</div>
              <p className="text-xs opacity-80">মূল ব্যালেন্স</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <Award className="h-4 w-4 opacity-80" />
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  বোনাস
                </Badge>
              </div>
              <div className="text-lg font-bold">
                {showBalance ? `৳${user.bonus_balance.toLocaleString()}` : "••••••"}
              </div>
              <p className="text-xs opacity-80">বোনাস</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <TrendingUp className="h-4 w-4 opacity-80" />
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  দৈনিক
                </Badge>
              </div>
              <div className="text-lg font-bold">৳{totalDailyReturn.toLocaleString()}</div>
              <p className="text-xs opacity-80">দৈনিক আয়</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-2 text-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <div className="text-sm font-bold text-blue-600">৳{user.total_invested.toLocaleString()}</div>
              <p className="text-xs text-gray-600">বিনিয়োগ</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-2 text-center">
              <Award className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <div className="text-sm font-bold text-green-600">৳{user.total_earned.toLocaleString()}</div>
              <p className="text-xs text-gray-600">আয়</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-2 text-center">
              <Users className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <div className="text-sm font-bold text-purple-600">{referrals.length}</div>
              <p className="text-xs text-gray-600">রেফারেল</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-2 text-center">
              <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
              <div className="text-sm font-bold text-orange-600">{user.login_streak}</div>
              <p className="text-xs text-gray-600">স্ট্রিক</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              দ্রুত কাজ
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                নতুন
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-4 gap-3">
              {/* Investment */}
              <SoundButton
                variant="outline"
                className="h-16 flex-col gap-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200"
                onClick={() => handleQuickAction("invest")}
              >
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-medium">বিনিয়োগ</span>
              </SoundButton>

              {/* Withdraw */}
              <SoundButton
                variant="outline"
                className="h-16 flex-col gap-1 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200"
                onClick={() => handleQuickAction("withdraw")}
              >
                <ArrowUpRight className="h-5 w-5 text-green-600" />
                <span className="text-xs font-medium">উইথড্র</span>
              </SoundButton>

              {/* Spin Wheel */}
              <SoundButton
                variant="outline"
                className="h-16 flex-col gap-1 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 relative"
                onClick={() => handleQuickAction("spin")}
              >
                <Target className="h-5 w-5 text-purple-600" />
                <span className="text-xs font-medium">স্পিন</span>
              </SoundButton>

              {/* Tasks */}
              <SoundButton
                variant="outline"
                className="h-16 flex-col gap-1 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200 relative"
                onClick={() => handleQuickAction("tasks")}
              >
                <CheckCircle className="h-5 w-5 text-orange-600" />
                <span className="text-xs font-medium">টাস্ক</span>
                {tasks.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 bg-red-500">{tasks.length}</Badge>
                )}
              </SoundButton>

              {/* Events */}
              <SoundButton
                variant="outline"
                className="h-16 flex-col gap-1 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:from-pink-100 hover:to-pink-200 relative"
                onClick={() => handleQuickAction("events")}
              >
                <Calendar className="h-5 w-5 text-pink-600" />
                <span className="text-xs font-medium">ইভেন্ট</span>
                {events.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 bg-green-500">{events.length}</Badge>
                )}
              </SoundButton>

              {/* Free Gifts */}
              <SoundButton
                variant="outline"
                className="h-16 flex-col gap-1 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200 relative"
                onClick={() => handleQuickAction("freegift")}
              >
                <span className="h-5 w-5 text-yellow-600" />
                <span className="text-xs font-medium">গিফট</span>
                {gifts.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 bg-red-500">{gifts.length}</Badge>
                )}
              </SoundButton>

              {/* Referral */}
              <SoundButton
                variant="outline"
                className="h-16 flex-col gap-1 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200"
                onClick={() => handleQuickAction("referral")}
              >
                <Users className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-medium">রেফারেল</span>
              </SoundButton>

              {/* Store */}
              <SoundButton
                variant="outline"
                className="h-16 flex-col gap-1 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-200"
                onClick={() => handleQuickAction("store")}
              >
                <ShoppingBag className="h-5 w-5 text-teal-600" />
                <span className="text-xs font-medium">স্টোর</span>
              </SoundButton>
            </div>
          </CardContent>
        </Card>

        {/* Investment Packages - Horizontal Scroll */}
        {packages.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                বিনিয়োগ প্যাকেজ
                <SoundButton variant="ghost" size="sm" onClick={() => handleQuickAction("invest")}>
                  <ChevronRight className="h-4 w-4" />
                </SoundButton>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {packages.slice(0, 3).map((pkg) => (
                  <div
                    key={pkg.id}
                    className="min-w-[140px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleQuickAction("invest", { packageId: pkg.id })}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">{pkg.name_bn}</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600 mb-1">৳{pkg.min_amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 mb-2">{pkg.daily_rate}% দৈনিক</div>
                    <SoundButton
                      size="sm"
                      className="w-full text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQuickAction("invest", { packageId: pkg.id })
                      }}
                    >
                      বিনিয়োগ করুন
                    </SoundButton>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Investments - Compact */}
        {activeInvestments.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                সক্রিয় বিনিয়োগ
                <Badge variant="secondary" className="text-xs">
                  {activeInvestments.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {activeInvestments.slice(0, 2).map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{investment.investment_packages?.name_bn}</p>
                      <p className="text-xs text-gray-600">৳{investment.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+৳{investment.daily_return}</p>
                    <p className="text-xs text-gray-500">
                      {investment.days_completed}/{investment.total_days}
                    </p>
                  </div>
                </div>
              ))}
              {activeInvestments.length > 2 && (
                <SoundButton
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleQuickAction("invest")}
                >
                  আরও দেখুন (+{activeInvestments.length - 2})
                </SoundButton>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions - Compact */}
        {transactions.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                সাম্প্রতিক লেনদেন
                <SoundButton variant="ghost" size="sm" onClick={() => loadAllData()}>
                  <RefreshCw className="h-4 w-4" />
                </SoundButton>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        transaction.type === "deposit"
                          ? "bg-green-100"
                          : transaction.type === "withdraw"
                            ? "bg-red-100"
                            : transaction.type === "investment"
                              ? "bg-blue-100"
                              : transaction.type === "return"
                                ? "bg-purple-100"
                                : "bg-orange-100"
                      }`}
                    >
                      {transaction.type === "deposit" && <ArrowDownLeft className="h-3 w-3 text-green-600" />}
                      {transaction.type === "withdraw" && <ArrowUpRight className="h-3 w-3 text-red-600" />}
                      {transaction.type === "investment" && <TrendingUp className="h-3 w-3 text-blue-600" />}
                      {transaction.type === "return" && <DollarSign className="h-3 w-3 text-purple-600" />}
                      {(transaction.type === "bonus" || transaction.type === "referral") && (
                        <Award className="h-3 w-3 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-xs">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium text-sm ${transaction.type === "withdraw" ? "text-red-600" : "text-green-600"}`}
                    >
                      {transaction.type === "withdraw" ? "-" : "+"}৳{transaction.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {transaction.status === "completed"
                        ? "সম্পন্ন"
                        : transaction.status === "pending"
                          ? "অপেক্ষমাণ"
                          : "ব্যর্থ"}
                    </Badge>
                  </div>
                </div>
              ))}
              <SoundButton variant="outline" size="sm" className="w-full text-xs">
                সব লেনদেন দেখুন
              </SoundButton>
            </CardContent>
          </Card>
        )}

        {/* Tasks & Events Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Available Tasks */}
          {tasks.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  টাস্ক ({tasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {tasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="p-2 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium">{task.title_bn}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-green-600">৳{task.reward}</span>
                      <SoundButton size="sm" className="h-6 text-xs px-2" onClick={() => handleQuickAction("tasks")}>
                        করুন
                      </SoundButton>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Active Events */}
          {events.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  ইভেন্ট ({events.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {events.slice(0, 2).map((event) => (
                  <div key={event.id} className="p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium">{event.title_bn}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-blue-600">{event.reward}</span>
                      <SoundButton size="sm" className="h-6 text-xs px-2" onClick={() => handleQuickAction("events")}>
                        যোগ দিন
                      </SoundButton>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Referral Code */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs opacity-80">রেফারেল কোড</p>
                  <div className="text-lg font-bold font-mono">{user.referral_code}</div>
                </div>
              </div>
              <SoundButton
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1"
                onClick={() => handleQuickAction("referral")}
              >
                শেয়ার
              </SoundButton>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                বিজ্ঞপ্তি
                <Badge variant="secondary" className="text-xs">
                  {unreadNotifications} নতুন
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 rounded-lg border-l-4 cursor-pointer ${
                    notification.read
                      ? "bg-gray-50 border-gray-300"
                      : notification.type === "success"
                        ? "bg-green-50 border-green-500"
                        : notification.type === "warning"
                          ? "bg-yellow-50 border-yellow-500"
                          : notification.type === "error"
                            ? "bg-red-50 border-red-500"
                            : "bg-blue-50 border-blue-500"
                  }`}
                  onClick={() => actionFunctions.markNotificationAsRead(notification.id)}
                >
                  <p className="text-sm font-medium">{notification.title_bn}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message_bn}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleDateString("bn-BD")}
                  </p>
                </div>
              ))}
              {notifications.length > 3 && (
                <SoundButton variant="outline" size="sm" className="w-full text-xs">
                  সব বিজ্ঞপ্তি দেখুন
                </SoundButton>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bottom Navigation Spacer */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-md mx-auto px-2 py-2">
          <div className="flex items-center justify-around">
            <SoundButton
              variant="ghost"
              className={`flex-col gap-1 h-12 px-2 ${activeScreen === "home" ? "text-blue-600" : ""}`}
              onClick={() => handleQuickAction("home")}
            >
              <Wallet className="h-5 w-5" />
              <span className="text-xs font-medium">হোম</span>
            </SoundButton>
            <SoundButton
              variant="ghost"
              className={`flex-col gap-1 h-12 px-2 ${activeScreen === "invest" ? "text-blue-600" : ""}`}
              onClick={() => handleQuickAction("invest")}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs">বিনিয়োগ</span>
            </SoundButton>
            <SoundButton
              variant="ghost"
              className={`flex-col gap-1 h-12 px-2 relative ${activeScreen === "tasks" ? "text-blue-600" : ""}`}
              onClick={() => handleQuickAction("tasks")}
            >
              <Target className="h-5 w-5" />
              <span className="text-xs">টাস্ক</span>
              {tasks.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 bg-red-500">{tasks.length}</Badge>
              )}
            </SoundButton>
            <SoundButton
              variant="ghost"
              className={`flex-col gap-1 h-12 px-2 ${activeScreen === "withdraw" ? "text-blue-600" : ""}`}
              onClick={() => handleQuickAction("withdraw")}
            >
              <ArrowUpRight className="h-5 w-5" />
              <span className="text-xs">উইথড্র</span>
            </SoundButton>
            <SoundButton
              variant="ghost"
              className={`flex-col gap-1 h-12 px-2 ${activeScreen === "profile" ? "text-blue-600" : ""}`}
              onClick={() => handleQuickAction("profile")}
            >
              <User className="h-5 w-5" />
              <span className="text-xs">প্রোফাইল</span>
            </SoundButton>
          </div>
        </div>
      </div>
    </div>
  )
}
