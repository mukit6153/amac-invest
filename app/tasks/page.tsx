"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, CheckCircle, Clock, Gift, Users, MousePointer, FileText, Flame } from "lucide-react"

export default function TasksPage() {
  const [activeCategory, setActiveCategory] = useState("daily")

  const taskCategories = [
    { id: "daily", label: "দৈনিক কাজ", icon: CheckCircle },
    { id: "video", label: "ভিডিও দেখুন", icon: Play },
    { id: "survey", label: "সার্ভে", icon: FileText },
    { id: "ads", label: "বিজ্ঞাপন", icon: MousePointer },
    { id: "referral", label: "রেফার", icon: Users },
  ]

  const dailyTasks = [
    {
      id: 1,
      title: "দৈনিক লগইন",
      titleEn: "Daily Login",
      description: "প্রতিদিন অ্যাপে লগইন করুন",
      reward: 25,
      progress: 100,
      completed: true,
      icon: CheckCircle,
    },
    {
      id: 2,
      title: "প্রোফাইল আপডেট",
      titleEn: "Update Profile",
      description: "আপনার প্রোফাইল সম্পূর্ণ করুন",
      reward: 50,
      progress: 75,
      completed: false,
      icon: Users,
    },
    {
      id: 3,
      title: "বন্ধুদের আমন্ত্রণ",
      titleEn: "Invite Friends",
      description: "৩ জন বন্ধুকে আমন্ত্রণ জানান",
      reward: 100,
      progress: 33,
      completed: false,
      icon: Users,
    },
  ]

  const videoTasks = [
    {
      id: 1,
      title: "বিনিয়োগ টিপস ভিডিও",
      description: "৫ মিনিটের ভিডিও দেখুন",
      reward: 15,
      duration: "5:00",
      completed: false,
    },
    {
      id: 2,
      title: "ক্রিপ্টো শিক্ষা",
      description: "৩ মিনিটের শিক্ষামূলক ভিডিও",
      reward: 10,
      duration: "3:00",
      completed: true,
    },
  ]

  const renderDailyTasks = () => (
    <div className="space-y-4">
      {/* Streak Bonus */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8" />
              <div>
                <h3 className="font-bold">৩ দিনের স্ট্রিক!</h3>
                <p className="text-sm opacity-90">পরবর্তী বোনাস: ৳১০০</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              🔥 ৩ দিন
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Daily Task Limit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>আজকের কাজের সীমা</span>
            <Badge variant="outline">৫/১০</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={50} className="mb-2" />
          <p className="text-sm text-gray-600">আরও ৫টি কাজ বাকি</p>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {dailyTasks.map((task) => (
          <Card key={task.id} className={task.completed ? "bg-green-50 border-green-200" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    task.completed ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  <task.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={task.progress} className="flex-1 h-2" />
                    <span className="text-xs text-gray-500">{task.progress}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+৳{task.reward}</p>
                  {task.completed ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      সম্পন্ন
                    </Badge>
                  ) : (
                    <Button size="sm" className="mt-1">
                      শুরু করুন
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderVideoTasks = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>ভিডিও দেখে আয় করুন</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">শিক্ষামূলক ভিডিও দেখুন এবং টাকা আয় করুন</p>
          <div className="space-y-3">
            {videoTasks.map((task) => (
              <Card key={task.id} className={task.completed ? "bg-green-50" : "border-2 border-dashed"}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-red-600 rounded flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{task.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+৳{task.reward}</p>
                      {task.completed ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          দেখা হয়েছে
                        </Badge>
                      ) : (
                        <Button size="sm" className="mt-1 bg-red-600 hover:bg-red-700">
                          <Play className="h-4 w-4 mr-1" />
                          দেখুন
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-center">কাজের কেন্দ্র</h1>
        <p className="text-sm text-gray-600 text-center">কাজ করুন এবং আয় করুন</p>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto p-2 gap-2">
          {taskCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="whitespace-nowrap"
            >
              <category.icon className="h-4 w-4 mr-1" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeCategory === "daily" && renderDailyTasks()}
        {activeCategory === "video" && renderVideoTasks()}

        {/* Placeholder for other categories */}
        {!["daily", "video"].includes(activeCategory) && (
          <Card>
            <CardContent className="p-8 text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">শীঘ্রই আসছে</h3>
              <p className="text-gray-600">এই বিভাগের কাজগুলি শীঘ্রই যোগ করা হবে</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
