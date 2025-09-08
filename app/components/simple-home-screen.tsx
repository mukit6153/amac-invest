"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, TrendingUp, User, Gift, Wallet } from "lucide-react"

interface SimpleHomeScreenProps {
  user: any
  onLogout: () => void
}

export default function SimpleHomeScreen({ user, onLogout }: SimpleHomeScreenProps) {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">AMAC Investment</h1>
          <Button onClick={onLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Balance</p>
                <p className="text-2xl font-bold">৳{user?.balance?.toLocaleString() || "0"}</p>
              </div>
              <Wallet className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent">
            <Gift className="h-6 w-6" />
            <span className="text-xs">Daily Gift</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">Invest</span>
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-3 gap-1 p-2">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            className="flex-col py-2"
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant={activeTab === "invest" ? "default" : "ghost"}
            className="flex-col py-2"
            onClick={() => setActiveTab("invest")}
          >
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs">Invest</span>
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            className="flex-col py-2"
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
