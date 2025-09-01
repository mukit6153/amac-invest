"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Gift, DollarSign, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useSound } from "@/app/hooks/use-sound"
import { User, subscribeToUserUpdates, dataFunctions } from "@/app/lib/database"

interface Event {
  id: string
  title: string
  description: string
  reward: number
  isActive: boolean
  isClaimed: boolean
}

interface EventsScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function EventsScreen({ user, onUserUpdate }: EventsScreenProps) {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setMessage(null)
      try {
        // Simulate fetching events from a database
        const fetchedEvents: Event[] = [
          { id: "event-1", title: "ঈদ বোনাস ইভেন্ট", description: "ঈদের বিশেষ বোনাস দাবি করুন!", reward: 200, isActive: true, isClaimed: false },
          { id: "event-2", title: "পূজা অফার", description: "পূজা উপলক্ষে বিশেষ উপহার!", reward: 150, isActive: true, isClaimed: false },
          { id: "event-3", title: "বার্ষিকী উদযাপন", description: "আমাদের বার্ষিকীতে যোগ দিন এবং পুরস্কার পান।", reward: 300, isActive: false, isClaimed: false },
        ]
        // Simulate checking if user has claimed these events
        // In a real app, this would involve user-specific data from Supabase
        const userClaimedEvents = localStorage.getItem(`claimedEvents_${user.id}`)
          ? JSON.parse(localStorage.getItem(`claimedEvents_${user.id}`) || "[]")
          : []

        const updatedEvents = fetchedEvents.map(event => ({
          ...event,
          isClaimed: userClaimedEvents.includes(event.id)
        }))

        setEvents(updatedEvents)
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "ইভেন্ট লোড করতে ব্যর্থ হয়েছে।" })
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()

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

  const handleClaimReward = async (eventId: string, reward: number) => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      // Simulate claiming reward and updating user balance
      // In a real app, this would be a server-side function call
      const { data, error } = await dataFunctions.supabase.from('users').update({ balance: user.balance + reward }).eq('id', user.id)

      if (error) throw error

      onUserUpdate({ ...user, balance: user.balance + reward })

      // Mark event as claimed for the user
      const userClaimedEvents = localStorage.getItem(`claimedEvents_${user.id}`)
        ? JSON.parse(localStorage.getItem(`claimedEvents_${user.id}`) || "[]")
        : []
      userClaimedEvents.push(eventId)
      localStorage.setItem(`claimedEvents_${user.id}`, JSON.stringify(userClaimedEvents))

      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, isClaimed: true } : event
        )
      )
      setMessage({ type: "success", text: `আপনি ৳${reward} বোনাস দাবি করেছেন!` })
      playSound("bonus")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "পুরস্কার দাবি করতে ব্যর্থ হয়েছে।" })
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
        <h1 className="text-xl font-bold bangla-text">ইভেন্টস</h1>
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
              <DollarSign className="h-6 w-6" />
              <span className="text-lg font-semibold bangla-text">আপনার ব্যালেন্স</span>
            </div>
            <span className="text-3xl font-bold bangla-text">৳{user.balance.toFixed(2)}</span>
          </CardContent>
        </Card>

        {/* Active Events */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">সক্রিয় ইভেন্টস</h2>
        {events.filter(e => e.isActive).length === 0 ? (
          <Card className="p-4 text-center text-gray-600 bangla-text">
            কোন সক্রিয় ইভেন্ট উপলব্ধ নেই।
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(e => e.isActive).map((event) => (
              <Card key={event.id} className="bg-white shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-blue-600 bangla-text">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700 bangla-text">{event.description}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Gift className="h-4 w-4" />
                    <span className="text-sm bangla-text">পুরস্কার: ৳{event.reward.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 bangla-text"
                    onClick={() => handleClaimReward(event.id, event.reward)}
                    disabled={event.isClaimed || loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : event.isClaimed ? (
                      "দাবি করা হয়েছে"
                    ) : (
                      "পুরস্কার দাবি করুন"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Past Events */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">পুরানো ইভেন্টস</h2>
        {events.filter(e => !e.isActive).length === 0 ? (
          <Card className="p-4 text-center text-gray-600 bangla-text">
            কোন পুরানো ইভেন্ট উপলব্ধ নেই।
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(e => !e.isActive).map((event) => (
              <Card key={event.id} className="bg-gray-100 shadow-md rounded-lg border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-600 bangla-text">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-500 bangla-text">{event.description}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Gift className="h-4 w-4" />
                    <span className="text-sm bangla-text">পুরস্কার: ৳{event.reward.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full bg-gray-300 text-gray-700 cursor-not-allowed bangla-text"
                    disabled
                  >
                    ইভেন্ট শেষ
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
