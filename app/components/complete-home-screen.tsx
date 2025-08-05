"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Home,
  TrendingUp,
  Gift,
  Users,
  Settings,
  Bell,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Trophy,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react"
import { type User, dataFunctions, actionFunctions } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"

interface CompleteHomeScreenProps {
  user: User
  dailyBonus: number
  onLogout: () => void
  onUserUpdate: (user: User) => void
}

export default function CompleteHomeScreen({ user, dailyBonus, onLogout, onUserUpdate }: CompleteHomeScreenProps) {
  const [activeTab, setActiveTab] = useState("home")
  const [showBalance, setShowBalance] = useState(true)
  const [banners, setBanners] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [gifts, setGifts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDailyBonusDialog, setShowDailyBonusDialog] = useState(false)

  const { playSound } = useSound()

  // Load data on component mount
  useEffect(() => {
    loadData()

    // Show daily bonus dialog if there's a bonus
    if (dailyBonus > 0) {
      setShowDailyBonusDialog(true)
      playSound("reward")
    }
  }, [dailyBonus])

  const loadData = async () => {
    try {
      const [
        bannersData,
        packagesData,
        tasksData,
        eventsData,
        giftsData,
        transactionsData,
        investmentsData,
        notificationsData,
      ] = await Promise.all([
        dataFunctions.getBanners(),
        dataFunctions.getInvestmentPackages(),
        dataFunctions.getActiveTasks(),
        dataFunctions.getActiveEvents(),
        dataFunctions.getActiveGifts(),
        dataFunctions.getUserTransactions(user.id),
        dataFunctions.getUserInvestments(user.id),
        dataFunctions.getUserNotifications(user.id),
      ])

      setBanners(bannersData)
      setPackages(packagesData)
      setTasks(tasksData)
      setEvents(eventsData)
      setGifts(giftsData)
      setTransactions(transactionsData)
      setInvestments(investmentsData)
      setNotifications(notificationsData)
    } catch (error) {
      console.warn("Error loading data:", error)
    }
  }

  const handleSpinWheel = async (type: "daily" | "premium" | "mega") => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      playSound("spin")

      const result = await actionFunctions.spinWheel(user.id, type)

      if (result.success) {
        playSound("reward")
        setSuccess(`🎉 অভিনন্দন! আপনি ৳${result.prizeAmount} ${result.prizeType === "cash" ? "ক্যাশ" : "বোনাস"} জিতেছেন!`)

        // Update user balance
        const updatedUser = {
          ...user,
          balance: result.prizeType === "cash" ? user.balance + result.prizeAmount : user.balance,
          bonus_balance: result.prizeType === "bonus" ? user.bonus_balance + result.prizeAmount : user.bonus_balance,
        }
        onUserUpdate(updatedUser)

        // Reload data
        loadData()
      } else {
        playSound("error")
        setError(result.error || "স্পিন করতে সমস্যা হয়েছে")
      }
    } catch (error: any) {
      playSound("error")
      setError(error.message || "স্পিন করতে সমস্যা হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      playSound("click")

      const result = await actionFunctions.completeTask(user.id, taskId)

      if (result.success) {
        playSound("success")
        setSuccess(`🎉 টাস্ক সম্পন্ন! ৳${result.reward} বোনাস পেয়েছেন!`)

        // Update user balance
        const updatedUser = {
          ...user,
          bonus_balance: user.bonus_balance + result.reward,
        }
        onUserUpdate(updatedUser)

        // Reload data
        loadData()
      } else {
        playSound("error")
        setError(result.error || "টাস্ক সম্পন্ন করতে সমস্যা হয়েছে")
      }
    } catch (error: any) {
      playSound("error")
      setError(error.message || "টাস্ক সম্পন্ন করতে সমস্যা হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimGift = async (giftId: string) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      playSound("click")

      const result = await actionFunctions.claimGift(user.id, giftId)

      if (result.success) {
        playSound("reward")
        setSuccess(`🎁 গিফট ক্লেইম সফল! ৳${result.reward} বোনাস পেয়েছেন!`)

        // Update user balance
        const updatedUser = {
          ...user,
          bonus_balance: user.bonus_balance + result.reward,
        }
        onUserUpdate(updatedUser)

        // Reload data
        loadData()
      } else {
        playSound("error")
        setError(result.error || "গিফট ক্লেইম করতে সমস্যা হয়েছে")
      }
    } catch (error: any) {
      playSound("error")
      setError(error.message || "গিফট ক্লেইম করতে সমস্যা হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("BDT", "৳")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">স্বাগতম, {user.name}</h1>
            <p className="text-blue-100 text-sm">আজ একটি দুর্দান্ত দিন!</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">মূল ব্যালেন্স</p>
                  <p className="text-2xl font-bold">{showBalance ? formatCurrency(user.balance) : "****"}</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">বোনাস ব্যালেন্স</p>
                  <p className="text-2xl font-bold">{showBalance ? formatCurrency(user.bonus_balance) : "****"}</p>
                </div>
                <Gift className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{user.login_streak}</p>
            <p className="text-blue-100 text-xs">দিনের স্ট্রিক</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{formatCurrency(user.total_invested).replace("৳", "")}</p>
            <p className="text-blue-100 text-xs">মোট বিনিয়োগ</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{formatCurrency(user.total_earned).replace("৳", "")}</p>
            <p className="text-blue-100 text-xs">মোট আয়</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="bg-white border-b">
          <TabsList className="grid w-full grid-cols-5 h-16">
            <TabsTrigger value="home" className="flex flex-col items-center space-y-1">
              <Home className="w-5 h-5" />
              <span className="text-xs">হোম</span>
            </TabsTrigger>
            <TabsTrigger value="invest" className="flex flex-col items-center space-y-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs">বিনিয়োগ</span>
            </TabsTrigger>
            <TabsTrigger value="earn" className="flex flex-col items-center space-y-1">
              <Gift className="w-5 h-5" />
              <span className="text-xs">আয় করুন</span>
            </TabsTrigger>
            <TabsTrigger value="referral" className="flex flex-col items-center space-y-1">
              <Users className="w-5 h-5" />
              <span className="text-xs">রেফার</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center space-y-1">
              <Settings className="w-5 h-5" />
              <span className="text-xs">প্রোফাইল</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto">
          {/* Home Tab */}
          <TabsContent value="home" className="p-4 space-y-4">
            {/* Banners */}
            {banners.length > 0 && (
              <div className="space-y-4">
                {banners.map((banner) => (
                  <Card key={banner.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-lg font-bold">{banner.title_bn}</h3>
                        <p className="text-sm opacity-90">{banner.description_bn}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="h-20 flex flex-col items-center space-y-2"
                onClick={() => handleSpinWheel("daily")}
                disabled={isLoading}
              >
                <Zap className="w-6 h-6" />
                <span>ফ্রি স্পিন</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center space-y-2 bg-transparent"
                onClick={() => setActiveTab("earn")}
              >
                <Trophy className="w-6 h-6" />
                <span>টাস্ক করুন</span>
              </Button>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">সাম্প্রতিক লেনদেন</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === "bonus"
                                ? "bg-green-100"
                                : transaction.type === "investment"
                                  ? "bg-blue-100"
                                  : transaction.type === "withdraw"
                                    ? "bg-red-100"
                                    : "bg-gray-100"
                            }`}
                          >
                            {transaction.type === "bonus" && <Gift className="w-5 h-5 text-green-600" />}
                            {transaction.type === "investment" && <TrendingUp className="w-5 h-5 text-blue-600" />}
                            {transaction.type === "withdraw" && <ArrowDownLeft className="w-5 h-5 text-red-600" />}
                            {transaction.type === "deposit" && <ArrowUpRight className="w-5 h-5 text-green-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              transaction.type === "withdraw" ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {transaction.type === "withdraw" ? "-" : "+"}৳{transaction.amount}
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
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">কোন লেনদেন নেই</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Tab */}
          <TabsContent value="invest" className="p-4 space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">বিনিয়োগ প্যাকেজ</h2>
              <p className="text-gray-600">আপনার পছন্দের প্যাকেজ বেছে নিন</p>
            </div>

            <div className="space-y-4">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <CardHeader
                    className={`bg-gradient-to-r ${
                      pkg.color === "blue"
                        ? "from-blue-500 to-blue-600"
                        : pkg.color === "purple"
                          ? "from-purple-500 to-purple-600"
                          : pkg.color === "gold"
                            ? "from-yellow-500 to-orange-500"
                            : "from-gray-500 to-gray-600"
                    } text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{pkg.name_bn}</CardTitle>
                        <CardDescription className="text-white/80">দৈনিক {pkg.daily_rate}% রিটার্ন</CardDescription>
                      </div>
                      <div className="text-3xl">{pkg.icon}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">সর্বনিম্ন</p>
                        <p className="font-bold">{formatCurrency(pkg.min_amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">সর্বোচ্চ</p>
                        <p className="font-bold">{formatCurrency(pkg.max_amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">মেয়াদ</p>
                        <p className="font-bold">{pkg.total_days} দিন</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">মোট রিটার্ন</p>
                        <p className="font-bold text-green-600">{pkg.total_return_rate}%</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {pkg.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full" disabled={isLoading}>
                      বিনিয়োগ করুন
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Earn Tab */}
          <TabsContent value="earn" className="p-4 space-y-4">
            {/* Spin Wheel Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>স্পিন হুইল</span>
                </CardTitle>
                <CardDescription>স্পিন করে পুরস্কার জিতুন!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center space-y-2 bg-transparent"
                    onClick={() => handleSpinWheel("daily")}
                    disabled={isLoading}
                  >
                    <div className="text-2xl">🎯</div>
                    <div className="text-center">
                      <p className="font-bold">ফ্রি</p>
                      <p className="text-xs">দৈনিক স্পিন</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center space-y-2 bg-transparent"
                    onClick={() => handleSpinWheel("premium")}
                    disabled={isLoading}
                  >
                    <div className="text-2xl">💎</div>
                    <div className="text-center">
                      <p className="font-bold">৳১০০</p>
                      <p className="text-xs">প্রিমিয়াম</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center space-y-2 bg-transparent"
                    onClick={() => handleSpinWheel("mega")}
                    disabled={isLoading}
                  >
                    <div className="text-2xl">👑</div>
                    <div className="text-center">
                      <p className="font-bold">৳৫০০</p>
                      <p className="text-xs">মেগা</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>দৈনিক টাস্ক</span>
                </CardTitle>
                <CardDescription>টাস্ক সম্পন্ন করে বোনাস আয় করুন</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{task.icon}</div>
                        <div>
                          <p className="font-medium">{task.title_bn}</p>
                          <p className="text-sm text-gray-600">{task.description_bn}</p>
                          <p className="text-xs text-green-600 font-bold">পুরস্কার: ৳{task.reward}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleCompleteTask(task.id)} disabled={isLoading}>
                        সম্পন্ন করুন
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gifts Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="w-5 h-5" />
                  <span>ফ্রি গিফট</span>
                </CardTitle>
                <CardDescription>প্রতিদিন ফ্রি গিফট ক্লেইম করুন</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gifts.map((gift) => (
                    <div key={gift.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{gift.icon}</div>
                        <div>
                          <p className="font-medium">{gift.title_bn}</p>
                          <p className="text-sm text-gray-600">{gift.description_bn}</p>
                          <p className="text-xs text-green-600 font-bold">পুরস্কার: ৳{gift.reward}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleClaimGift(gift.id)} disabled={isLoading}>
                        ক্লেইম করুন
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>রেফারেল প্রোগ্রাম</span>
                </CardTitle>
                <CardDescription>বন্ধুদের রেফার করে কমিশন আয় করুন</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-4">
                    <p className="text-sm mb-2">আপনার রেফারেল কোড</p>
                    <p className="text-2xl font-bold tracking-wider">{user.referral_code}</p>
                  </div>
                  <Button className="w-full mb-4">কোড শেয়ার করুন</Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">মোট রেফার</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">৳0</p>
                    <p className="text-sm text-gray-600">মোট কমিশন</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold">কমিশন রেট:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>লেভেল ১ (সরাসরি রেফার)</span>
                      <Badge>১০%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>লেভেল ২ (পরোক্ষ রেফার)</span>
                      <Badge>৫%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>লেভেল ৩ (পরোক্ষ রেফার)</span>
                      <Badge>২%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>প্রোফাইল তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-gray-600">{user.phone}</p>
                    <Badge variant={user.kyc_status === "approved" ? "default" : "secondary"}>
                      KYC:{" "}
                      {user.kyc_status === "approved"
                        ? "অনুমোদিত"
                        : user.kyc_status === "pending"
                          ? "অপেক্ষমাণ"
                          : "প্রত্যাখ্যাত"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">সদস্য হওয়ার তারিখ</p>
                    <p className="font-bold">{formatDate(user.created_at)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">শেষ লগইন</p>
                    <p className="font-bold">{formatDate(user.last_login)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    সেটিংস
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Bell className="w-4 h-4 mr-2" />
                    নোটিফিকেশন
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Info className="w-4 h-4 mr-2" />
                    সাহায্য ও সাপোর্ট
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    লগ আউট
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Daily Bonus Dialog */}
      <Dialog open={showDailyBonusDialog} onOpenChange={setShowDailyBonusDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 দৈনিক লগইন বোনাস!</DialogTitle>
            <DialogDescription className="text-center">অভিনন্দন! আপনি আজকের লগইন বোনাস পেয়েছেন</DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">৳{dailyBonus}</p>
            <p className="text-gray-600 mb-4">বোনাস আপনার অ্যাকাউন্টে যোগ হয়েছে</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{user.login_streak} দিনের স্ট্রিক</span>
            </div>
          </div>
          <Button onClick={() => setShowDailyBonusDialog(false)} className="w-full">
            ধন্যবাদ!
          </Button>
        </DialogContent>
      </Dialog>

      {/* Error Alert */}
      {error && (
        <Alert className="fixed bottom-4 left-4 right-4 border-red-200 bg-red-50 z-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="fixed bottom-4 left-4 right-4 border-green-200 bg-green-50 z-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
