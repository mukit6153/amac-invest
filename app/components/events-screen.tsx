"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Trophy, Star, Zap, Crown, ArrowRight } from "lucide-react"

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState("current")

  const currentEvents = [
    {
      id: 1,
      title: "মেগা বোনাস উইকেন্ড",
      titleBn: "মেগা বোনাস উইকেন্ড",
      description: "এই উইকেন্ডে সব বিনিয়োগে ৫০% অতিরিক্ত বোনাস পান",
      startDate: "২৫ ডিসেম্বর",
      endDate: "২৭ ডিসেম্বর",
      reward: "৫০% বোনাস",
      participants: 1250,
      image: "🎉",
      color: "from-purple-500 to-pink-500",
      status: "চলমান",
    },
    {
      id: 2,
      title: "রেফারেল চ্যালেঞ্জ",
      titleBn: "রেফারেল চ্যালেঞ্জ",
      description: "৫ জন বন্ধুকে রেফার করুন এবং ১০০০ টাকা বোনাস জিতুন",
      startDate: "২০ ডিসেম্বর",
      endDate: "৩১ ডিসেম্বর",
      reward: "১০০০ টাকা",
      participants: 850,
      image: "👥",
      color: "from-blue-500 to-cyan-500",
      status: "চলমান",
    },
    {
      id: 3,
      title: "ডেইলি টাস্ক মাস্টার",
      titleBn: "ডেইলি টাস্ক মাস্টার",
      description: "৭ দিন টানা সব টাস্ক সম্পন্ন করুন এবং বিশেষ পুরস্কার পান",
      startDate: "১৫ ডিসেম্বর",
      endDate: "২৮ ডিসেম্বর",
      reward: "৫০০ টাকা + গিফট",
      participants: 2100,
      image: "✅",
      color: "from-green-500 to-emerald-500",
      status: "চলমান",
    },
  ]

  const upcomingEvents = [
    {
      id: 4,
      title: "নববর্ষ মহোৎসব",
      titleBn: "নববর্ষ মহোৎসব",
      description: "নতুন বছরে বিশেষ বিনিয়োগ প্যাকেজ এবং বোনাস",
      startDate: "১ জানুয়ারি",
      endDate: "৭ জানুয়ারি",
      reward: "১০০% বোনাস",
      image: "🎊",
      color: "from-yellow-500 to-orange-500",
      status: "শীঘ্রই",
    },
    {
      id: 5,
      title: "ভালোবাসা দিবস স্পেশাল",
      titleBn: "ভালোবাসা দিবস স্পেশাল",
      description: "প্রিয়জনদের সাথে বিনিয়োগ করুন এবং ডাবল রিওয়ার্ড পান",
      startDate: "১০ ফেব্রুয়ারি",
      endDate: "১৮ ফেব্রুয়ারি",
      reward: "ডাবল রিওয়ার্ড",
      image: "💝",
      color: "from-pink-500 to-red-500",
      status: "শীঘ্রই",
    },
  ]

  const completedEvents = [
    {
      id: 6,
      title: "উইন্টার বোনাস",
      titleBn: "উইন্টার বোনাস",
      description: "শীতকালীন বিশেষ বোনাস ইভেন্ট",
      startDate: "১ ডিসেম্বর",
      endDate: "১৫ ডিসেম্বর",
      reward: "৩০% বোনাস",
      participants: 3500,
      image: "❄️",
      color: "from-blue-400 to-blue-600",
      status: "সম্পন্ন",
      winners: 1200,
    },
  ]

  const renderEventCard = (event: any) => (
    <Card
      key={event.id}
      className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <div className={`h-2 bg-gradient-to-r ${event.color}`}></div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}
            >
              {event.image}
            </div>
            <div>
              <CardTitle className="text-lg bangla-text">{event.titleBn}</CardTitle>
              <Badge
                variant={event.status === "চলমান" ? "default" : event.status === "শীঘ্রই" ? "secondary" : "outline"}
                className={`mt-1 ${
                  event.status === "চলমান"
                    ? "bg-green-100 text-green-800"
                    : event.status === "শীঘ্রই"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold bg-gradient-to-r ${event.color} bg-clip-text text-transparent`}>
              {event.reward}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm bangla-text">{event.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="bangla-text">
              {event.startDate} - {event.endDate}
            </span>
          </div>
          {event.participants && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{event.participants.toLocaleString()} জন</span>
            </div>
          )}
        </div>

        {event.status === "চলমান" && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 bangla-text">এখনই অংশগ্রহণ করুন</span>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 bangla-text">
                যোগ দিন
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {event.status === "সম্পন্ন" && event.winners && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-gray-700 bangla-text">{event.winners} জন বিজয়ী</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold bangla-text mb-2">ইভেন্ট সমূহ</h1>
        <p className="text-gray-600 bangla-text">বিশেষ ইভেন্টে অংশগ্রহণ করুন এবং পুরস্কার জিতুন</p>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{currentEvents.length}</div>
            <p className="text-xs text-blue-700 bangla-text">চলমান ইভেন্ট</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600">4.2K</div>
            <p className="text-xs text-green-700 bangla-text">অংশগ্রহণকারী</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">৳50K</div>
            <p className="text-xs text-yellow-700 bangla-text">মোট পুরস্কার</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
        {[
          { id: "current", label: "চলমান", count: currentEvents.length },
          { id: "upcoming", label: "আসছে", count: upcomingEvents.length },
          { id: "completed", label: "সম্পন্ন", count: completedEvents.length },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 bangla-text ${activeTab === tab.id ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
          >
            {tab.label}
            <Badge variant="secondary" className="ml-2">
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Event Content */}
      <div className="space-y-4">
        {activeTab === "current" && (
          <>
            {/* Featured Event */}
            <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-0 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-2">ফিচার্ড ইভেন্ট</Badge>
                    <h3 className="text-xl font-bold bangla-text">মেগা বোনাস উইকেন্ড</h3>
                  </div>
                </div>
                <p className="text-white/90 mb-4 bangla-text">এই উইকেন্ডে সব বিনিয়োগে ৫০% অতিরিক্ত বোনাস পান</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">৫০%</div>
                      <div className="text-xs opacity-80">বোনাস</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">1.2K</div>
                      <div className="text-xs opacity-80">অংশগ্রহণকারী</div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 bangla-text"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    যোগ দিন
                  </Button>
                </div>
              </CardContent>
            </Card>

            {currentEvents.map(renderEventCard)}
          </>
        )}

        {activeTab === "upcoming" && upcomingEvents.map(renderEventCard)}
        {activeTab === "completed" && completedEvents.map(renderEventCard)}
      </div>

      {/* Event Rules */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bangla-text">
            <Star className="h-5 w-5 text-blue-600" />
            ইভেন্ট নিয়মাবলী
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm bangla-text">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span>প্রতিটি ইভেন্টে অংশগ্রহণের জন্য নিবন্ধিত ব্যবহারকারী হতে হবে</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span>ইভেন্টের শর্তাবলী পূরণ করতে হবে</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span>পুরস্কার ইভেন্ট শেষে ২৪ ঘন্টার মধ্যে প্রদান করা হবে</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <span>একাধিক অ্যাকাউন্ট ব্যবহার করা নিষিদ্ধ</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
