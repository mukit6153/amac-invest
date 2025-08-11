"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, DollarSign, Banknote, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { dataFunctions, authFunctions, User } from "@/app/lib/database"
import WithdrawScreen from "@/app/components/withdraw-screen"
import SplashScreen from "@/app/components/splash-screen"
import { useSound } from "@/app/hooks/use-sound"
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

interface WithdrawScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default async function WithdrawPage() {
  const cookieStore = cookies()
  const userId = cookieStore.get('currentUserId')?.value

  let user: User | null = null
  if (userId) {
    user = await authFunctions.getCurrentUser(userId)
  }

  if (!user) {
    redirect('/auth/login')
  }

  // This page is a client component wrapper for WithdrawScreen
  // The actual data fetching and state management for the user will happen in the client component
  // and passed down.
  return <WithdrawScreen user={user} onUserUpdate={() => { /* client-side update logic */ }} />
}

function WithdrawScreen({ user, onUserUpdate }: WithdrawScreenProps) {
  const [amount, setAmount] = useState<number>(0)
  const [method, setMethod] = useState<string>("")
  const [accountDetails, setAccountDetails] = useState<string>("")
  const [loadingWithdrawal, setLoadingWithdrawal] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    if (user?.id) {
      const channel = authFunctions.subscribeToUserUpdates(user.id, (payload) => {
        if (payload.new) {
          onUserUpdate(payload.new as User)
        }
      })
      return () => {
        channel.unsubscribe()
      }
    }
  }, [user?.id, onUserUpdate])

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    setLoadingWithdrawal(true)
    setMessage(null)

    if (amount <= 0) {
      setMessage({ type: "error", text: "উত্তোলনের পরিমাণ অবশ্যই ০ এর বেশি হতে হবে।" })
      playSound("error")
      setLoadingWithdrawal(false)
      return
    }
    if (amount > user.balance) {
      setMessage({ type: "error", text: "অপর্যাপ্ত ব্যালেন্স।" })
      playSound("error")
      setLoadingWithdrawal(false)
      return
    }
    if (!method) {
      setMessage({ type: "error", text: "উত্তোলনের পদ্ধতি নির্বাচন করুন।" })
      playSound("error")
      setLoadingWithdrawal(false)
      return
    }
    if (!accountDetails) {
      setMessage({ type: "error", text: "অ্যাকাউন্ট বিবরণ লিখুন।" })
      playSound("error")
      setLoadingWithdrawal(false)
      return
    }

    try {
      const updatedUser = await dataFunctions.processWithdrawal(user.id, amount, method, accountDetails)
      onUserUpdate(updatedUser)
      setMessage({ type: "success", text: "উত্তোলনের অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!" })
      playSound("success")
      setAmount(0)
      setMethod("")
      setAccountDetails("")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "উত্তোলন ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoadingWithdrawal(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => { playSound("click"); window.history.back() }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bangla-text">উত্তোলন</h1>
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
              <Banknote className="h-6 w-6" />
              <span className="text-lg font-semibold bangla-text">আপনার বর্তমান ব্যালেন্স</span>
            </div>
            <span className="text-3xl font-bold bangla-text">৳{user.balance.toFixed(2)}</span>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="bg-white shadow-md rounded-lg p-4 space-y-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 bangla-text">উত্তোলনের অনুরোধ</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <Label htmlFor="amount" className="bangla-text">উত্তোলনের পরিমাণ</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  placeholder="পরিমাণ লিখুন"
                  required
                  className="mt-1 bangla-text"
                  min={0}
                  step="any"
                />
              </div>
              <div>
                <Label htmlFor="method" className="bangla-text">উত্তোলনের পদ্ধতি</Label>
                <Select value={method} onValueChange={setMethod} required>
                  <SelectTrigger className="w-full mt-1 bangla-text">
                    <SelectValue placeholder="পদ্ধতি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkash" className="bangla-text">বিকাশ</SelectItem>
                    <SelectItem value="nagad" className="bangla-text">নগদ</SelectItem>
                    <SelectItem value="rocket" className="bangla-text">রকেট</SelectItem>
                    <SelectItem value="bank" className="bangla-text">ব্যাংক ট্রান্সফার</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="accountDetails" className="bangla-text">অ্যাকাউন্ট বিবরণ (যেমন: ফোন নম্বর বা ব্যাংক অ্যাকাউন্ট)</Label>
                <Input
                  id="accountDetails"
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="অ্যাকাউন্ট বিবরণ লিখুন"
                  required
                  className="mt-1 bangla-text"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" disabled={loadingWithdrawal}>
                {loadingWithdrawal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    জমা দেওয়া হচ্ছে...
                  </>
                ) : (
                  "অনুরোধ জমা দিন"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Withdrawal History (Placeholder) */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">উত্তোলনের ইতিহাস</h2>
        <Card className="p-4 text-center text-gray-600 bangla-text">
          কোন উত্তোলনের ইতিহাস নেই।
        </Card>
      </main>
    </div>
  )
}
