"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, Calculator, Clock, DollarSign, CheckCircle, AlertCircle, Star, Zap, Shield, Target, Calendar, Wallet, Gift, Info } from 'lucide-react'
import { useSound } from "../hooks/use-sound"
import SoundButton from "./sound-button"
import type { User as UserType } from "../lib/database"

interface InvestmentPackage {
  id: number
  name: string
  minAmount: number
  maxAmount: number
  dailyReturn: number
  duration: number
  totalReturn: number
  popular: boolean
  features: string[]
  riskLevel: "low" | "medium" | "high"
  description: string
}

interface InvestmentScreenProps {
  user: UserType
  onBack: () => void
  onInvestmentSuccess: (updatedUser: UserType) => void
}

export default function InvestmentScreen({ user, onBack, onInvestmentSuccess }: InvestmentScreenProps) {
  const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [calculatedReturns, setCalculatedReturns] = useState({
    dailyReturn: 0,
    totalReturn: 0,
    totalAmount: 0,
  })

  const { playSound } = useSound()

  const investmentPackages: InvestmentPackage[] = [
    {
      id: 1,
      name: "স্টার্টার প্যাকেজ",
      minAmount: 500,
      maxAmount: 2000,
      dailyReturn: 3,
      duration: 30,
      totalReturn: 90,
      popular: false,
      riskLevel: "low",
      description: "নতুন বিনিয়োগকারীদের জন্য নিরাপদ বিকল্প",
      features: [
        "দৈনিক ৩% রিটার্ন",
        "৩০ দিনের মেয়াদ",
        "নিম্ন ঝুঁকি",
        "তাৎক্ষণিক প্রত্যাহার",
        "২৪/৭ সাপোর্ট",
      ],
    },
    {
      id: 2,
      name: "প্রিমিয়াম প্যাকেজ",
      minAmount: 2000,
      maxAmount: 10000,
      dailyReturn: 4,
      duration: 30,
      totalReturn: 120,
      popular: true,
      riskLevel: "medium",
      description: "সর্বোচ্চ জনপ্রিয় প্যাকেজ - সেরা রিটার্ন",
      features: [
        "দৈনিক ৪% রিটার্ন",
        "৩০ দিনের মেয়াদ",
        "মধ্যম ঝুঁকি",
        "বোনাস রিওয়ার্ড",
        "প্রাইওরিটি সাপোর্ট",
        "বিশেষ অফার",
      ],
    },
    {
      id: 3,
      name: "ভিআইপি প্যাকেজ",
      minAmount: 10000,
      maxAmount: 50000,
      dailyReturn: 5,
      duration: 30,
      totalReturn: 150,
      popular: false,
      riskLevel: "high",
      description: "উচ্চ বিনিয়োগকারীদের জন্য প্রিমিয়াম সুবিধা",
      features: [
        "দৈনিক ৫% রিটার্ন",
        "৩০ দিনের মেয়াদ",
        "উচ্চ রিটার্ন",
        "ডেডিকেটেড ম্যানেজার",
        "এক্সক্লুসিভ বোনাস",
        "ভিআইপি সাপোর্ট",
        "বিশেষ ইভেন্ট অ্যাক্সেস",
      ],
    },
  ]

  // Calculate returns when amount or package changes
  useEffect(() => {
    if (selectedPackage && investmentAmount) {
      const amount = parseFloat(investmentAmount)
      if (!isNaN(amount)) {
        const dailyReturn = (amount * selectedPackage.dailyReturn) / 100
        const totalReturn = dailyReturn * selectedPackage.duration
        const totalAmount = amount + totalReturn

        setCalculatedReturns({
          dailyReturn,
          totalReturn,
          totalAmount,
        })
      }
    }
  }, [selectedPackage, investmentAmount])

  const handlePackageSelect = (pkg: InvestmentPackage) => {
    setSelectedPackage(pkg)
    setInvestmentAmount(pkg.minAmount.toString())
    playSound("click")
  }

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "")
    setInvestmentAmount(numericValue)
  }

  const validateInvestment = () => {
    if (!selectedPackage || !investmentAmount) return false

    const amount = parseFloat(investmentAmount)
    if (isNaN(amount)) return false

    if (amount < selectedPackage.minAmount || amount > selectedPackage.maxAmount) return false
    if (amount > user.balance) return false

    return true
  }

  const handleInvestmentConfirm = async () => {
    if (!validateInvestment()) return

    setLoading(true)
    playSound("success")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = parseFloat(investmentAmount)
      const updatedUser: UserType = {
        ...user,
        balance: user.balance - amount,
        invested: (user.invested || 0) + amount,
      }

      setShowConfirmDialog(false)
      setShowSuccessDialog(true)

      // After success dialog, update parent
      setTimeout(() => {
        setShowSuccessDialog(false)
        onInvestmentSuccess(updatedUser)
      }, 3000)
    } catch (error) {
      console.error("Investment failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getRiskText = (risk: string) => {
    switch (risk) {
      case "low":
        return "কম ঝুঁকি"
      case "medium":
        return "মধ্যম ঝুঁকি"
      case "high":
        return "উচ্চ ঝুঁকি"
      default:
        return "অজানা"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <SoundButton soundType="click" onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </SoundButton>
          <div>
            <h1 className="text-lg font-semibold bengali-text">বিনিয়োগ প্যাকেজ</h1>
            <p className="text-sm opacity-90 bengali-text">আপনার পছন্দের প্যাকেজ নির্বাচন করুন</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 bengali-text">উপলব্ধ ব্যালেন্স</p>
                <p className="text-2xl font-bold">৳{user.balance.toLocaleString()}</p>
              </div>
              <Wallet className="w-8 h-8 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Packages */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 bengali-text">বিনিয়োগ প্যাকেজসমূহ</h2>
        <div className="space-y-4">
          {investmentPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden cursor-pointer transition-all ${
                selectedPackage?.id === pkg.id
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => handlePackageSelect(pkg)}
            >
              {pkg.popular && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-orange-500 text-white flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    জনপ্রিয়
                  </Badge>
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold bengali-text">{pkg.name}</h3>
                    <p className="text-sm text-gray-600 bengali-text">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{pkg.dailyReturn}%</p>
                    <p className="text-xs text-gray-500 bengali-text">দৈনিক রিটার্ন</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 bengali-text">সর্বনিম্ন</p>
                    <p className="font-semibold">৳{pkg.minAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 bengali-text">মেয়াদ</p>
                    <p className="font-semibold">{pkg.duration} দিন</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 bengali-text">মোট রিটার্ন</p>
                    <p className="font-semibold text-green-600">{pkg.totalReturn}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getRiskColor(pkg.riskLevel)} border-0`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {getRiskText(pkg.riskLevel)}
                  </Badge>
                  <p className="text-sm text-gray-600 bengali-text">
                    সর্বোচ্চ: ৳{pkg.maxAmount.toLocaleString()}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {pkg.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="bengali-text">{feature}</span>
                    </div>
                  ))}
                  {pkg.features.length > 3 && (
                    <p className="text-xs text-blue-600 bengali-text">
                      +{pkg.features.length - 3} আরও সুবিধা
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Investment Form */}
      {selectedPackage && (
        <div className="px-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bengali-text">
                <Calculator className="w-5 h-5 text-blue-600" />
                বিনিয়োগের পরিমাণ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount" className="bengali-text">
                  বিনিয়োগের পরিমাণ (৳)
                </Label>
                <Input
                  id="amount"
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={`${selectedPackage.minAmount} - ${selectedPackage.maxAmount}`}
                  className="text-lg font-semibold"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span className="bengali-text">
                    সর্বনিম্ন: ৳{selectedPackage.minAmount.toLocaleString()}
                  </span>
                  <span className="bengali-text">
                    সর্বোচ্চ: ৳{selectedPackage.maxAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  selectedPackage.minAmount,
                  Math.floor(selectedPackage.maxAmount * 0.25),
                  Math.floor(selectedPackage.maxAmount * 0.5),
                  selectedPackage.maxAmount,
                ].map((amount) => (
                  <SoundButton
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setInvestmentAmount(amount.toString())}
                    className="bengali-text"
                  >
                    ৳{amount.toLocaleString()}
                  </SoundButton>
                ))}
              </div>

              {/* Validation Messages */}
              {investmentAmount && (
                <div className="space-y-2">
                  {parseFloat(investmentAmount) < selectedPackage.minAmount && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="bengali-text">
                        সর্বনিম্ন বিনিয়োগ ৳{selectedPackage.minAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {parseFloat(investmentAmount) > selectedPackage.maxAmount && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="bengali-text">
                        সর্বোচ্চ বিনিয়োগ ৳{selectedPackage.maxAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {parseFloat(investmentAmount) > user.balance && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="bengali-text">অপর্যাপ্ত ব্যালেন্স</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Return Calculator */}
      {selectedPackage && investmentAmount && validateInvestment() && (
        <div className="px-4 mb-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 bengali-text">
                <Target className="w-5 h-5" />
                প্রত্যাশিত রিটার্ন
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 bengali-text">দৈনিক আয়</p>
                  <p className="text-xl font-bold text-green-600">
                    ৳{calculatedReturns.dailyReturn.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 bengali-text">মোট আয়</p>
                  <p className="text-xl font-bold text-green-600">
                    ৳{calculatedReturns.totalReturn.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg">
                <p className="text-sm opacity-90 bengali-text">৩০ দিন পর মোট পরিমাণ</p>
                <p className="text-2xl font-bold">৳{calculatedReturns.totalAmount.toLocaleString()}</p>
              </div>

              {/* Progress Visualization */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="bengali-text">বিনিয়োগ</span>
                  <span className="bengali-text">রিটার্ন</span>
                </div>
                <Progress
                  value={(parseFloat(investmentAmount) / calculatedReturns.totalAmount) * 100}
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>৳{parseFloat(investmentAmount).toLocaleString()}</span>
                  <span>+৳{calculatedReturns.totalReturn.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Investment Button */}
      {selectedPackage && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <SoundButton
            onClick={() => setShowConfirmDialog(true)}
            disabled={!validateInvestment()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-lg font-semibold bengali-text"
          >
            {validateInvestment() ? "বিনিয়োগ নিশ্চিত করুন" : "বিনিয়োগ করুন"}
          </SoundButton>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center bengali-text">বিনিয়োগ নিশ্চিতকরণ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold bengali-text">{selectedPackage?.name}</h3>
            </div>

            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-gray-600 bengali-text">বিনিয়োগের পরিমাণ:</span>
                <span className="font-semibold">৳{parseFloat(investmentAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 bengali-text">দৈনিক রিটার্ন:</span>
                <span className="font-semibold text-green-600">
                  ৳{calculatedReturns.dailyReturn.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 bengali-text">মেয়াদ:</span>
                <span className="font-semibold">{selectedPackage?.duration} দিন</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 bengali-text">মোট রিটার্ন:</span>
                <span className="font-bold text-green-600">
                  ৳{calculatedReturns.totalReturn.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <Info className="w-4 h-4 mr-2 text-blue-600" />
              <span className="bengali-text">
                বিনিয়োগের পর আপনার ব্যালেন্স ৳{(user.balance - parseFloat(investmentAmount)).toLocaleString()} হবে
              </span>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bengali-text"
              >
                বাতিল
              </Button>
              <SoundButton
                onClick={handleInvestmentConfirm}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 bengali-text"
              >
                {loading ? "প্রক্রিয়াকরণ..." : "নিশ্চিত করুন"}
              </SoundButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center bengali-text">🎉 বিনিয়োগ সফল!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 bengali-text">অভিনন্দন!</h3>
            <p className="text-gray-600 mb-4 bengali-text">
              আপনার বিনিয়োগ সফলভাবে সম্পন্ন হয়েছে
            </p>
            <div className="bg-green-100 rounded-lg p-4 mb-4">
              <p className="text-lg font-bold text-green-600">
                ৳{parseFloat(investmentAmount).toLocaleString()}
              </p>
              <p className="text-sm text-green-700 bengali-text">
                {selectedPackage?.name} এ বিনিয়োগ করা হয়েছে
              </p>
            </div>
            <p className="text-sm text-gray-600 bengali-text">
              আগামীকাল থেকে দৈনিক রিটার্ন পেতে শুরু করবেন
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
