"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Target,
  Award,
  Users,
  Video,
  FileText,
  Share2,
  Calendar,
  Gift,
  Star,
} from "lucide-react"
import { SoundButton } from "./sound-button"
import { useSound } from "../hooks/use-sound"
import { dataFunctions, actionFunctions, type Task, type UserTask } from "../lib/database"

interface TasksScreenProps {
  user: any
  onBack: () => void
}

export default function TasksScreen({ user, onBack }: TasksScreenProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [userTasks, setUserTasks] = useState<UserTask[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"available" | "completed">("available")

  const { sounds } = useSound()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const [tasksData, userTasksData] = await Promise.all([
        dataFunctions.getActiveTasks(),
        dataFunctions.getUserTasks(user.id),
      ])
      setTasks(tasksData)
      setUserTasks(userTasksData)
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    setLoading(taskId)
    try {
      const result = await actionFunctions.completeTask(user.id, taskId)
      if (result.success) {
        sounds.success()
        alert(`টাস্ক সম্পন্ন! আপনি ৳${result.reward} পুরস্কার পেয়েছেন!`)
        loadTasks()
      } else {
        sounds.error()
        alert(result.error || "টাস্ক সম্পন্ন করতে সমস্যা হয়েছে")
      }
    } catch (error) {
      sounds.error()
      alert("টাস্ক সম্পন্ন করতে সমস্যা হয়েছে")
    } finally {
      setLoading(null)
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "daily":
        return Calendar
      case "video":
        return Video
      case "survey":
        return FileText
      case "referral":
        return Users
      case "social":
        return Share2
      default:
        return Target
    }
  }

  const getTaskTypeText = (type: string) => {
    switch (type) {
      case "daily":
        return "দৈনিক"
      case "video":
        return "ভিডিও"
      case "survey":
        return "সার্ভে"
      case "referral":
        return "রেফারেল"
      case "social":
        return "সোশ্যাল"
      default:
        return "সাধারণ"
    }
  }

  const isTaskCompleted = (taskId: string) => {
    return userTasks.some((ut) => ut.task_id === taskId && ut.status === "completed")
  }

  const availableTasks = tasks.filter((task) => !isTaskCompleted(task.id))
  const completedTasks = userTasks.filter((ut) => ut.status === "completed")

  const totalEarned = completedTasks.reduce((sum, ut) => {
    const task = tasks.find((t) => t.id === ut.task_id)
    return sum + (task?.reward || 0)
  }, 0)

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
                <h1 className="font-bold text-gray-800 text-lg">টাস্ক সেন্টার</h1>
                <p className="text-xs text-gray-600">টাস্ক করে পুরস্কার জিতুন</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">৳{totalEarned.toLocaleString()}</p>
              <p className="text-xs text-gray-500">মোট আয়</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <Target className="h-6 w-6 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{availableTasks.length}</div>
              <p className="text-xs opacity-80">উপলব্ধ</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{completedTasks.length}</div>
              <p className="text-xs opacity-80">সম্পন্ন</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <Award className="h-6 w-6 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">৳{totalEarned}</div>
              <p className="text-xs opacity-80">আয়</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <SoundButton
            variant={activeTab === "available" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("available")}
          >
            উপলব্ধ ({availableTasks.length})
          </SoundButton>
          <SoundButton
            variant={activeTab === "completed" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("completed")}
          >
            সম্পন্ন ({completedTasks.length})
          </SoundButton>
        </div>

        {/* Available Tasks Tab */}
        {activeTab === "available" && (
          <div className="space-y-3">
            {availableTasks.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">কোন উপলব্ধ টাস্ক নেই</p>
                  <p className="text-xs text-gray-500 mt-1">নতুন টাস্কের জন্য অপেক্ষা করুন</p>
                </CardContent>
              </Card>
            ) : (
              availableTasks.map((task) => {
                const TaskIcon = getTaskIcon(task.type)
                return (
                  <Card key={task.id} className="bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <TaskIcon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base mb-1">{task.title_bn}</h3>
                            <p className="text-sm text-gray-600 mb-2">{task.description_bn}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getTaskTypeText(task.type)}
                              </Badge>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                ৳{task.reward}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-600 mb-1">প্রয়োজনীয়তা:</p>
                        <p className="text-sm font-medium">{task.requirement}</p>
                      </div>

                      <SoundButton
                        className="w-full"
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={loading === task.id}
                      >
                        {loading === task.id ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 animate-spin" />
                            প্রক্রিয়াকরণ...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            টাস্ক সম্পন্ন করুন
                          </div>
                        )}
                      </SoundButton>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}

        {/* Completed Tasks Tab */}
        {activeTab === "completed" && (
          <div className="space-y-3">
            {completedTasks.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">কোন সম্পন্ন টাস্ক নেই</p>
                  <SoundButton variant="outline" size="sm" className="mt-3" onClick={() => setActiveTab("available")}>
                    টাস্ক করুন
                  </SoundButton>
                </CardContent>
              </Card>
            ) : (
              completedTasks.map((userTask) => {
                const task = tasks.find((t) => t.id === userTask.task_id)
                if (!task) return null

                const TaskIcon = getTaskIcon(task.type)
                return (
                  <Card key={userTask.id} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <TaskIcon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base mb-1">{task.title_bn}</h3>
                            <p className="text-sm text-gray-600 mb-2">{task.description_bn}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getTaskTypeText(task.type)}
                              </Badge>
                              <Badge className="text-xs bg-green-600">
                                <Award className="h-3 w-3 mr-1" />৳{task.reward} পেয়েছেন
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">সম্পন্ন হয়েছে:</span>
                          <span className="font-medium">
                            {userTask.completed_at && new Date(userTask.completed_at).toLocaleDateString("bn-BD")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}

        {/* Daily Tasks Reminder */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">দৈনিক টাস্ক</h3>
                <p className="text-sm opacity-90">প্রতিদিন নতুন টাস্ক পান এবং পুরস্কার জিতুন!</p>
              </div>
              <Star className="h-8 w-8 opacity-60" />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}
