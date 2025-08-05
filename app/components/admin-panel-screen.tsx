"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Bell,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye,
  Activity,
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import type { User, Investment, Transaction } from "../lib/database"

interface AdminPanelScreenProps {
  user: any
  onBack: () => void
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalInvestments: number
  totalWithdrawals: number
  pendingKyc: number
  pendingWithdrawals: number
  totalRevenue: number
  monthlyGrowth: number
}

interface AdminUser extends User {
  totalInvested: number
  totalEarned: number
  lastActivity: string
}

export default function AdminPanelScreen({ user, onBack }: AdminPanelScreenProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const { sounds } = useSound()

  // Data states
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalInvestments: 0,
    totalWithdrawals: 0,
    pendingKyc: 0,
    pendingWithdrawals: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  })
  const [users, setUsers] = useState<AdminUser[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Mock admin data since we don't have real admin endpoints
      setStats({
        totalUsers: 1250,
        activeUsers: 890,
        totalInvestments: 2500000,
        totalWithdrawals: 1800000,
        pendingKyc: 45,
        pendingWithdrawals: 23,
        totalRevenue: 350000,
        monthlyGrowth: 15.5,
      })

      // Mock users data
      const mockUsers: AdminUser[] = [
        {
          id: "1",
          name: "রহিম উদ্দিন",
          phone: "+8801712345678",
          email: "rahim@example.com",
          balance: 15000,
          bonus_balance: 2500,
          locked_balance: 5000,
          total_invested: 50000,
          total_earned: 12500,
          referral_code: "AJ123456",
          login_streak: 15,
          kyc_status: "approved",
          status: "active",
          role: "user",
          totalInvested: 50000,
          totalEarned: 12500,
          lastActivity: "2024-01-15T10:30:00Z",
          last_login: "2024-01-15T10:30:00Z",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-15T10:30:00Z",
          wallet_pin: "1234",
          password: "password123",
        },
        {
          id: "2",
          name: "ফাতেমা খাতুন",
          phone: "+8801812345679",
          email: "fatema@example.com",
          balance: 8500,
          bonus_balance: 1200,
          locked_balance: 0,
          total_invested: 25000,
          total_earned: 6250,
          referral_code: "AJ789012",
          login_streak: 8,
          kyc_status: "pending",
          status: "active",
          role: "user",
          totalInvested: 25000,
          totalEarned: 6250,
          lastActivity: "2024-01-14T15:45:00Z",
          last_login: "2024-01-14T15:45:00Z",
          created_at: "2024-01-05T00:00:00Z",
          updated_at: "2024-01-14T15:45:00Z",
          wallet_pin: "5678",
          password: "password456",
        },
      ]

      setUsers(mockUsers)
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    sounds.buttonClick()
    try {
      switch (action) {
        case "approve_kyc":
          // Mock KYC approval
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, kyc_status: "approved" as const } : u)))
          sounds.success()
          break
        case "reject_kyc":
          // Mock KYC rejection
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, kyc_status: "rejected" as const } : u)))
          sounds.error()
          break
        case "suspend":
          // Mock user suspension
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "suspended" as const } : u)))
          sounds.error()
          break
        case "activate":
          // Mock user activation
          setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "active" as const } : u)))
          sounds.success()
          break
      }
    } catch (error) {
      console.error("Error performing user action:", error)
      sounds.error()
    }
  }

  const handleTransactionAction = async (transactionId: string, action: string) => {
    sounds.buttonClick()
    try {
      // Mock transaction actions
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId
            ? { ...t, status: action === "approve" ? ("completed" as const) : ("failed" as const) }
            : t,
        ),
      )
      sounds.success()
    } catch (error) {
      console.error("Error performing transaction action:", error)
      sounds.error()
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">মোট ব্যবহারকারী</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">মোট বিনিয়োগ</p>
                <p className="text-2xl font-bold">৳{(stats.totalInvestments / 100000).toFixed(1)}L</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">মোট রাজস্ব</p>
                <p className="text-2xl font-bold">৳{(stats.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">মাসিক বৃদ্ধি</p>
                <p className="text-2xl font-bold">{stats.monthlyGrowth}%</p>
              </div>
              <Activity className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              অপেক্ষমাণ কাজ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium">KYC যাচাইকরণ</p>
                <p className="text-sm text-gray-600">{stats.pendingKyc}টি অপেক্ষমাণ</p>
              </div>
              <SoundButton size="sm" onClick={() => setActiveTab("users")}>
                দেখুন
              </SoundButton>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">উইথড্র অনুরোধ</p>
                <p className="text-sm text-gray-600">{stats.pendingWithdrawals}টি অপেক্ষমাণ</p>
              </div>
              <SoundButton size="sm" onClick={() => setActiveTab("transactions")}>
                দেখুন
              </SoundButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              সাম্প্রতিক কার্যকলাপ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">নতুন ব্যবহারকারী নিবন্ধন</p>
                <p className="text-xs text-gray-500">৫ মিনিট আগে</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">নতুন বিনিয়োগ</p>
                <p className="text-xs text-gray-500">১০ মিনিট আগে</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">উইথড্র অনুরোধ</p>
                <p className="text-xs text-gray-500">১৫ মিনিট আগে</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ব্যবহারকারী খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">সব স্ট্যাটাস</option>
          <option value="active">সক্রিয়</option>
          <option value="suspended">স্থগিত</option>
          <option value="banned">নিষিদ্ধ</option>
        </select>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {users
          .filter((user) => {
            const matchesSearch =
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm)
            const matchesFilter = filterStatus === "all" || user.status === filterStatus
            return matchesSearch && matchesFilter
          })
          .map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "suspended"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {user.status === "active" ? "সক্রিয়" : user.status === "suspended" ? "স্থগিত" : "নিষিদ্ধ"}
                        </Badge>
                        <Badge
                          variant={
                            user.kyc_status === "approved"
                              ? "default"
                              : user.kyc_status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          KYC:{" "}
                          {user.kyc_status === "approved"
                            ? "অনুমোদিত"
                            : user.kyc_status === "pending"
                              ? "অপেক্ষমাণ"
                              : "প্রত্যাখ্যাত"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">৳{user.balance.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">বিনিয়োগ: ৳{user.totalInvested.toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      <SoundButton
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserModal(true)
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </SoundButton>
                      {user.kyc_status === "pending" && (
                        <>
                          <SoundButton
                            size="sm"
                            onClick={() => handleUserAction(user.id, "approve_kyc")}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </SoundButton>
                          <SoundButton
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUserAction(user.id, "reject_kyc")}
                          >
                            <XCircle className="h-3 w-3" />
                          </SoundButton>
                        </>
                      )}
                      {user.status === "active" ? (
                        <SoundButton
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUserAction(user.id, "suspend")}
                        >
                          স্থগিত
                        </SoundButton>
                      ) : (
                        <SoundButton
                          size="sm"
                          onClick={() => handleUserAction(user.id, "activate")}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          সক্রিয়
                        </SoundButton>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">লেনদেন ব্যবস্থাপনা</h3>
        <div className="flex gap-2">
          <SoundButton variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            এক্সপোর্ট
          </SoundButton>
          <SoundButton variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            ফিল্টার
          </SoundButton>
        </div>
      </div>

      {/* Mock transactions */}
      <div className="space-y-3">
        {[
          {
            id: "1",
            user: "রহিম উদ্দিন",
            type: "withdraw",
            amount: 5000,
            status: "pending",
            method: "bKash",
            account: "01712345678",
            date: "2024-01-15",
          },
          {
            id: "2",
            user: "ফাতেমা খাতুন",
            type: "investment",
            amount: 10000,
            status: "completed",
            method: "Wallet",
            account: "-",
            date: "2024-01-14",
          },
        ].map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{transaction.user}</h4>
                    <Badge
                      variant={
                        transaction.type === "withdraw"
                          ? "destructive"
                          : transaction.type === "investment"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {transaction.type === "withdraw"
                        ? "উইথড্র"
                        : transaction.type === "investment"
                          ? "বিনিয়োগ"
                          : "অন্যান্য"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {transaction.method} - {transaction.account}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">৳{transaction.amount.toLocaleString()}</p>
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : transaction.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="mb-2"
                  >
                    {transaction.status === "completed"
                      ? "সম্পন্ন"
                      : transaction.status === "pending"
                        ? "অপেক্ষমাণ"
                        : "ব্যর্থ"}
                  </Badge>
                  {transaction.status === "pending" && (
                    <div className="flex gap-2">
                      <SoundButton
                        size="sm"
                        onClick={() => handleTransactionAction(transaction.id, "approve")}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        অনুমোদন
                      </SoundButton>
                      <SoundButton
                        size="sm"
                        variant="destructive"
                        onClick={() => handleTransactionAction(transaction.id, "reject")}
                      >
                        প্রত্যাখ্যান
                      </SoundButton>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>অ্যাপ সেটিংস</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="app-name">অ্যাপের নাম</Label>
            <Input id="app-name" defaultValue="AMAC Investment" />
          </div>
          <div>
            <Label htmlFor="min-withdraw">সর্বনিম্ন উইথড্র</Label>
            <Input id="min-withdraw" type="number" defaultValue="500" />
          </div>
          <div>
            <Label htmlFor="max-withdraw">সর্বোচ্চ উইথড্র</Label>
            <Input id="max-withdraw" type="number" defaultValue="50000" />
          </div>
          <div>
            <Label htmlFor="referral-bonus">রেফারেল বোনাস</Label>
            <Input id="referral-bonus" type="number" defaultValue="100" />
          </div>
          <SoundButton>সেটিংস সংরক্ষণ করুন</SoundButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>নোটিফিকেশন সেটিংস</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>নতুন ব্যবহারকারী নোটিফিকেশন</Label>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <Label>উইথড্র অনুরোধ নোটিফিকেশন</Label>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <Label>KYC অনুরোধ নোটিফিকেশন</Label>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SoundButton variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </SoundButton>
              <div>
                <h1 className="font-bold text-gray-800 text-lg">অ্যাডমিন প্যানেল</h1>
                <p className="text-xs text-gray-600">সিস্টেম ব্যবস্থাপনা</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SoundButton variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </SoundButton>
              <SoundButton variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </SoundButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: "dashboard", label: "ড্যাশবোর্ড", icon: Activity },
            { id: "users", label: "ব্যবহারকারী", icon: Users },
            { id: "investments", label: "বিনিয়োগ", icon: TrendingUp },
            { id: "transactions", label: "লেনদেন", icon: DollarSign },
            { id: "settings", label: "সেটিংস", icon: Settings },
          ].map((tab) => (
            <SoundButton
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </SoundButton>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "transactions" && renderTransactions()}
            {activeTab === "settings" && renderSettings()}
          </>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                ব্যবহারকারীর বিস্তারিত
                <SoundButton variant="ghost" size="sm" onClick={() => setShowUserModal(false)}>
                  <XCircle className="h-4 w-4" />
                </SoundButton>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                  {selectedUser.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">ব্যালেন্স</p>
                  <p className="font-bold">৳{selectedUser.balance.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">বিনিয়োগ</p>
                  <p className="font-bold">৳{selectedUser.totalInvested.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">আয়</p>
                  <p className="font-bold">৳{selectedUser.totalEarned.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">স্ট্রিক</p>
                  <p className="font-bold">{selectedUser.login_streak} দিন</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">রেফারেল কোড:</span>
                  <span className="font-mono">{selectedUser.referral_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">KYC স্ট্যাটাস:</span>
                  <Badge
                    variant={
                      selectedUser.kyc_status === "approved"
                        ? "default"
                        : selectedUser.kyc_status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedUser.kyc_status === "approved"
                      ? "অনুমোদিত"
                      : selectedUser.kyc_status === "pending"
                        ? "অপেক্ষমাণ"
                        : "প্রত্যাখ্যাত"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">অ্যাকাউন্ট স্ট্যাটাস:</span>
                  <Badge
                    variant={
                      selectedUser.status === "active"
                        ? "default"
                        : selectedUser.status === "suspended"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedUser.status === "active"
                      ? "সক্রিয়"
                      : selectedUser.status === "suspended"
                        ? "স্থগিত"
                        : "নিষিদ্ধ"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
