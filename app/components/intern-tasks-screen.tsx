"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Clock, DollarSign, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { dataFunctions, User, InternTask, subscribeToUserUpdates } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"

interface InternTasksScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function InternTasksScreen({ user, onUserUpdate }: InternTasksScreenProps) {
  const router = useRouter()
  const [internTasks, setInternTasks] = useState<InternTask[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  useEffect(() => {
    const fetchInternTasks = async () => {
      setLoading(true)
      setMessage(null)
      try {
        const tasks = await dataFunctions.getInternTasks(user.id)
        setInternTasks(tasks)
      } catch (err: any) {
        setMessage({ type: "error", text: err.message || "ইন্টার্ন টাস্ক লোড করতে ব্যর্থ হয়েছে।" })
      } finally {
        setLoading(false)
      }
    }
    fetchInternTasks()

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

  const handleCompleteTask = async (taskId: string) => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const updatedUser = await dataFunctions.completeInternTask(user.id, taskId)
      onUserUpdate(updatedUser)
      const updatedTasks = await dataFunctions.getInternTasks(user.id)
      setInternTasks(updatedTasks)
      setMessage({ type: "success", text: "ইন্টার্ন টাস্ক সফলভাবে সম্পন্ন হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "ইন্টার্ন টাস্ক সম্পন্ন করতে ব্যর্থ হয়েছে।" })
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
        <h1 className="text-xl font-bold bangla-text">ইন্টার্ন টাস্ক</h1>
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

        <h2 className="text-xl font-bold text-gray-800 bangla-text">আপনার ইন্টার্ন টাস্ক</h2>
        {internTasks.length === 0 ? (
          <Card className="p-4 text-center text-gray-600 bangla-text">
            কোন ইন্টার্ন টাস্ক উপলব্ধ নেই।
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internTasks.map((task) => (
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
                    disabled={task.completed || loading}
                  >
                    {loading ? (
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
      </main>
    </div>
  )
}
