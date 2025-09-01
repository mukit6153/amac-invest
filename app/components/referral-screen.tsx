"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, Share2, Copy, DollarSign, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { dataFunctions, User, subscribeToUserUpdates } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"

interface ReferralScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function ReferralScreen({ user, onUserUpdate }: ReferralScreenProps) {
  const router = useRouter()
  const [referrals, setReferrals] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true)
      setMessage(null)
      try {
        const fetchedReferrals = await dataFunctions.getReferrals(user.id)
        setReferrals(fetchedReferrals)
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "রেফারেল লোড করতে ব্যর্থ হয়েছে।" })
      } finally {
        setLoading(false)
      }
    }
    fetchReferrals()

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

  const handleCopyReferralCode = () => {
    if (user.referral_code) {
      navigator.clipboard.writeText(user.referral_code)
      setMessage({ type: "success", text: "রেফারেল কোড কপি করা হয়েছে!" })
      playSound("click")
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleShareReferral = () => {
    if (navigator.share && user.referral_code) {
      navigator.share({
        title: 'AMAC Investment App',
        text: `আমার রেফারেল কোড ব্যবহার করে AMAC Investment App এ যোগ দিন এবং বোনাস পান: ${user.referral_code}`,
        url: window.location.origin,
      })
      .then(() => {
        setMessage({ type: "success", text: "রেফারেল লিঙ্ক শেয়ার করা হয়েছে!" })
        playSound("success")
      })
      .catch((error) => {
        setMessage({ type: "error", text: `শেয়ার করতে ব্যর্থ: ${error.message}` })
        playSound("error")
      })
    } else {
      setMessage({ type: "error", text: "আপনার ব্রাউজার শেয়ারিং সমর্থন করে না।" })
      playSound("error")
    }
    setTimeout(() => setMessage(null), 3000)
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
        <h1 className="text-xl font-bold bangla-text">রেফারেল</h1>
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

        {/* Referral Code Card */}
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg rounded-xl">
          <CardContent className="p-6 space-y-4 text-center">
            <Users className="h-10 w-10 mx-auto" />
            <h2 className="text-2xl font-bold bangla-text">আপনার রেফারেল কোড</h2>
            <div className="flex items-center justify-center bg-white/20 rounded-md p-3">
              <Input
                type="text"
                value={user.referral_code || "N/A"}
                readOnly
                className="bg-transparent border-none text-white text-xl font-mono text-center bangla-text focus-visible:ring-0"
              />
              <Button variant="ghost" size="icon" onClick={handleCopyReferralCode} className="text-white hover:bg-white/30">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <Button
              className="w-full bg-white text-green-600 hover:bg-gray-100 bangla-text"
              onClick={handleShareReferral}
            >
              <Share2 className="h-4 w-4 mr-2" /> শেয়ার করুন
            </Button>
            <p className="text-sm opacity-90 bangla-text">আপনার বন্ধুদের আমন্ত্রণ জানান এবং বোনাস উপার্জন করুন!</p>
          </CardContent>
        </Card>

        {/* Referral Benefits */}
        <Card className="bg-white shadow-md rounded-lg p-4 space-y-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 bangla-text">রেফারেল সুবিধা</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700 text-sm bangla-text">
            <p>১. প্রতিটি সফল রেফারেলের জন্য ৳৫০ বোনাস পান।</p>
            <p>২. আপনার রেফারেল যখন বিনিয়োগ করবে, তখন তাদের বিনিয়োগের ৫% কমিশন পান।</p>
            <p>৩. আপনার রেফারেলের রেফারেল থেকে ২% কমিশন পান (মাল্টি-লেভেল)।</p>
          </CardContent>
        </Card>

        {/* Your Referrals List */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">আপনার রেফারেল</h2>
        {referrals.length === 0 ? (
          <Card className="p-4 text-center text-gray-600 bangla-text">
            আপনার কোন রেফারেল নেই।
          </Card>
        ) : (
          <div className="space-y-4">
            {referrals.map((ref) => (
              <Card key={ref.id} className="bg-white shadow-md rounded-lg">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-600 bangla-text">{ref.name}</h3>
                    <p className="text-sm text-gray-700 bangla-text">{ref.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-bold bangla-text">৳{ref.invested.toFixed(2)}</span> {/* Example: show their invested amount */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
