"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Gift, DollarSign, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useSound } from "@/app/hooks/use-sound"
import { User, dataFunctions, subscribeToUserUpdates } from "@/app/lib/database"

interface FreeGiftScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function FreeGiftScreen({ user, onUserUpdate }: FreeGiftScreenProps) {
  const router = useRouter()
  const [canClaim, setCanClaim] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  const GIFT_AMOUNT = 50 // Example fixed gift amount

  useEffect(() => {
    const checkClaimStatus = async () => {
      setLoading(true)
      setMessage(null)
      try {
        // Simulate checking if the user has claimed the free gift today
        // In a real app, this would be stored in Supabase (e.g., a 'last_free_gift_claim' timestamp on the user)
        const lastClaimDate = localStorage.getItem(`lastFreeGiftClaim_${user.id}`)
        const today = new Date().toDateString()

        if (lastClaimDate === today) {
          setCanClaim(false)
        } else {
          setCanClaim(true)
        }
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "উপহারের স্থিতি পরীক্ষা করতে ব্যর্থ হয়েছে।" })
      } finally {
        setLoading(false)
      }
    }
    checkClaimStatus()

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

  const handleClaimGift = async () => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      // Simulate claiming gift and updating user balance
      // In a real app, this would be a server-side function call
      const { data, error } = await dataFunctions.supabase.from('users').update({ balance: user.balance + GIFT_AMOUNT }).eq('id', user.id)

      if (error) throw error

      onUserUpdate({ ...user, balance: user.balance + GIFT_AMOUNT })

      // Mark gift as claimed for today
      localStorage.setItem(`lastFreeGiftClaim_${user.id}`, new Date().toDateString())
      setCanClaim(false)
      setMessage({ type: "success", text: `অভিনন্দন! আপনি ৳${GIFT_AMOUNT} ফ্রি গিফট দাবি করেছেন!` })
      playSound("bonus")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "উপহার দাবি করতে ব্যর্থ হয়েছে।" })
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
        <h1 className="text-xl font-bold bangla-text">ফ্রি গিফট</h1>
        <div className="w-5 h-5" /> {/* Placeholder for alignment */}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 flex flex-col items-center justify-center overflow-auto">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md w-full max-w-md ${
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

        <Card className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-700 bangla-text">দৈনিক ফ্রি গিফট!</CardTitle>
            <p className="text-gray-600 bangla-text">প্রতিদিন একবার আপনার ফ্রি গিফট দাবি করুন।</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <Gift className="h-24 w-24 text-purple-600 animate-bounce" />
            <p className="text-4xl font-bold text-green-600 bangla-text">৳{GIFT_AMOUNT}</p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg bangla-text"
              onClick={handleClaimGift}
              disabled={!canClaim || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  দাবি করা হচ্ছে...
                </>
              ) : canClaim ? (
                <>
                  <Gift className="mr-2 h-5 w-5" /> এখন দাবি করুন
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" /> আজকের উপহার দাবি করা হয়েছে
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Current Balance */}
        <Card className="w-full max-w-md bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-lg font-semibold bangla-text">আপনার ব্যালেন্স</span>
            </div>
            <span className="text-3xl font-bold bangla-text">৳{user.balance.toFixed(2)}</span>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
