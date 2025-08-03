"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"

export default function AdminPanelScreen() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [users, setUsers] = useState([])
  const [investments, setInvestments] = useState([])
  const [transactions, setTransactions] = useState([])
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    totalWithdrawals: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingWithdrawals: 0
  })

  const { sounds } = useSound()

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      // This would be replaced with actual admin API calls
      // For now, using placeholder data
      setAdminStats({
        totalUsers: 1250,
        totalInvestments: 2500000,
        totalWithdrawals: 750000,
        totalRevenue: 125000,
        activeUsers: 890,
        pendingWithdrawals: 15
      })
    } catch (error) {
      console.error("Error loading admin data:", error)
    }
  }

  const adminTabs = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: BarChart3 },
    { id: "users", label: "ব্যবহারকারী", icon: Users },
    { id: "investments", label: "বিনিয়োগ", icon: TrendingUp },
    { id: "transactions", label: "লেনদেন", icon: DollarSign },
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
            <SoundButton size="sm" className="bangla-text">
              দেখুন
            </SoundButton>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium bangla-text">KYC যাচাইকরণ</p>
              <p className="text-sm text-gray-600">৮ টি অপেক্ষমাণ</p>
            </div>
            <SoundButton size="sm" className="bangla-text">
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
            {[
              { action: "নতুন ব্যবহারকারী নিবন্ধন", user: "রহিম আহমেদ", time: "৫ মিনিট আগে", type: "user" },
              { action: "বিনিয়োগ সম্পন্ন", user: "করিম উদ্দিন", amount: "৮,০০০ টাকা", time: "১০ মিনিট আগে", type: "investment" },
              { action: "উইথড্র রিকোয়েস্ট", user: "ফাতেমা খাতুন", amount: "২,০০০ টাকা", time: "১৫ মিনিট আগে", type: "withdrawal" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-100' :
                    activity.type === 'investment' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'investment' && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {activity.type === 'withdrawal' && <DollarSign className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm bangla-text">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user} {activity.amount && `- ${activity.amount}`}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
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
            <div className="text-2xl font-bold text-green-600">890</div>
            <p className="text-sm text-gray-600 bangla-text">সক্রিয় ব্যবহারকারী</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">45</div>
            <p className="text-sm text-gray-600 bangla-text">অপেক্ষমাণ KYC</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">12</div>
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
            {[
              { name: "রহিম আহমেদ", phone: "+880171234567", balance: 5000, status: "active", kyc: "approved" },
              { name: "করিম উদ্দিন", phone: "+880171234568", balance: 12000, status: "active", kyc: "approved" },
              { name: "ফাতেমা খাতুন", phone: "+880171234569", balance: 3000, status: "active", kyc: "pending" },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium bangla-text">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                    <p className="text-sm text-green-600">৳{user.balance.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status === 'active' ? 'সক্রিয়' : 'নিষিদ্ধ'}
                  </Badge>
                  <Badge variant={user.kyc === 'approved' ? 'default' : 'secondary'}>
                    {user.kyc === 'approved' ? 'যাচাইকৃত' : 'অপেক্ষমাণ'}
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold bangla-text">\
