"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, Loader2, Award, Clock, DollarSign, Calendar } from 'lucide-react'
import { dataFunctions, User, DailyTask, subscribeToUserUpdates } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"
import SoundButton from "@/app/components/sound-button"

interface TasksScreenProps {
  user: User | null // Allow user to be null initially
  onUserUpdate: (user: User) => void
}

export default function TasksScreen({ user, onUserUpdate }: TasksScreenProps) {
  const router = useRouter()
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [loadingInternal, setLoadingInternal] = useState(true) // Renamed for clarity
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    if (!user?.id) {
      setLoadingInternal(false) // No user ID, so nothing to load internally
      return
    }

    const fetchDailyTasks = async () => {
      setLoadingInternal(true)
      try {
        const tasks = await dataFunctions.getDailyTasks(user.id)
        setDailyTasks(tasks)
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "দৈনিক টাস্ক লোড করতে ব্যর্থ হয়েছে।" })
      } finally {
        setLoadingInternal(false)
      }
    }
    fetchDailyTasks()

    const channel = subscribeToUserUpdates(user.id, (payload) => {
      if (payload.new) {
        onUserUpdate(payload.new as User)
      }
    })
    return () => {
      channel.unsubscribe()
    }
  }, [user?.id, onUserUpdate])

  const handleCompleteTask = async (taskId: string) => {
    playSound("click")
    setLoadingInternal(true) // Use internal loading state
    setMessage(null)
    try {
      if (!user) { // Double check user existence
        throw new Error("ব্যবহারকারীর ডেটা উপলব্ধ নেই।")
      }
      const updatedUser = await dataFunctions.completeDailyTask(user.id, taskId)
      onUserUpdate(updatedUser)
      const updatedTasks = await dataFunctions.getDailyTasks(user.id)
      setDailyTasks(updatedTasks)
      setMessage({ type: "success", text: "টাস্ক সফলভাবে সম্পন্ন হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "টাস্ক সম্পন্ন করতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoadingInternal(false) // Use internal loading state
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Handle case where user prop is null or undefined
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-3 text-gray-600 bangla-text">ব্যবহারকারীর ডেটা লোড হচ্ছে...</p>
      </div>
    )
  }

  // Handle internal loading (fetching tasks for the current user)
  if (loadingInternal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-3 text-gray-600 bangla-text">টাস্ক লোড হচ্ছে...</p>
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
        <h1 className="text-xl font-bold bangla-text">টাস্ক</h1>
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

        {/* Daily Login Bonus */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 bangla-text">আজকের দৈনিক বোনাস</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                {/* This line was causing the error if user was undefined */}
                <span className="text-2xl font-bold bangla-text">৳{(user.daily_bonus_amount || 0).toFixed(2)}</span>
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 bangla-text"
              onClick={() => { playSound("click"); dataFunctions.claimDailyBonus(user.id).then(onUserUpdate).catch(err => setMessage({ type: "error", text: err.message || "বোনাস দাবি করতে ব্যর্থ হয়েছে।" })) }}
              disabled={user.last_daily_bonus_claim && new Date(user.last_daily_bonus_claim).toDateString() === new Date().toDateString()}
            >
              {user.last_daily_bonus_claim && new Date(user.last_daily_bonus_claim).toDateString() === new Date().toDateString() ? "দাবি করা হয়েছে" : "দাবি করুন"}
            </Button>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <h2 className="text-xl font-bold text-gray-800 bangla-text">দৈনিক টাস্ক</h2>
        {dailyTasks.length === 0 ? (
          <Card className="p-4 text-center text-gray-600 bangla-text">
            কোন দৈনিক টাস্ক উপলব্ধ নেই।
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyTasks.map((task) => (
              <Card key={task.id} className="bg-white shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-blue-600 bangla-text">{task.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700 bangla-text">{task.description}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm bangla-text">পুরস্কার: ৳{task.reward.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm bangla-text">সময়: {task.time_required_minutes} মিনিট</span>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 bangla-text"
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={task.completed || loadingInternal} // Use internal loading state
                  >
                    {loadingInternal ? ( // Use internal loading state
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : task.completed ? (
                      "সম্পন্ন হয়েছে"
                    ) : (
                      "সম্পন্ন করুন"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Link to Intern Tasks */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold bangla-text">ইন্টার্ন টাস্ক</h3>
                <p className="text-sm text-gray-600 bangla-text">বিশেষ টাস্ক সম্পন্ন করে অতিরিক্ত আয় করুন।</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { playSound("click"); router.push("/intern-tasks") }} className="bangla-text">
              দেখুন
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
