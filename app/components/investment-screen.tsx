"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import {
  ArrowLeft,
  TrendingUp,
  Crown,
  Star,
  Shield,
  Clock,
  DollarSign,
  Calculator,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { dataFunctions, actionFunctions, type User, type InvestmentPackage } from "../lib/database"

interface InvestmentScreenProps {
  user: User
  onBack: () => void
}

export default function InvestmentScreen({ user, onBack }: InvestmentScreenProps) {
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const { sounds } = useSound()

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      const packagesData = await dataFunctions.getInvestmentPackages()
      setPackages(packagesData)
    } catch (error) {
      console.error("Error loading packages:", error)
    }
  }

  const handleInvest = async () => {
    if (!selectedPackage || !investmentAmount) return

    const amount = Number.parseFloat(investmentAmount)
    if (amount < selectedPackage.min_amount || amount > selectedPackage.max_amount) {
      sounds.error()
      return
    }

    if (amount > user.balance) {
      sounds.error()
      return
    }

    setLoading(true)
    try {
      const result = await actionFunctions.createInvestment(user.id, selectedPackage.id, amount)
      if (result.success) {
        sounds.success()
        setInvestmentAmount("")
        setSelectedPackage(null)
        // Show success message
      } else {
        sounds.error()
      }
    } catch (error) {
      console.error("Investment error:", error)
      sounds.error()
    } finally {
      setLoading(false)
    }
  }

  const calculateReturns = (amount: number, pkg: InvestmentPackage) => {
    const dailyReturn = (amount * pkg.daily_rate) / 100
    const totalReturn = (amount * pkg.total_return_rate) / 100
    return { dailyReturn, totalReturn }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <SoundButton variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </SoundButton>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">বিনিয়োগ প্যাকেজ</h1>
                <p className="text-xs text-gray-600">আপনার পছন্দের প্যাকেজ বেছে নিন</p>
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
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Packages */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold bangla-text">বিনিয়োগ প্যাকেজসমূহ</h2>

          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedPackage?.id === pkg.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => {
                setSelectedPackage(pkg)
                sounds.buttonClick()
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${pkg.color || "bg-blue-500"}`}
                    >
                      <Crown className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{pkg.name_bn}</CardTitle>
                      <p className="text-xs text-gray-600">{pkg.name}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {pkg.daily_rate}% দৈনিক
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">সর্বনিম্ন</p>
                    <p className="font-bold text-blue-600">৳{pkg.min_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">সর্বোচ্চ</p>
                    <p className="font-bold text-green-600">৳{pkg.max_amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{pkg.total_days} দিন</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{pkg.total_return_rate}% মোট</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-gray-600">নিরাপদ</span>
                  </div>
                </div>

                {pkg.features && (
                  <div className="space-y-1">
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investment Form */}
        {selectedPackage && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                বিনিয়োগ করুন - {selectedPackage.name_bn}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  বিনিয়োগের পরিমাণ (৳)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`${selectedPackage.min_amount} - ${selectedPackage.max_amount}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="mt-1"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">সর্বনিম্ন: ৳{selectedPackage.min_amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">সর্বোচ্চ: ৳{selectedPackage.max_amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  selectedPackage.min_amount,
                  Math.floor((selectedPackage.min_amount + selectedPackage.max_amount) / 2),
                  selectedPackage.max_amount,
                ].map((amount) => (
                  <SoundButton
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setInvestmentAmount(amount.toString())}
                    className="text-xs"
                  >
                    ৳{amount.toLocaleString()}
                  </SoundButton>
                ))}
              </div>

              {/* Calculator */}
              {investmentAmount && Number.parseFloat(investmentAmount) >= selectedPackage.min_amount && (
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <h4 className="font-medium text-sm bangla-text">রিটার্ন ক্যালকুলেটর</h4>
                  {(() => {
                    const amount = Number.parseFloat(investmentAmount)
                    const { dailyReturn, totalReturn } = calculateReturns(amount, selectedPackage)
                    return (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <p className="text-xs text-gray-600">দৈনিক আয়</p>
                          <p className="font-bold text-green-600">৳{dailyReturn.toFixed(2)}</p>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-xs text-gray-600">মোট আয়</p>
                          <p className="font-bold text-blue-600">৳{totalReturn.toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Validation Messages */}
              {investmentAmount && (
                <div className="space-y-2">
                  {Number.parseFloat(investmentAmount) < selectedPackage.min_amount && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">সর্বনিম্ন বিনিয়োগ ৳{selectedPackage.min_amount.toLocaleString()}</span>
                    </div>
                  )}
                  {Number.parseFloat(investmentAmount) > selectedPackage.max_amount && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">সর্বোচ্চ বিনিয়োগ ৳{selectedPackage.max_amount.toLocaleString()}</span>
                    </div>
                  )}
                  {Number.parseFloat(investmentAmount) > user.balance && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">অপর্যাপ্ত ব্যালেন্স</span>
                    </div>
                  )}
                </div>
              )}

              <SoundButton
                className="w-full"
                onClick={handleInvest}
                disabled={
                  loading ||
                  !investmentAmount ||
                  Number.parseFloat(investmentAmount) < selectedPackage.min_amount ||
                  Number.parseFloat(investmentAmount) > selectedPackage.max_amount ||
                  Number.parseFloat(investmentAmount) > user.balance
                }
              >
                {loading ? "বিনিয়োগ করা হচ্ছে..." : `৳${investmentAmount || "0"} বিনিয়োগ করুন`}
              </SoundButton>
            </CardContent>
          </Card>
        )}

        {/* Investment Tips */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              বিনিয়োগের টিপস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span className="text-sm text-gray-700">ছোট পরিমাণ দিয়ে শুরু করুন</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span className="text-sm text-gray-700">নিয়মিত রিটার্ন চেক করুন</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span className="text-sm text-gray-700">দীর্ঘমেয়াদী পরিকল্পনা করুন</span>
            </div>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
