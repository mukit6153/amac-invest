"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, Crown, Star, CheckCircle, Clock, Target, Zap } from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import { dataFunctions, actionFunctions, type InvestmentPackage, type Investment } from "../lib/database"

interface InvestmentScreenProps {
  user: any
  onBack: () => void
}

export default function InvestmentScreen({ user, onBack }: InvestmentScreenProps) {
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"packages" | "active" | "history">("packages")

  const { sounds } = useSound()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [packagesData, investmentsData] = await Promise.all([
        dataFunctions.getInvestmentPackages(),
        dataFunctions.getUserInvestments(user.id),
      ])
      setPackages(packagesData)
      setInvestments(investmentsData)
    } catch (error) {
      console.error("Error loading investment data:", error)
    }
  }

  const handleInvest = async () => {
    if (!selectedPackage || !investmentAmount) return

    const amount = Number.parseFloat(investmentAmount)
    if (amount < selectedPackage.min_amount || amount > selectedPackage.max_amount) {
      sounds.error()
      alert(`বিনিয়োগের পরিমাণ ৳${selectedPackage.min_amount} - ৳${selectedPackage.max_amount} এর মধ্যে হতে হবে`)
      return
    }

    if (amount > user.balance) {
      sounds.error()
      alert("অপর্যাপ্ত ব্যালেন্স")
      return
    }

    setLoading(true)
    try {
      const result = await actionFunctions.createInvestment(user.id, selectedPackage.id, amount)
      if (result.success) {
        sounds.success()
        alert("বিনিয়োগ সফল হয়েছে!")
        setSelectedPackage(null)
        setInvestmentAmount("")
        loadData()
      } else {
        sounds.error()
        alert(result.error || "বিনিয়োগে সমস্যা হয়েছে")
      }
    } catch (error) {
      sounds.error()
      alert("বিনিয়োগে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const calculateDailyReturn = (amount: number, rate: number) => {
    return (amount * rate) / 100
  }

  const calculateTotalReturn = (amount: number, rate: number) => {
    return (amount * rate) / 100
  }

  const activeInvestments = investments.filter((inv) => inv.status === "active")
  const completedInvestments = investments.filter((inv) => inv.status === "completed")

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
                <h1 className="font-bold text-gray-800 text-lg">বিনিয়োগ</h1>
                <p className="text-xs text-gray-600">আপনার বিনিয়োগ পরিচালনা করুন</p>
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
            variant={activeTab === "packages" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("packages")}
          >
            প্যাকেজ
          </SoundButton>
          <SoundButton
            variant={activeTab === "active" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs relative"
            onClick={() => setActiveTab("active")}
          >
            সক্রিয় ({activeInvestments.length})
          </SoundButton>
          <SoundButton
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("history")}
          >
            ইতিহাস
          </SoundButton>
        </div>

        {/* Investment Packages Tab */}
        {activeTab === "packages" && (
          <div className="space-y-4">
            {/* Package Selection */}
            <div className="grid gap-3">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md bg-white"
                  }`}
                  onClick={() => {
                    setSelectedPackage(pkg)
                    sounds.buttonClick()
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          {pkg.name === "VIP" ? (
                            <Crown className="h-5 w-5 text-white" />
                          ) : pkg.name === "Premium" ? (
                            <Star className="h-5 w-5 text-white" />
                          ) : (
                            <Zap className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{pkg.name_bn}</h3>
                          <p className="text-sm text-gray-600">{pkg.name}</p>
                        </div>
                      </div>
                      <Badge
                        variant={pkg.name === "VIP" ? "default" : pkg.name === "Premium" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {pkg.daily_rate}% দৈনিক
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">সর্বনিম্ন</p>
                        <p className="font-bold text-green-600">৳{pkg.min_amount.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">সর্বোচ্চ</p>
                        <p className="font-bold text-blue-600">৳{pkg.max_amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">মেয়াদ</p>
                        <p className="font-bold text-purple-600">{pkg.total_days} দিন</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">মোট রিটার্ন</p>
                        <p className="font-bold text-orange-600">{pkg.total_return_rate}%</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Investment Form */}
            {selectedPackage && (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    {selectedPackage.name_bn} এ বিনিয়োগ করুন
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">বিনিয়োগের পরিমাণ (৳)</label>
                    <Input
                      type="number"
                      placeholder={`৳${selectedPackage.min_amount} - ৳${selectedPackage.max_amount}`}
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="text-center text-lg font-bold"
                    />
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      সর্বনিম্ন: ৳{selectedPackage.min_amount.toLocaleString()} | সর্বোচ্চ: ৳
                      {selectedPackage.max_amount.toLocaleString()}
                    </p>
                  </div>

                  {investmentAmount && (
                    <div className="bg-white rounded-lg p-3 space-y-2">
                      <h4 className="font-medium text-sm text-center mb-2">বিনিয়োগ সারসংক্ষেপ</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <p className="text-gray-600">দৈনিক আয়</p>
                          <p className="font-bold text-green-600">
                            ৳
                            {calculateDailyReturn(Number.parseFloat(investmentAmount) || 0, selectedPackage.daily_rate)}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-gray-600">মোট আয়</p>
                          <p className="font-bold text-blue-600">
                            ৳
                            {calculateTotalReturn(
                              Number.parseFloat(investmentAmount) || 0,
                              selectedPackage.total_return_rate,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <SoundButton
                    className="w-full"
                    onClick={handleInvest}
                    disabled={
                      loading || !investmentAmount || Number.parseFloat(investmentAmount) < selectedPackage.min_amount
                    }
                  >
                    {loading ? "বিনিয়োগ করা হচ্ছে..." : `৳${investmentAmount || 0} বিনিয়োগ করুন`}
                  </SoundButton>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Active Investments Tab */}
        {activeTab === "active" && (
          <div className="space-y-3">
            {activeInvestments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">কোন সক্রিয় বিনিয়োগ নেই</p>
                  <SoundButton variant="outline" size="sm" className="mt-3" onClick={() => setActiveTab("packages")}>
                    বিনিয়োগ করুন
                  </SoundButton>
                </CardContent>
              </Card>
            ) : (
              activeInvestments.map((investment) => (
                <Card key={investment.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">{investment.investment_packages?.name_bn}</h3>
                          <p className="text-sm text-gray-600">৳{investment.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="text-xs">
                        সক্রিয়
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">অগ্রগতি</span>
                        <span className="font-medium">
                          {investment.days_completed}/{investment.total_days} দিন
                        </span>
                      </div>
                      <Progress value={(investment.days_completed / investment.total_days) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-gray-600">দৈনিক আয়</p>
                        <p className="font-bold text-green-600">৳{investment.daily_return}</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-gray-600">মোট আয়</p>
                        <p className="font-bold text-blue-600">৳{investment.total_return}</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="text-gray-600">পরবর্তী পেমেন্ট</p>
                        <p className="font-bold text-purple-600">
                          {new Date(investment.next_payment).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Investment History Tab */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {completedInvestments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">কোন সম্পন্ন বিনিয়োগ নেই</p>
                </CardContent>
              </Card>
            ) : (
              completedInvestments.map((investment) => (
                <Card key={investment.id} className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">{investment.investment_packages?.name_bn}</h3>
                          <p className="text-sm text-gray-600">৳{investment.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        সম্পন্ন
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-gray-600">মোট আয়</p>
                        <p className="font-bold text-green-600">৳{investment.total_return}</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-gray-600">সম্পন্ন</p>
                        <p className="font-bold text-gray-600">
                          {new Date(investment.updated_at).toLocaleDateString("bn-BD")}
                        </p>
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
