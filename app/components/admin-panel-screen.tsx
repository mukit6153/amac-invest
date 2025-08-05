"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  UserCheck,
  UserX,
  Plus,
  Edit,
  Eye,
  BarChart3,
  AlertTriangle,
  Package,
  Shield,
  Gift,
  Target,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"

interface AdminStats {
  totalUsers: number
  totalInvestments: number
  totalWithdrawals: number
  totalRevenue: number
  activeUsers: number
  pendingWithdrawals: number
  totalTasks: number
  completedTasks: number
  totalReferrals: number
  dailyActiveUsers: number
}

interface User {
  id: string
  name: string
  phone: string
  email: string
  balance: number
  totalInvested: number
  totalWithdrawn: number
  status: "active" | "suspended" | "banned"
  kyc: "pending" | "approved" | "rejected"
  joinDate: string
  lastActive: string
  referralCode: string
  referredBy?: string
  totalReferrals: number
}

interface Investment {
  id: string
  userId: string
  userName: string
  packageName: string
  amount: number
  dailyReturn: number
  totalReturn: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "cancelled"
  daysRemaining: number
}

interface Transaction {
  id: string
  userId: string
  userName: string
  type: "deposit" | "withdrawal" | "investment" | "return" | "referral" | "task"
  amount: number
  status: "pending" | "completed" | "failed" | "cancelled"
  method?: string
  date: string
  description: string
}

