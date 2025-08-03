"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertTriangle, CheckCircle, Info } from "lucide-react"

export default function WithdrawPage() {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [amount, setAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [hasInvested, setHasInvested] = useState(false) // This would come from user state

  const user = {
    balance: 2500,
    bonusBalance: 150,
    lockedBalance: 800,
    minWithdraw: 1000,
    withdrawFee: 50,
  }

  const withdrawMethods = [
    { id: "bkash", name: "bKash", icon: "📱", color: "bg-pink-500" },
    { id: "nagad", name: "Nagad", icon: "📱", color: "bg-orange-500" },
    { id: "rocket", name: "Rocket", icon: "🚀", color: "bg-purple-500" },
  ]

  const handleWithdraw = () => {
    if (!hasInvested) {
      // Show investment encouragement modal
      return
    }
    // Process withdrawal
  }

  if (!hasInvested) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 mb-6 rounded-lg">
          <h1 className="text-xl font-bold text-center">টাকা তোলা</h1>
        </div>

        {/* Investment Encouragement */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-yellow-800 mb-2">আপনি এখনো ইনভেস্ট করেননি!</h2>
            <p className="text-yellow-700 mb-6">
              ইনভেস্ট করলে আপনার আয় তোলার সুবিধা খুলে যাবে। এছাড়াও পাবেন দৈনিক গ্যারান্টিযুক্ত রিটার্ন এবং সম্পূর্ণ টাস্ক ফিচার।
            </p>

            {/* Benefits */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">বিনিয়োগের সুবিধাসমূহ:</h3>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">দৈনিক ২০-৩০% রিটার্ন</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">উইথড্র সুবিধা সক্রিয়</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">সম্পূর্ণ টাস্ক ফিচার আনলক</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">রেফারেল বোনাস বৃদ্ধি</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              এখনই ইনভেস্ট করুন
            </Button>
          </CardContent>
        </Card>

        {/* Current Balance (Locked) */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              আপনার ব্যালেন্স
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>মোট ব্যালেন্স</span>
                <span className="font-bold">৳{user.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>বোনাস ব্যালেন্স</span>
                <span className="font-bold text-green-600">৳{user.bonusBalance}</span>
              </div>
              <div className="flex justify-between">
                <span>লক ব্যালেন্স</span>
                <span className="font-bold text-red-600">৳{user.lockedBalance}</span>
              </div>
            </div>
            <Alert className="mt-4 border-red-200 bg-red-50">
              <Info className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">বিনিয়োগ ছাড়া টাকা তোলা যাবে না</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 mb-6 rounded-lg">
        <h1 className="text-xl font-bold text-center">টাকা তোলা</h1>
      </div>

      {/* Balance Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            উইথড্র যোগ্য ব্যালেন্স
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">৳{user.balance.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">
              সর্বনিম্ন উইথড্র: ৳{user.minWithdraw} | ফি: ৳{user.withdrawFee}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Methods */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>উইথড্র পদ্ধতি নির্বাচন করুন</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {withdrawMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                  </div>
                  <p className="font-medium">{method.name}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Form */}
      {selectedMethod && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>উইথড্র তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">উইথড্র পরিমাণ</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`সর্বনিম্ন ৳${user.minWithdraw}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">
                {selectedMethod === "bkash" ? "bKash" : selectedMethod === "nagad" ? "Nagad" : "Rocket"} নম্বর
              </Label>
              <Input
                id="account"
                placeholder="01712345678"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            {/* Fee Calculation */}
            {amount && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>উইথড্র পরিমাণ:</span>
                      <span>৳{amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ফি:</span>
                      <span>৳{user.withdrawFee}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>আপনি পাবেন:</span>
                      <span>৳{Math.max(0, Number.parseInt(amount) - user.withdrawFee)}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              size="lg"
              disabled={!amount || !accountNumber || Number.parseInt(amount) < user.minWithdraw}
              onClick={handleWithdraw}
            >
              উইথড্র রিকোয়েস্ট পাঠান
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Withdraw Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>উইথড্র শর্তাবলী</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>সর্বনিম্ন উইথড্র পরিমাণ ৳{user.minWithdraw}</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>প্রতি উইথড্রে ৳{user.withdrawFee} ফি প্রযোজ্য</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>উইথড্র প্রক্রিয়া ২৪-৪৮ ঘন্টা সময় নিতে পারে</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>OTP যাচাইকরণ প্রয়োজন</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
