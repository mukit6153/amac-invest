"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import { ArrowLeft, CheckCircle, Clock, Award, Play, Users, Eye, Share2, Star, Gift, Target } from "lucide-react"
import { dataFunctions, actionFunctions, type User, type Task } from "../lib/database"

interface TasksScreenProps {
  user: User
  onBack: () => void
}

export default function TasksScreen({ user, onBack }: TasksScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const { sounds } = useSound()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const tasksData = await dataFunctions.getActiveTasks()
      setTasks(tasksData)

      // Load user's completed tasks
      const userTasks = await dataFunctions.getUserTasks(user.id)
      const completed = userTasks.filter((ut) => ut.status === "completed").map((ut) => ut.task_id)
      setCompletedTasks(completed)
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    if (completedTasks.includes(taskId)) return

    setLoading(taskId)
    try {
      const result = await actionFunctions.completeTask(user.id, taskId)
      if (result.success) {
        sounds.success()
        setCompletedTasks((prev) => [...prev, taskId])
        // Show success message
      } else {
        sounds.error()
      }
    } catch (error) {
      console.error("Task completion error:", error)
      sounds.error()
    } finally {
      setLoading(null)
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play
      case "referral":
        return Users
      case "social":
        return Share2
      case "survey":
        return Eye
      default:
        return CheckCircle
    }
  }

  const getTaskColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-500"
      case "referral":
        return "bg-purple-500"
      case "social":
        return "bg-blue-500"
      case "survey":
        return "bg-green-500"
      default:
        return "bg-orange-500"
    }
  }

  const dailyTasks = tasks.filter((t) => t.type === "daily")
  const videoTasks = tasks.filter((t) => t.type === "video")
  const socialTasks = tasks.filter((t) => t.type === "social")
  const referralTasks = tasks.filter((t) => t.type === "referral")

  const totalEarned = completedTasks.reduce((sum, taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    return sum + (task?.reward || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <SoundButton variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </SoundButton>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">দৈনিক টাস্ক</h1>
                <p className="text-xs text-gray-600">টাস্ক সম্পন্ন করে আয় করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Stats Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white border-0">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{completedTasks.length}</p>
                <p className="text-xs opacity-90">সম্পন্ন টাস্ক</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">৳{totalEarned}</p>
                <p className="text-xs opacity-90">মোট আয়</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{tasks.length - completedTasks.length}</p>
                <p className="text-xs opacity-90">বাকি টাস্ক</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        {dailyTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold bangla-text flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              দৈনিক টাস্ক
            </h2>
            {dailyTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id)
              const TaskIcon = getTaskIcon(task.type)

              return (
                <Card key={task.id} className={`${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-10 h-10 ${getTaskColor(task.type)} rounded-full flex items-center justify-center`}
                        >
                          <TaskIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{task.title_bn}</h3>
                          <p className="text-xs text-gray-600 mt-1">{task.description_bn}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />৳{task.reward}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.type === "daily"
                                ? "দৈনিক"
                                : task.type === "video"
                                  ? "ভিডিও"
                                  : task.type === "social"
                                    ? "সোশ্যাল"
                                    : task.type === "referral"
                                      ? "রেফারেল"
                                      : "সাধারণ"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2">
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">সম্পন্ন</span>
                          </div>
                        ) : (
                          <SoundButton
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={loading === task.id}
                            className="text-xs px-3"
                          >
                            {loading === task.id ? "..." : "শুরু করুন"}
                          </SoundButton>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Video Tasks */}
        {videoTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold bangla-text flex items-center gap-2">
              <Play className="h-5 w-5 text-red-500" />
              ভিডিও টাস্ক
            </h2>
            {videoTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id)

              return (
                <Card key={task.id} className={`${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                          <Play className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{task.title_bn}</h3>
                          <p className="text-xs text-gray-600 mt-1">{task.description_bn}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />৳{task.reward}
                            </Badge>
                            <Badge className="text-xs bg-red-100 text-red-800">ভিডিও দেখুন</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2">
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">সম্পন্ন</span>
                          </div>
                        ) : (
                          <SoundButton
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={loading === task.id}
                            className="text-xs px-3"
                          >
                            {loading === task.id ? "..." : "দেখুন"}
                          </SoundButton>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Social Tasks */}
        {socialTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold bangla-text flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              সোশ্যাল টাস্ক
            </h2>
            {socialTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id)

              return (
                <Card key={task.id} className={`${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Share2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{task.title_bn}</h3>
                          <p className="text-xs text-gray-600 mt-1">{task.description_bn}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />৳{task.reward}
                            </Badge>
                            <Badge className="text-xs bg-blue-100 text-blue-800">শেয়ার করুন</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2">
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">সম্পন্ন</span>
                          </div>
                        ) : (
                          <SoundButton
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={loading === task.id}
                            className="text-xs px-3"
                          >
                            {loading === task.id ? "..." : "শেয়ার"}
                          </SoundButton>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Referral Tasks */}
        {referralTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold bangla-text flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              রেফারেল টাস্ক
            </h2>
            {referralTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id)

              return (
                <Card key={task.id} className={`${isCompleted ? "bg-green-50 border-green-200" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{task.title_bn}</h3>
                          <p className="text-xs text-gray-600 mt-1">{task.description_bn}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />৳{task.reward}
                            </Badge>
                            <Badge className="text-xs bg-purple-100 text-purple-800">রেফার করুন</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2">
                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">সম্পন্ন</span>
                          </div>
                        ) : (
                          <SoundButton
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={loading === task.id}
                            className="text-xs px-3"
                          >
                            {loading === task.id ? "..." : "রেফার"}
                          </SoundButton>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Task Tips */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              টাস্ক টিপস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <Gift className="h-4 w-4 text-orange-500 mt-0.5" />
              <span className="text-sm text-gray-700">প্রতিদিন নতুন টাস্ক পাবেন</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span className="text-sm text-gray-700">সহজ টাস্ক দিয়ে শুরু করুন</span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-purple-500 mt-0.5" />
              <span className="text-sm text-gray-700">রেফারেল টাস্কে বেশি আয়</span>
            </div>
          </CardContent>
        </Card>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
