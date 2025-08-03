"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import {
  ArrowLeft,
  ArrowUpRight,
  DollarSign,
  CreditCard,
  Smartphone,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react"
import { actionFunctions, type User } from "../lib/database"

interface WithdrawScreenProps {
  user: User
  onBack: () => void
}

export default function WithdrawScreen({ user, onBack }: WithdrawScreenProps) {
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const { sounds } = useSound()

  const withdrawMethods = [
    { id: "bkash", name: "বিকাশ", icon: Smartphone, color: "bg-pink-500", minAmount: 500 },
    { id: "nagad", name: "নগদ", icon: Smartphone, color: "bg-orange-500", minAmount: 500 },
    { id: "rocket", name: "রকেট", icon: Smartphone, color: "bg-purple-500", minAmount: 500 },
    { id: "bank", name: "ব্যাংক ট্রান্সফার", icon: Building, color: "bg-blue-500", minAmount: 1000 },
  ]

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawMethod || !accountNumber) {
      sounds.error()
      return
    }

    const amount = Number.parseFloat(withdrawAmount)
    const method = withdrawMethods.find((m) => m.id === withdrawMethod)

    if (!method || amount < method.minAmount || amount > user.balance) {
      sounds.error()
      return
    }

    setLoading(true)
    try {
      const result = await actionFunctions.createWithdrawal(user.id, amount, withdrawMethod, accountNumber)
      if (result.success) {
        sounds.success()
        setWithdrawAmount("")
        setWithdrawMethod("")
        setAccountNumber("")
        // Show success message
      } else {
        sounds.error()
      }
    } catch (error) {
      console.error("Withdrawal error:", error)
      sounds.error()
    } finally {
      setLoading(false)
    }
  }

  const selectedMethod = withdrawMethods.find((m) => m.id === withdrawMethod)
  const amount = Number.parseFloat(withdrawAmount) || 0
  const fee = amount * 0.02 // 2% fee
  const netAmount = amount - fee

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <SoundButton variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </SoundButton>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">টাকা উত্তোলন</h1>
                <p className="text-xs text-gray-600">আপনার আয় উত্তোলন করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">উপলব্ধ ব্যালেন্স</p>
                <p className="text-2xl font-bold">৳{user.balance.toLocaleString()}</p>
                <p className="text-xs opacity-80">উত্তোলনযোগ্য</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">উত্তোলনের মাধ্যম</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {withdrawMethods.map((method) => (
              <div
                key={method.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  withdrawMethod === method.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  setWithdrawMethod(method.id)
                  sounds.buttonClick()
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center`}>
                      <method.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-xs text-gray-600">সর্বনিম্ন: ৳{method.minAmount}</p>
                    </div>
                  </div>
                  {withdrawMethod === method.id && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        {withdrawMethod && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                উত্তোলনের তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  উত্তোলনের পরিমাণ (৳)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`সর্বনিম্ন ৳${selectedMethod?.minAmount}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="account" className="text-sm font-medium">
                  {selectedMethod?.name} নম্বর
                </Label>
                <Input
                  id="account"
                  type="text"
                  placeholder={selectedMethod?.id === "bank" ? "ব্যাংক অ্যাকাউন্ট নম্বর" : "মোবাইল নম্বর"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2000, 5000].map((amount) => (
                  <SoundButton
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setWithdrawAmount(amount.toString())}
                    className="text-xs"
                    disabled={amount > user.balance}
                  >
                    ৳{amount.toLocaleString()}
                  </SoundButton>
                ))}
              </div>

              {/* Fee Calculation */}
              {withdrawAmount && Number.parseFloat(withdrawAmount) >= (selectedMethod?.minAmount || 0) && (
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <h4 className="font-medium text-sm bangla-text">ফি ক্যালকুলেটর</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>উত্তোলনের পরিমাণ:</span>
                      <span>৳{amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>সার্ভিস চার্জ (২%):</span>
                      <span>-৳{fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-green-600 border-t pt-1">
                      <span>প্রাপ্ত পরিমাণ:</span>
                      <span>৳{netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Messages */}
              {withdrawAmount && (
                <div className="space-y-2">
                  {amount < (selectedMethod?.minAmount || 0) && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">সর্বনিম্ন উত্তোলন ৳{selectedMethod?.minAmount}</span>
                    </div>
                  )}
                  {amount > user.balance && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">অপর্যাপ্ত ব্যালেন্স</span>
                    </div>
                  )}
                </div>
              )}

              <SoundButton
                className="w-full"
                onClick={handleWithdraw}
                disabled={
                  loading ||
                  !withdrawAmount ||
                  !accountNumber ||
                  amount < (selectedMethod?.minAmount || 0) ||
                  amount > user.balance
                }
              >
                {loading ? "প্রক্রিয়াকরণ..." : `৳${netAmount.toFixed(2)} উত্তোলন করুন`}
              </SoundButton>
            </CardContent>
          </Card>
        )}

        {/* Withdrawal Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              উত্তোলন সংক্রান্ত তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">প্রক্রিয়াকরণের সময়</p>
                <p className="text-xs text-gray-600">২৪ ঘন্টার মধ্যে</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">সার্ভিস চার্জ</p>
                <p className="text-xs text-gray-600">২% (সর্বনিম্ন ৳১০)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">নিরাপত্তা</p>
                <p className="text-xs text-gray-600">সম্পূর্ণ নিরাপদ ও এনক্রিপ্টেড</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
