"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)

  const handleLogin = () => {
    setUser({ name: "Demo User", balance: 5000 })
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">AMAC Investment</h1>
            <p className="text-gray-600 mb-6">Welcome to your investment platform</p>
            <Button onClick={handleLogin} className="w-full">
              Demo Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">AMAC Investment</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
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
                <p className="text-2xl font-bold">৳{user.balance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-8">
          <h2 className="text-lg font-semibold mb-2">Welcome, {user.name}!</h2>
          <p className="text-gray-600">Your investment journey starts here.</p>
        </div>
      </div>
    </div>
  )
}
