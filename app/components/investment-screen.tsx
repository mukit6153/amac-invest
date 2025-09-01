"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Loader2, Wallet } from 'lucide-react'
import { dataFunctions, InvestmentPackage, User, UserInvestment, subscribeToUserUpdates } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"

interface InvestmentScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function InvestmentScreen({ user, onUserUpdate }: InvestmentScreenProps) {
  const router = useRouter()
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState<number>(0)
  const { playSound } = useSound()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setMessage(null)
      try {
        const fetchedPackages = await dataFunctions.getInvestmentPackages()
        setPackages(fetchedPackages)
        if (user?.id) {
          const fetchedInvestments = await dataFunctions.getUserInvestments(user.id)
          setUserInvestments(fetchedInvestments)
        }
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "ডেটা লোড করতে ব্যর্থ হয়েছে।" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    if (user?.id) {
      const channel = subscribeToUserUpdates(user.id, (payload) => {
        if (payload.new) {
          onUserUpdate(payload.new as User)
          // Re-fetch investments to reflect real-time changes
          dataFunctions.getUserInvestments(user.id).then(setUserInvestments).catch(console.error)
        }
      })
      return () => {
        channel.unsubscribe()
      }
    }
  }, [user?.id, onUserUpdate])

  const handleInvest = async () => {
    playSound("click")
    if (!selectedPackageId || investmentAmount <= 0) {
      setMessage({ type: "error", text: "একটি প্যাকেজ নির্বাচন করুন এবং সঠিক পরিমাণ লিখুন।" })
      playSound("error")
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const updatedUser = await dataFunctions.investInPackage(user.id, selectedPackageId)
      onUserUpdate(updatedUser)
      const fetchedInvestments = await dataFunctions.getUserInvestments(user.id)
      setUserInvestments(fetchedInvestments)
      setMessage({ type: "success", text: "বিনিয়োগ সফল হয়েছে!" })
      playSound("success")
      setSelectedPackageId(null)
      setInvestmentAmount(0)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "বিনিয়োগ ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-3 text-gray-600 bangla-text">লোড হচ্ছে...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => { playSound("click"); router.back() }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bangla-text">বিনিয়োগ</h1>
        <div className="w-5 h-5" /> {/* Placeholder for alignment */}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 overflow-auto">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="text-sm bangla-text">{message.text}</span>
          </div>
        )}

        {/* Current Balance */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              <span className="text-lg font-semibold bangla-text">আপনার ব্যালেন্স</span>
            </div>
            <span className="text-3xl font-bold bangla-text">৳{user.balance.toFixed(2)}</span>
          </CardContent>
        </Card>

        {/* Investment Packages */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">বিনিয়োগ প্যাকেজ</h2>
        {packages.length === 0 ? (
          <Card className="p-4 text-center text-gray-600 bangla-text">
            কোন বিনিয়োগ প্যাকেজ উপলব্ধ নেই।
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`bg-white shadow-md rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPackageId === pkg.id ? "border-2 border-blue-600 ring-2 ring-blue-300" : "border border-gray-200 hover:shadow-lg"
                }`}
                onClick={() => { playSound("click"); setSelectedPackageId(pkg.id); setInvestmentAmount(pkg.price) }}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-blue-600 bangla-text">{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-700 text-sm bangla-text">{pkg.description}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm bangla-text">মূল্য: ৳{pkg.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm bangla-text">দৈনিক রিটার্ন: {pkg.daily_return_percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm bangla-text">সময়কাল: {pkg.duration_days} দিন</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Invest Section */}
        {selectedPackageId && (
          <Card className="bg-white shadow-md rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 bangla-text">বিনিয়োগ করুন</h3>
            <div>
              <Label htmlFor="amount" className="bangla-text">পরিমাণ</Label>
              <Input
                id="amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseFloat(e.target.value))}
                className="mt-1 bangla-text"
                min={packages.find(p => p.id === selectedPackageId)?.price || 0}
                step="any"
              />
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 bangla-text"
              onClick={handleInvest}
              disabled={loading || investmentAmount <= 0 || investmentAmount < (packages.find(p => p.id === selectedPackageId)?.price || 0)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  প্রসেস হচ্ছে...
                </>
              ) : (
                "এখন বিনিয়োগ করুন"
              )}
            </Button>
          </Card>
        )}

        {/* Your Investments */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">আপনার বিনিয়োগ</h2>
        {userInvestments.length === 0 ? (
          <Card className="p-4 text-center text-gray-600 bangla-text">
            আপনার কোন সক্রিয় বিনিয়োগ নেই।
          </Card>
        ) : (
          <div className="space-y-4">
            {userInvestments.map((investment) => (
              <Card key={investment.id} className="bg-white shadow-md rounded-lg">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-blue-600 bangla-text">{investment.package_name}</h3>
                  <p className="text-sm text-gray-700 bangla-text">বিনিয়োগকৃত: ৳{investment.invested_amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-700 bangla-text">দৈনিক রিটার্ন: ৳{investment.daily_return.toFixed(2)}</p>
                  <p className="text-sm text-gray-700 bangla-text">শুরু: {new Date(investment.start_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700 bangla-text">শেষ: {new Date(investment.end_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700 bangla-text">স্ট্যাটাস: <span className={`font-medium ${investment.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>{investment.status === 'active' ? 'সক্রিয়' : 'সম্পন্ন'}</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
