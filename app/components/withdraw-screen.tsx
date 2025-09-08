"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Loader2,
} from "lucide-react"
import { useSound } from "../hooks/use-sound"
import { dataFunctions, type User, type Transaction, subscribeToUserUpdates } from "../lib/database"

interface WithdrawScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

const withdrawMethods = [
  { id: "bkash", name: "bKash", name_bn: "বিকাশ", icon: Smartphone, color: "text-pink-600" },
  { id: "nagad", name: "Nagad", name_bn: "নগদ", icon: Smartphone, color: "text-orange-600" },
  { id: "rocket", name: "Rocket", name_bn: "রকেট", icon: Smartphone, color: "text-purple-600" },
  { id: "bank", name: "Bank Transfer", name_bn: "ব্যাংক ট্রান্সফার", icon: Building, color: "text-blue-600" },
]

export default function WithdrawScreen({ user, onUserUpdate }: WithdrawScreenProps) {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState<"withdraw" | "history">("withdraw")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const { playSound } = useSound()

  useEffect(() => {
    loadTransactions()

    if (user?.id) {
      const channel = subscribeToUserUpdates(user.id, (payload) => {
        if (payload.new) {
          onUserUpdate(payload.new as User)
        }
      })
      return () => {
        channel.unsubscribe()
      }
    }
  }, [user?.id, onUserUpdate])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      // In a real app, filter transactions by type 'withdraw' from the database
      const { data, error } = await dataFunctions.supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "withdraw")
        .order("created_at", { ascending: false })

      if (error) throw error
      setTransactions(data as Transaction[])
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "লেনদেন লোড করতে ব্যর্থ হয়েছে।" })
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    playSound("click")
    if (!amount || !method || !accountNumber) {
      setMessage({ type: "error", text: "সব তথ্য পূরণ করুন।" })
      playSound("error")
      return
    }

    const withdrawAmount = Number.parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setMessage({ type: "error", text: "বৈধ পরিমাণ লিখুন।" })
      playSound("error")
      return
    }

    if (withdrawAmount < 500) {
      setMessage({ type: "error", text: "সর্বনিম্ন উইথড্র পরিমাণ ৫০০ টাকা।" })
      playSound("error")
      return
    }

    if (withdrawAmount > user.balance) {
      setMessage({ type: "error", text: "অপর্যাপ্ত ব্যালেন্স।" })
      playSound("error")
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      // Call the server-side function to process withdrawal
      const updatedUser = await dataFunctions.processWithdrawal(user.id, withdrawAmount, method, accountNumber)
      onUserUpdate(updatedUser)

      // Record the transaction
      const { error: transactionError } = await dataFunctions.supabase.from("transactions").insert({
        user_id: user.id,
        type: "withdraw",
        amount: withdrawAmount,
        status: "pending", // Withdrawal requests are usually pending admin approval
        method: method,
        account_number: accountNumber,
        description: `Withdrawal request via ${method}`,
      })
      if (transactionError) throw transactionError

      setMessage({ type: "success", text: "উইথড্র অনুরোধ সফল হয়েছে! ২৪ ঘন্টার মধ্যে প্রক্রিয়া করা হবে।" })
      playSound("success")
      setAmount("")
      setMethod("")
      setAccountNumber("")
      loadTransactions() // Refresh history
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "উইথড্রে সমস্যা হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  playSound("click")
                  router.back()
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-gray-800 text-lg bangla-text">উইথড্র</h1>
                <p className="text-xs text-gray-600 bangla-text">আপনার অর্থ উত্তোলন করুন</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600 bangla-text">৳{user.balance.toLocaleString()}</p>
              <p className="text-xs text-gray-500 bangla-text">উপলব্ধ ব্যালেন্স</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span className="text-sm bangla-text">{message.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <Button
            variant={activeTab === "withdraw" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs bangla-text"
            onClick={() => {
              playSound("click")
              setActiveTab("withdraw")
            }}
          >
            উইথড্র করুন
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs bangla-text"
            onClick={() => {
              playSound("click")
              setActiveTab("history")
              loadTransactions()
            }}
          >
            ইতিহাস ({transactions.length})
          </Button>
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
                      <p className="text-sm opacity-80 bangla-text">উপলব্ধ ব্যালেন্স</p>
                      <p className="text-2xl font-bold bangla-text">৳{user.balance.toLocaleString()}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-8 w-8 opacity-60" />
                </div>
              </CardContent>
            </Card>

            {/* Withdraw Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 bangla-text">
                  <ArrowUpRight className="h-5 w-5 text-blue-600" />
                  উইথড্র করুন
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Amount Input */}
                <div>
                  <Label className="block text-sm font-medium mb-2 bangla-text">উইথড্র পরিমাণ (৳)</Label>
                  <Input
                    type="number"
                    placeholder="সর্বনিম্ন ৫০০ টাকা"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-center text-lg font-bold bangla-text"
                  />
                  <p className="text-xs text-gray-600 mt-1 text-center bangla-text">
                    সর্বনিম্ন: ৳৫০০ | সর্বোচ্চ: ৳{user.balance.toLocaleString()}
                  </p>
                </div>

                {/* Method Selection */}
                <div>
                  <Label className="block text-sm font-medium mb-2 bangla-text">উইথড্র পদ্ধতি</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="bangla-text">
                      <SelectValue placeholder="পদ্ধতি নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {withdrawMethods.map((methodData) => (
                        <SelectItem key={methodData.id} value={methodData.id}>
                          <div className="flex items-center gap-2">
                            <methodData.icon className={`h-4 w-4 ${methodData.color}`} />
                            <span className="bangla-text">{methodData.name_bn}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Number */}
                {method && (
                  <div>
                    <Label className="block text-sm font-medium mb-2 bangla-text">
                      {selectedMethodData?.name_bn} নম্বর
                    </Label>
                    <Input
                      type="text"
                      placeholder={`আপনার ${selectedMethodData?.name_bn} নম্বর`}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="text-center bangla-text"
                    />
                  </div>
                )}

                {/* Summary */}
                {amount && method && accountNumber && (
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <h4 className="font-medium text-sm text-center mb-2 bangla-text">উইথড্র সারসংক্ষেপ</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 bangla-text">পরিমাণ:</span>
                        <span className="font-bold bangla-text">
                          ৳{Number.parseFloat(amount || "0").toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 bangla-text">পদ্ধতি:</span>
                        <span className="font-medium bangla-text">{selectedMethodData?.name_bn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 bangla-text">অ্যাকাউন্ট:</span>
                        <span className="font-medium bangla-text">{accountNumber}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-gray-600 bangla-text">প্রক্রিয়াকরণ সময়:</span>
                        <span className="font-medium text-blue-600 bangla-text">২৪ ঘন্টা</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bangla-text"
                  onClick={handleWithdraw}
                  disabled={loading || !amount || !method || !accountNumber || Number.parseFloat(amount || "0") < 500}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      প্রক্রিয়াকরণ...
                    </>
                  ) : (
                    `৳${amount || 0} উইথড্র করুন`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2 bangla-text">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  গুরুত্বপূর্ণ তথ্য
                </h4>
                <ul className="text-xs text-gray-700 space-y-1 bangla-text">
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
            {loading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="mt-3 text-gray-600 bangla-text">ইতিহাস লোড হচ্ছে...</p>
              </div>
            ) : transactions.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <ArrowUpRight className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 bangla-text">কোন উইথড্র ইতিহাস নেই</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 bangla-text bg-transparent"
                    onClick={() => {
                      playSound("click")
                      setActiveTab("withdraw")
                    }}
                  >
                    উইথড্র করুন
                  </Button>
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
                          <h3 className="font-bold bangla-text">৳{transaction.amount.toLocaleString()}</h3>
                          <p className="text-sm text-gray-600 bangla-text">{transaction.method}</p>
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
                            className="text-xs bangla-text"
                          >
                            {getStatusText(transaction.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 bangla-text">
                          {new Date(transaction.created_at).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 bangla-text">অ্যাকাউন্ট:</span>
                        <span className="font-medium bangla-text">{transaction.account_number}</span>
                      </div>
                      {transaction.reference && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 bangla-text">রেফারেন্স:</span>
                          <span className="font-medium bangla-text">{transaction.reference}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 bangla-text">বিবরণ:</span>
                        <span className="font-medium bangla-text">{transaction.description}</span>
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
