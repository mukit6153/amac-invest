"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Gift, DollarSign, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useSound } from "@/app/hooks/use-sound"
import { User, dataFunctions, subscribeToUserUpdates } from "@/app/lib/database"

interface SpinWheelScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

const segments = [
  { value: 10, color: "#FFD700", label: "৳10" },
  { value: 0, color: "#FF6347", label: "০" },
  { value: 20, color: "#ADFF2F", label: "৳20" },
  { value: 0, color: "#8A2BE2", label: "০" },
  { value: 50, color: "#00CED1", label: "৳50" },
  { value: 0, color: "#FF4500", label: "০" },
  { value: 100, color: "#FF1493", label: "৳100" },
  { value: 0, color: "#4682B4", label: "০" },
]

export default function SpinWheelScreen({ user, onUserUpdate }: SpinWheelScreenProps) {
  const router = useRouter()
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const { playSound } = useSound()

  useEffect(() => {
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

  const spinWheel = () => {
    playSound("click")
    if (spinning) return

    setSpinning(true)
    setResult(null)
    setMessage(null)
    playSound("spin")

    const numSegments = segments.length
    const degreesPerSegment = 360 / numSegments
    const winningSegmentIndex = Math.floor(Math.random() * numSegments)
    const winningValue = segments[winningSegmentIndex].value

    // Calculate a random rotation that lands in the winning segment
    // Add multiple full rotations to make it spin visibly
    const extraRotations = 5 * 360 // 5 full spins
    const targetRotation = extraRotations + (360 - (winningSegmentIndex * degreesPerSegment + degreesPerSegment / 2))

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)"
      wheelRef.current.style.transform = `rotate(${targetRotation}deg)`
    }

    setTimeout(() => {
      setSpinning(false)
      setResult(winningValue)
      if (winningValue > 0) {
        // Simulate adding bonus to user balance
        // In a real app, this would be a server-side function call
        dataFunctions.supabase.from('users').update({ balance: user.balance + winningValue }).eq('id', user.id)
          .then(({ data, error }) => {
            if (error) throw error
            onUserUpdate({ ...user, balance: user.balance + winningValue })
            setMessage({ type: "success", text: `অভিনন্দন! আপনি ৳${winningValue} জিতেছেন!` })
            playSound("bonus")
          })
          .catch((err) => {
            setMessage({ type: "error", text: `বোনাস যোগ করতে ব্যর্থ: ${err.message}` })
            playSound("error")
          })
      } else {
        setMessage({ type: "error", text: "দুঃখিত, আপনি কিছু জিততে পারেননি। আবার চেষ্টা করুন!" })
        playSound("error")
      }
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none"
        wheelRef.current.style.transform = `rotate(${targetRotation % 360}deg)` // Reset for next spin
      }
    }, 4000) // Match transition duration
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => { playSound("click"); router.back() }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bangla-text">স্পিন হুইল</h1>
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
            <CardTitle className="text-2xl font-bold text-blue-700 bangla-text">আপনার ভাগ্য পরীক্ষা করুন!</CardTitle>
            <p className="text-gray-600 bangla-text">প্রতিদিন একবার স্পিন করুন এবং পুরস্কার জিতুন।</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500" />
              <div
                ref={wheelRef}
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundImage: `conic-gradient(
                    ${segments.map((s, i) => `${s.color} ${i * (360 / segments.length)}deg ${((i + 1) * (360 / segments.length))}deg`).join(', ')}
                  )`,
                }}
              >
                {segments.map((s, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `rotate(${i * (360 / segments.length) + (360 / segments.length / 2)}deg) translate(0, -50%)`,
                      transformOrigin: "bottom center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    <span className="bangla-text" style={{ transform: `rotate(-${i * (360 / segments.length) + (360 / segments.length / 2)}deg)` }}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-red-600" />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg bangla-text"
              onClick={spinWheel}
              disabled={spinning}
            >
              {spinning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  স্পিন হচ্ছে...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-5 w-5" /> স্পিন করুন
                </>
              )}
            </Button>

            {result !== null && (
              <div className="mt-4 text-xl font-bold text-gray-800 bangla-text">
                {result > 0 ? `আপনি জিতেছেন: ৳${result}` : "দুঃখিত, পরের বার চেষ্টা করুন!"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Balance */}
        <Card className="w-full max-w-md bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg rounded-xl">
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
