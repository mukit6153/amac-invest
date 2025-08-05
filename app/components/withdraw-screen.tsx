"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  ArrowUpRight,
  Wallet,
  Smartphone,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import { dataFunctions, actionFunctions, type Transaction } from "../lib/database"

interface WithdrawScreenProps {
  user: any
  onBack: () => void
}

const withdrawMethods = [
  { id: "bkash", name: "bKash", name_bn: "বিকাশ", icon: Smartphone, color: "text-pink-600" },
  { id: "nagad", name: "Nagad", name_bn: "নগদ", icon: Smartphone, color: "text-orange-600" },
  { id: "rocket", name: "Rocket", name_bn: "রকেট", icon: Smartphone, color: "text-purple-600" },
  { id: "bank", name: "Bank Transfer", name_bn: "ব্যাংক ট্রান্সফার", icon: Building, color: "text-blue-600" },
]

export default function WithdrawScreen({ user, onBack }: WithdrawScreenProps) {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState<"withdraw" | "history">("withdraw")

  const { sounds } = useSound()

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const data = await dataFunctions.getUserTransactions(user.id, 20)
      const withdrawTransactions = data.filter((t) => t.type === "withdraw")
      setTransactions(withdrawTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)
    }
  }

  const handleWithdraw = async () => {
    if (!amount || !method || !accountNumber) {
      sounds.error()
      alert("সব তথ্য পূরণ করুন")
      return
    }

    const withdrawAmount = Number.parseFloat(amount)
    if (withdrawAmount < 500) {
      sounds.error()
      alert("সর্বনিম্ন উইথড্র পরিমাণ ৫০০ টাকা")
      return
    }

    if (withdrawAmount > user.balance) {
      sounds.error()
      alert("অপর্যাপ্ত ব্যালেন্স")
      return
    }

    setLoading(true)
    try {
      const result = await actionFunctions.createWithdrawal(user.id, withdrawAmount, method, accountNumber)
      if (result.success) {
        sounds.success()
        alert("উইথড্র অনুরোধ সফল হয়েছে!")
        setAmount("")
        setMethod("")
        setAccountNumber("")
        loadTransactions()
      } else {
        sounds.error()
        alert(result.error || "উইথড্রে সমস্যা হয়েছে")
      }
    } catch (error) {
      sounds.error()
      alert("উইথড্রে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "সম্পন্ন"
      case "pending":
        return "অপেক্ষমাণ"
      case "failed":
        return "ব্যর্থ"
      case "cancelled":
        return "বাতিল"
      default:
        return "অজানা"
    }
  }

  const selectedMethodData = withdrawMethods.find((m) => m.id === method)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SoundButton variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </SoundButton>
              <div>
                <h1 className="font-bold text-gray-800 text-lg">উইথড্র</h1>
                <p className="text-xs text-gray-600">আপনার অর্থ উত্তোলন করুন</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">৳{user.balance.toLocaleString()}</p>
              <p className="text-xs text-gray-500">উপলব্ধ ব্যালেন্স</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <SoundButton
            variant={activeTab === "withdraw" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("withdraw")}
          >
            উইথড্র করুন
          </SoundButton>
          <SoundButton
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("history")}
          >
            ইতিহাস ({transactions.length})
          </SoundButton>
        </div>

        {/* Withdraw Tab */}
        {activeTab === "withdraw" && (
          <div className="space-y-4">
            {/* Balance Card */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm opacity-80">উপলব্ধ ব্যালেন্স</p>
                      <p className="text-2xl font-bold">৳{user.balance.toLocaleString()}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-8 w-8 opacity-60" />
                </div>
              </CardContent>
            </Card>

            {/* Withdraw Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-blue-600" />
                  উইথড্র করুন
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">উইথড্র পরিমাণ (৳)</label>
                  <Input
                    type="number"
                    placeholder="সর্বনিম্ন ৫০০ টাকা"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-center text-lg font-bold"
                  />
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    সর্বনিম্ন: ৳৫০০ | সর্বোচ্চ: ৳{user.balance.toLocaleString()}
                  </p>
                </div>

                {/* Method Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">উইথড্র পদ্ধতি</label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="পদ্ধতি নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {withdrawMethods.map((methodData) => (
                        <SelectItem key={methodData.id} value={methodData.id}>
                          <div className="flex items-center gap-2">
                            <methodData.icon className={`h-4 w-4 ${methodData.color}`} />
                            <span>{methodData.name_bn}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Number */}
                {method && (
                  <div>
                    <label className="block text-sm font-medium mb-2">{selectedMethodData?.name_bn} নম্বর</label>
                    <Input
                      type="text"
                      placeholder={`আপনার ${selectedMethodData?.name_bn} নম্বর`}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="text-center"
                    />
                  </div>
                )}

                {/* Summary */}
                {amount && method && accountNumber && (
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <h4 className="font-medium text-sm text-center mb-2">উইথড্র সারসংক্ষেপ</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">পরিমাণ:</span>
                        <span className="font-bold">৳{Number.parseFloat(amount || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">পদ্ধতি:</span>
                        <span className="font-medium">{selectedMethodData?.name_bn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">অ্যাকাউন্ট:</span>
                        <span className="font-medium">{accountNumber}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-gray-600">প্রক্রিয়াকরণ সময়:</span>
                        <span className="font-medium text-blue-600">২৪ ঘন্টা</span>
                      </div>
                    </div>
                  </div>
                )}

                <SoundButton
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={loading || !amount || !method || !accountNumber || Number.parseFloat(amount || "0") < 500}
                >
                  {loading ? "প্রক্রিয়াকরণ..." : `৳${amount || 0} উইথড্র করুন`}
                </SoundButton>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  গুরুত্বপূর্ণ তথ্য
                </h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• সর্বনিম্ন উইথড্র পরিমাণ ৫০০ টাকা</li>
                  <li>• প্রক্রিয়াকরণ সময় ২৪ ঘন্টা</li>
                  <li>• সঠিক অ্যাকাউন্ট নম্বর দিন</li>
                  <li>• একবার অনুরোধ করলে বাতিল করা যাবে না</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <ArrowUpRight className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">কোন উইথড্র ইতিহাস নেই</p>
                  <SoundButton variant="outline" size="sm" className="mt-3" onClick={() => setActiveTab("withdraw")}>
                    উইথড্র করুন
                  </SoundButton>
                </CardContent>
              </Card>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                          <ArrowUpRight className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">৳{transaction.amount.toLocaleString()}</h3>
                          <p className="text-sm text-gray-600">{transaction.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {getStatusIcon(transaction.status)}
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
                            {getStatusText(transaction.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">অ্যাকাউন্ট:</span>
                        <span className="font-medium">{transaction.account_number}</span>
                      </div>
                      {transaction.reference && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">রেফারেন্স:</span>
                          <span className="font-medium">{transaction.reference}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">বিবরণ:</span>
                        <span className="font-medium">{transaction.description}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}