export default function AdminPanelScreen({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [users, setUsers] = useState<User[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInvestments: 0,
    totalWithdrawals: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingWithdrawals: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalReferrals: 0,
    dailyActiveUsers: 0,
  })

  const { sounds } = useSound()

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      // Mock data for demonstration
      setAdminStats({
        totalUsers: 1250,
        totalInvestments: 2500000,
        totalWithdrawals: 750000,
        totalRevenue: 125000,
        activeUsers: 890,
        pendingWithdrawals: 15,
        totalTasks: 5000,
        completedTasks: 3200,
        totalReferrals: 450,
        dailyActiveUsers: 320,
      })

      setUsers([
        {
          id: "1",
          name: "রহিম আহমেদ",
          phone: "+880171234567",
          email: "rahim@example.com",
          balance: 5000,
          totalInvested: 25000,
          totalWithdrawn: 8000,
          status: "active",
          kyc: "approved",
          joinDate: "2024-01-15",
          lastActive: "2024-01-20",
          referralCode: "REF001",
          totalReferrals: 5,
        },
        {
          id: "2",
          name: "করিম উদ্দিন",
          phone: "+880171234568",
          email: "karim@example.com",
          balance: 12000,
          totalInvested: 50000,
          totalWithdrawn: 15000,
          status: "active",
          kyc: "approved",
          joinDate: "2024-01-10",
          lastActive: "2024-01-20",
          referralCode: "REF002",
          totalReferrals: 8,
        },
        {
          id: "3",
          name: "ফাতেমা খাতুন",
          phone: "+880171234569",
          email: "fatema@example.com",
          balance: 3000,
          totalInvested: 15000,
          totalWithdrawn: 5000,
          status: "active",
          kyc: "pending",
          joinDate: "2024-01-18",
          lastActive: "2024-01-19",
          referralCode: "REF003",
          totalReferrals: 2,
        },
      ])

      setInvestments([
        {
          id: "1",
          userId: "1",
          userName: "রহিম আহমেদ",
          packageName: "স্ট্যান্ডার্ড প্যাকেজ",
          amount: 10000,
          dailyReturn: 200,
          totalReturn: 12000,
          startDate: "2024-01-15",
          endDate: "2024-02-14",
          status: "active",
          daysRemaining: 15,
        },
        {
          id: "2",
          userId: "2",
          userName: "করিম উদ্দিন",
          packageName: "প্রিমিয়াম প্যাকেজ",
          amount: 25000,
          dailyReturn: 625,
          totalReturn: 37500,
          startDate: "2024-01-10",
          endDate: "2024-02-09",
          status: "active",
          daysRemaining: 10,
        },
      ])

      setTransactions([
        {
          id: "1",
          userId: "1",
          userName: "রহিম আহমেদ",
          type: "withdrawal",
          amount: 2000,
          status: "pending",
          method: "bKash",
          date: "2024-01-20",
          description: "উইথড্র রিকোয়েস্ট",
        },
        {
          id: "2",
          userId: "2",
          userName: "করিম উদ্দিন",
          type: "investment",
          amount: 25000,
          status: "completed",
          date: "2024-01-10",
          description: "প্রিমিয়াম প্যাকেজে বিনিয়োগ",
        },
        {
          id: "3",
          userId: "3",
          userName: "ফাতেমা খাতুন",
          type: "return",
          amount: 150,
          status: "completed",
          date: "2024-01-19",
          description: "দৈনিক রিটার্ন",
        },
      ])
    } catch (error) {
      console.error("Error loading admin data:", error)
    }
  }

  const adminTabs = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: BarChart3 },
    { id: "users", label: "ব্যবহারকারী", icon: Users },
    { id: "investments", label: "বিনিয়োগ", icon: TrendingUp },
    { id: "transactions", label: "লেনদেন", icon: DollarSign },
    { id: "packages", label: "প্যাকেজ", icon: Package },
    { id: "tasks", label: "টাস্ক", icon: Target },
    { id: "settings", label: "সেটিংস", icon: Settings },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{adminStats.totalUsers}</div>
            <p className="text-sm text-blue-700 bangla-text">মোট ব্যবহারকারী</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600">৳{adminStats.totalInvestments.toLocaleString()}</div>
            <p className="text-sm text-green-700 bangla-text">মোট বিনিয়োগ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-600">৳{adminStats.totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-purple-700 bangla-text">মোট রাজস্ব</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{adminStats.activeUsers}</div>
            <p className="text-sm text-orange-700 bangla-text">সক্রিয় ব্যবহারকারী</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-indigo-600">{adminStats.totalTasks}</div>
            <p className="text-sm text-gray-600 bangla-text">মোট টাস্ক</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-pink-600">{adminStats.totalReferrals}</div>
            <p className="text-sm text-gray-600 bangla-text">মোট রেফারেল</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 bangla-text">
            <AlertTriangle className="h-5 w-5" />
            অপেক্ষমাণ কাজ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium bangla-text">অপেক্ষমাণ উইথড্র</p>
              <p className="text-sm text-gray-600">{adminStats.pendingWithdrawals} টি রিকোয়েস্ট</p>
            </div>
            <SoundButton size="sm" className="bangla-text" onClick={() => setActiveTab("transactions")}>
              দেখুন
            </SoundButton>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium bangla-text">KYC যাচাইকরণ</p>
              <p className="text-sm text-gray-600">৮ টি অপেক্ষমাণ</p>
            </div>
            <SoundButton size="sm" className="bangla-text" onClick={() => setActiveTab("users")}>
              দেখুন
            </SoundButton>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="bangla-text">সাম্প্রতিক কার্যকলাপ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === "investment"
                        ? "bg-green-100"
                        : transaction.type === "withdrawal"
                          ? "bg-orange-100"
                          : transaction.type === "return"
                            ? "bg-blue-100"
                            : "bg-purple-100"
                    }`}
                  >
                    {transaction.type === "investment" && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {transaction.type === "withdrawal" && <DollarSign className="h-4 w-4 text-orange-600" />}
                    {transaction.type === "return" && <Gift className="h-4 w-4 text-blue-600" />}
                    {transaction.type === "referral" && <Users className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm bangla-text">{transaction.description}</p>
                    <p className="text-xs text-gray-600">
                      {transaction.userName} - ৳{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : transaction.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {transaction.status === "completed"
                      ? "সম্পন্ন"
                      : transaction.status === "pending"
                        ? "অপেক্ষমাণ"
                        : "ব্যর্থ"}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold bangla-text">ব্যবহারকারী ব্যবস্থাপনা</h2>
        <SoundButton className="bangla-text">
          <Plus className="h-4 w-4 mr-2" />
          নতুন ব্যবহারকারী
        </SoundButton>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "active").length}</div>
            <p className="text-sm text-gray-600 bangla-text">সক্রিয় ব্যবহারকারী</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{users.filter((u) => u.kyc === "pending").length}</div>
            <p className="text-sm text-gray-600 bangla-text">অপেক্ষমাণ KYC</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{users.filter((u) => u.status === "banned").length}</div>
            <p className="text-sm text-gray-600 bangla-text">নিষিদ্ধ ব্যবহারকারী</p>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle className="bangla-text">ব্যবহারকারী তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium bangla-text">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                    <p className="text-sm text-green-600">৳{user.balance.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">রেফারেল: {user.totalReferrals}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === "active" ? "default" : "destructive"}>
                    {user.status === "active" ? "সক্রিয়" : "নিষিদ্ধ"}
                  </Badge>
                  <Badge variant={user.kyc === "approved" ? "default" : "secondary"}>
                    {user.kyc === "approved" ? "যাচাইকৃত" : "অপেক্ষমাণ"}
                  </Badge>
                  <div className="flex gap-1">
                    <SoundButton variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </SoundButton>
                    <SoundButton variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </SoundButton>
                    <SoundButton variant="outline" size="sm">
                      <UserX className="h-4 w-4" />
                    </SoundButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderInvestments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold bangla-text">বিনিয়োগ ব্যবস্থাপনা</h2>
        <SoundButton className="bangla-text">
          <Plus className="h-4 w-4 mr-2" />
          নতুন প্যাকেজ
        </SoundButton>
      </div>

      {/* Investment Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {investments.filter((i) => i.status === "active").length}
            </div>
            <p className="text-sm text-gray-600 bangla-text">সক্রিয় বিনিয়োগ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              ৳{investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 bangla-text">মোট বিনিয়োগ</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <Card>
        <CardHeader>
          <CardTitle className="bangla-text">বিনিয়োগ তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {investments.map((investment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium bangla-text">{investment.packageName}</p>
                    <p className="text-sm text-gray-600">{investment.userName}</p>
                    <p className="text-sm text-green-600">৳{investment.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">দৈনিক: ৳{investment.dailyReturn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={investment.status === "active" ? "default" : "secondary"}>
                    {investment.status === "active" ? "সক্রিয়" : "সম্পন্ন"}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{investment.daysRemaining} দিন বাকি</p>
                  <div className="flex gap-1 mt-2">
                    <SoundButton variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </SoundButton>
                    <SoundButton variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </SoundButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold bangla-text">লেনদেন ব্যবস্থাপনা</h2>
        <div className="flex gap-2">
          <SoundButton variant="outline" size="sm" className="bangla-text">
            সব দেখুন
          </SoundButton>
          <SoundButton variant="outline" size="sm" className="bangla-text">
            ফিল্টার
          </SoundButton>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-yellow-600">
              {transactions.filter((t) => t.status === "pending").length}
            </div>
            <p className="text-sm text-gray-600 bangla-text">অপেক্ষমাণ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-green-600">
              {transactions.filter((t) => t.status === "completed").length}
            </div>
            <p className="text-sm text-gray-600 bangla-text">সম্পন্ন</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-red-600">
              {transactions.filter((t) => t.status === "failed").length}
            </div>
            <p className="text-sm text-gray-600 bangla-text">ব্যর্থ</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle className="bangla-text">লেনদেন তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "investment"
                        ? "bg-green-100"
                        : transaction.type === "withdrawal"
                          ? "bg-orange-100"
                          : transaction.type === "return"
                            ? "bg-blue-100"
                            : "bg-purple-100"
                    }`}
                  >
                    {transaction.type === "investment" && <TrendingUp className="h-5 w-5 text-green-600" />}
                    {transaction.type === "withdrawal" && <DollarSign className="h-5 w-5 text-orange-600" />}
                    {transaction.type === "return" && <Gift className="h-5 w-5 text-blue-600" />}
                    {transaction.type === "referral" && <Users className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div>
                    <p className="font-medium bangla-text">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.userName}</p>
                    <p className="text-sm text-green-600">৳{transaction.amount.toLocaleString()}</p>
                    {transaction.method && <p className="text-xs text-gray-500">{transaction.method}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : transaction.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {transaction.status === "completed"
                      ? "সম্পন্ন"
                      : transaction.status === "pending"
                        ? "অপেক্ষমাণ"
                        : "ব্যর্থ"}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                  <div className="flex gap-1 mt-2">
                    {transaction.status === "pending" && (
                      <>
                        <SoundButton variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </SoundButton>
                        <SoundButton variant="outline" size="sm">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </SoundButton>
                      </>
                    )}
                    <SoundButton variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </SoundButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold bangla-text">সিস্টেম সেটিংস</h2>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="bangla-text">অ্যাপ সেটিংস</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="appName" className="bangla-text">
              অ্যাপের নাম
            </Label>
            <Input id="appName" defaultValue="AMAC Investment" />
          </div>
          <div>
            <Label htmlFor="minWithdraw" className="bangla-text">
              সর্বনিম্ন উইথড্র
            </Label>
            <Input id="minWithdraw" type="number" defaultValue="500" />
          </div>
          <div>
            <Label htmlFor="maxWithdraw" className="bangla-text">
              সর্বোচ্চ উইথড্র
            </Label>
            <Input id="maxWithdraw" type="number" defaultValue="50000" />
          </div>
          <div>
            <Label htmlFor="referralBonus" className="bangla-text">
              রেফারেল বোনাস (%)
            </Label>
            <Input id="referralBonus" type="number" defaultValue="10" />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="bangla-text">নোটিফিকেশন সেটিংস</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="welcomeMsg" className="bangla-text">
              স্বাগতম বার্তা
            </Label>
            <Textarea id="welcomeMsg" defaultValue="AMAC Investment এ আপনাকে স্বাগতম!" />
          </div>
          <div>
            <Label htmlFor="withdrawMsg" className="bangla-text">
              উইথড্র বার্তা
            </Label>
            <Textarea id="withdrawMsg" defaultValue="আপনার উইথড্র রিকোয়েস্ট গ্রহণ করা হয়েছে।" />
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="bangla-text">পেমেন্ট মেথড</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="bangla-text">bKash</span>
              <Badge variant="default">সক্রিয়</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="bangla-text">Nagad</span>
              <Badge variant="default">সক্রিয়</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="bangla-text">Rocket</span>
              <Badge variant="secondary">নিষ্ক্রিয়</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="bangla-text">Bank Transfer</span>
              <Badge variant="default">সক্রিয়</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <SoundButton className="flex-1 bangla-text">সেভ করুন</SoundButton>
        <SoundButton variant="outline" className="flex-1 bangla-text">
          রিসেট করুন
        </SoundButton>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SoundButton variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </SoundButton>
            <div>
              <h1 className="text-xl font-bold bangla-text">অ্যাডমিন প্যানেল</h1>
              <p className="text-sm text-gray-600">সিস্টেম ব্যবস্থাপনা</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto px-4">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.click?.play()
                setActiveTab(tab.id)
              }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="bangla-text">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "investments" && renderInvestments()}
        {activeTab === "transactions" && renderTransactions()}
        {activeTab === "settings" && renderSettings()}
      </div>
    </div>
  )
}
