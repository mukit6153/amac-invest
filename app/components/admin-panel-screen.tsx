"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Users, Package, DollarSign, Plus, Edit, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react"
import {
  dataFunctions,
  type User,
  type InvestmentPackage,
  type Product,
  type DailyTask,
  type InternTask,
  subscribeToUserUpdates,
  supabase,
  adminFunctions,
} from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"

// Mock Admin User ID (replace with actual admin check in a real app)
const ADMIN_USER_ID = "admin_user_id_123" // This should be securely managed

interface AdminPanelScreenProps {
  user: User
  onUserUpdate: (user: User) => void
}

export default function AdminPanelScreen({ user, onUserUpdate }: AdminPanelScreenProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users") // 'users', 'packages', 'products', 'tasks'
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()

  // Data states
  const [users, setUsers] = useState<User[]>([])
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [dailyTaskDefinitions, setDailyTaskDefinitions] = useState<DailyTask[]>([])
  const [internTaskDefinitions, setInternTaskDefinitions] = useState<InternTask[]>([])

  // Form states for adding/editing
  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    price: 0,
    daily_return_percentage: 0,
    duration_days: 0,
  })
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, image_url: "", stock: 0 })
  const [newDailyTask, setNewDailyTask] = useState({ name: "", description: "", reward: 0, time_required_minutes: 0 })
  const [newInternTask, setNewInternTask] = useState({ name: "", description: "", reward: 0, time_required_minutes: 0 })

  // Admin role state
  const [adminRole, setAdminRole] = useState<{ isAdmin: boolean; role?: string; permissions?: any }>({ isAdmin: false })

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

  useEffect(() => {
    const checkAdminAccess = async () => {
      const roleCheck = await adminFunctions.checkAdminRole(user.id)
      setAdminRole(roleCheck)

      if (!roleCheck.isAdmin) {
        router.replace("/")
        return
      }

      fetchData()
    }

    checkAdminAccess()
  }, [activeTab, user.id, router])

  const fetchData = async () => {
    setLoading(true)
    setMessage(null)
    try {
      if (activeTab === "users") {
        const { data, error } = await supabase.from("users").select("*")
        if (error) throw error
        setUsers(data as User[])
      } else if (activeTab === "packages") {
        const data = await dataFunctions.getInvestmentPackages()
        setPackages(data)
      } else if (activeTab === "products") {
        const data = await dataFunctions.getProducts()
        setProducts(data)
      } else if (activeTab === "tasks") {
        const { data: daily, error: dailyError } = await supabase.from("daily_tasks").select("*")
        if (dailyError) throw dailyError
        setDailyTaskDefinitions(daily as DailyTask[])

        const { data: intern, error: internError } = await supabase.from("intern_tasks").select("*")
        if (internError) throw internError
        setInternTaskDefinitions(intern as InternTask[])
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "ডেটা লোড করতে ব্যর্থ হয়েছে।" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase.from("investment_packages").insert(newPackage).select().single()
      if (error) throw error
      setPackages([...packages, data as InvestmentPackage])
      setNewPackage({ name: "", description: "", price: 0, daily_return_percentage: 0, duration_days: 0 })
      setMessage({ type: "success", text: "প্যাকেজ সফলভাবে যোগ করা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "প্যাকেজ যোগ করতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeletePackage = async (id: string) => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.from("investment_packages").delete().eq("id", id)
      if (error) throw error
      setPackages(packages.filter((pkg) => pkg.id !== id))
      setMessage({ type: "success", text: "প্যাকেজ সফলভাবে মুছে ফেলা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "প্যাকেজ মুছে ফেলতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase.from("products").insert(newProduct).select().single()
      if (error) throw error
      setProducts([...products, data as Product])
      setNewProduct({ name: "", description: "", price: 0, image_url: "", stock: 0 })
      setMessage({ type: "success", text: "পণ্য সফলভাবে যোগ করা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "পণ্য যোগ করতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
      setProducts(products.filter((prod) => prod.id !== id))
      setMessage({ type: "success", text: "পণ্য সফলভাবে মুছে ফেলা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "পণ্য মুছে ফেলতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleAddDailyTask = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase.from("daily_tasks").insert(newDailyTask).select().single()
      if (error) throw error
      setDailyTaskDefinitions([...dailyTaskDefinitions, data as DailyTask])
      setNewDailyTask({ name: "", description: "", reward: 0, time_required_minutes: 0 })
      setMessage({ type: "success", text: "দৈনিক টাস্ক সফলভাবে যোগ করা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "দৈনিক টাস্ক যোগ করতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteDailyTask = async (id: string) => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.from("daily_tasks").delete().eq("id", id)
      if (error) throw error
      setDailyTaskDefinitions(dailyTaskDefinitions.filter((task) => task.id !== id))
      setMessage({ type: "success", text: "দৈনিক টাস্ক সফলভাবে মুছে ফেলা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "দৈনিক টাস্ক মুছে ফেলতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleAddInternTask = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase.from("intern_tasks").insert(newInternTask).select().single()
      if (error) throw error
      setInternTaskDefinitions([...internTaskDefinitions, data as InternTask])
      setNewInternTask({ name: "", description: "", reward: 0, time_required_minutes: 0 })
      setMessage({ type: "success", text: "ইন্টার্ন টাস্ক সফলভাবে যোগ করা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "ইন্টার্ন টাস্ক যোগ করতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteInternTask = async (id: string) => {
    playSound("click")
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.from("intern_tasks").delete().eq("id", id)
      if (error) throw error
      setInternTaskDefinitions(internTaskDefinitions.filter((task) => task.id !== id))
      setMessage({ type: "success", text: "ইন্টার্ন টাস্ক সফলভাবে মুছে ফেলা হয়েছে!" })
      playSound("success")
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "ইন্টার্ন টাস্ক মুছে ফেলতে ব্যর্থ হয়েছে।" })
      playSound("error")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (!adminRole.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4 text-center">
        <XCircle className="h-16 w-16 text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-red-800 bangla-text">অ্যাক্সেস ডিনাইড</h1>
        <p className="text-gray-700 mt-2 bangla-text">আপনার এই পৃষ্ঠাটি দেখার অনুমতি নেই।</p>
        <Button
          className="mt-6 bg-red-600 hover:bg-red-700 bangla-text"
          onClick={() => {
            playSound("click")
            router.back()
          }}
        >
          ফিরে যান
        </Button>
      </div>
    )
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            playSound("click")
            router.back()
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-bold bangla-text">অ্যাডমিন প্যানেল</h1>
          <p className="text-sm text-gray-600 bangla-text">
            {adminRole.role === "super_admin" ? "সুপার অ্যাডমিন" : "অ্যাডমিন"} - {user.name}
          </p>
        </div>
        <div className="w-5 h-5" />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 overflow-auto">
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span className="text-sm bangla-text">{message.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b pb-2">
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => {
              playSound("click")
              setActiveTab("users")
              fetchData()
            }}
            className="bangla-text"
          >
            <Users className="mr-2 h-4 w-4" /> ব্যবহারকারী
          </Button>
          <Button
            variant={activeTab === "packages" ? "default" : "outline"}
            onClick={() => {
              playSound("click")
              setActiveTab("packages")
              fetchData()
            }}
            className="bangla-text"
          >
            <Package className="mr-2 h-4 w-4" /> প্যাকেজ
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => {
              playSound("click")
              setActiveTab("products")
              fetchData()
            }}
            className="bangla-text"
          >
            <DollarSign className="mr-2 h-4 w-4" /> পণ্য
          </Button>
          <Button
            variant={activeTab === "tasks" ? "default" : "outline"}
            onClick={() => {
              playSound("click")
              setActiveTab("tasks")
              fetchData()
            }}
            className="bangla-text"
          >
            <Edit className="mr-2 h-4 w-4" /> টাস্ক
          </Button>
        </div>

        {activeTab === "users" && (
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold bangla-text">ব্যবহারকারী ব্যবস্থাপনা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                        নাম
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                        ইমেইল
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                        ব্যালেন্স
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                        লেভেল
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                        অ্যাকশন
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                          ৳{u.balance.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">{u.level}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              playSound("click")
                              alert("ব্যবহারকারী মুছে ফেলার কার্যকারিতা এখানে যোগ করুন")
                            }}
                            className="bangla-text"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "packages" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">নতুন প্যাকেজ যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPackage} className="space-y-4">
                  <div>
                    <Label htmlFor="packageName" className="bangla-text">
                      প্যাকেজের নাম
                    </Label>
                    <Input
                      id="packageName"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageDesc" className="bangla-text">
                      বর্ণনা
                    </Label>
                    <Textarea
                      id="packageDesc"
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="packagePrice" className="bangla-text">
                      মূল্য
                    </Label>
                    <Input
                      id="packagePrice"
                      type="number"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({ ...newPackage, price: Number.parseFloat(e.target.value) })}
                      required
                      step="0.01"
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageReturn" className="bangla-text">
                      দৈনিক রিটার্ন (%)
                    </Label>
                    <Input
                      id="packageReturn"
                      type="number"
                      value={newPackage.daily_return_percentage}
                      onChange={(e) =>
                        setNewPackage({ ...newPackage, daily_return_percentage: Number.parseFloat(e.target.value) })
                      }
                      required
                      step="0.1"
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageDuration" className="bangla-text">
                      মেয়াদ (দিন)
                    </Label>
                    <Input
                      id="packageDuration"
                      type="number"
                      value={newPackage.duration_days}
                      onChange={(e) => setNewPackage({ ...newPackage, duration_days: Number.parseInt(e.target.value) })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" /> প্যাকেজ যোগ করুন
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">বিদ্যমান প্যাকেজ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          নাম
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          মূল্য
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          রিটার্ন (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          মেয়াদ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {packages.map((pkg) => (
                        <tr key={pkg.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">
                            {pkg.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            ৳{pkg.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            {pkg.daily_return_percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            {pkg.duration_days} দিন
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="bangla-text"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">নতুন পণ্য যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="productName" className="bangla-text">
                      পণ্যের নাম
                    </Label>
                    <Input
                      id="productName"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productDesc" className="bangla-text">
                      বর্ণনা
                    </Label>
                    <Textarea
                      id="productDesc"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productPrice" className="bangla-text">
                      মূল্য (ব্যালেন্স)
                    </Label>
                    <Input
                      id="productPrice"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                      required
                      step="0.01"
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productImage" className="bangla-text">
                      ছবির URL
                    </Label>
                    <Input
                      id="productImage"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productStock" className="bangla-text">
                      স্টক
                    </Label>
                    <Input
                      id="productStock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" /> পণ্য যোগ করুন
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">বিদ্যমান পণ্য</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          নাম
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          মূল্য
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          স্টক
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((prod) => (
                        <tr key={prod.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">
                            {prod.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            ৳{prod.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            {prod.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="bangla-text"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">নতুন দৈনিক টাস্ক যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDailyTask} className="space-y-4">
                  <div>
                    <Label htmlFor="dailyTaskName" className="bangla-text">
                      টাস্কের নাম
                    </Label>
                    <Input
                      id="dailyTaskName"
                      value={newDailyTask.name}
                      onChange={(e) => setNewDailyTask({ ...newDailyTask, name: e.target.value })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyTaskDesc" className="bangla-text">
                      বর্ণনা
                    </Label>
                    <Textarea
                      id="dailyTaskDesc"
                      value={newDailyTask.description}
                      onChange={(e) => setNewDailyTask({ ...newDailyTask, description: e.target.value })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyTaskReward" className="bangla-text">
                      পুরস্কার
                    </Label>
                    <Input
                      id="dailyTaskReward"
                      type="number"
                      value={newDailyTask.reward}
                      onChange={(e) => setNewDailyTask({ ...newDailyTask, reward: Number.parseFloat(e.target.value) })}
                      required
                      step="0.01"
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyTaskTime" className="bangla-text">
                      সময় (মিনিট)
                    </Label>
                    <Input
                      id="dailyTaskTime"
                      type="number"
                      value={newDailyTask.time_required_minutes}
                      onChange={(e) =>
                        setNewDailyTask({ ...newDailyTask, time_required_minutes: Number.parseInt(e.target.value) })
                      }
                      required
                      className="bangla-text"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" /> দৈনিক টাস্ক যোগ করুন
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">বিদ্যমান দৈনিক টাস্ক</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          নাম
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          পুরস্কার
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          সময়
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dailyTaskDefinitions.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">
                            {task.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            ৳{task.reward.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            {task.time_required_minutes} মিনিট
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteDailyTask(task.id)}
                              className="bangla-text"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">নতুন ইন্টার্ন টাস্ক যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddInternTask} className="space-y-4">
                  <div>
                    <Label htmlFor="internTaskName" className="bangla-text">
                      টাস্কের নাম
                    </Label>
                    <Input
                      id="internTaskName"
                      value={newInternTask.name}
                      onChange={(e) => setNewInternTask({ ...newInternTask, name: e.target.value })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="internTaskDesc" className="bangla-text">
                      বর্ণনা
                    </Label>
                    <Textarea
                      id="internTaskDesc"
                      value={newInternTask.description}
                      onChange={(e) => setNewInternTask({ ...newInternTask, description: e.target.value })}
                      required
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="internTaskReward" className="bangla-text">
                      পুরস্কার
                    </Label>
                    <Input
                      id="internTaskReward"
                      type="number"
                      value={newInternTask.reward}
                      onChange={(e) =>
                        setNewInternTask({ ...newInternTask, reward: Number.parseFloat(e.target.value) })
                      }
                      required
                      step="0.01"
                      className="bangla-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="internTaskTime" className="bangla-text">
                      সময় (মিনিট)
                    </Label>
                    <Input
                      id="internTaskTime"
                      type="number"
                      value={newInternTask.time_required_minutes}
                      onChange={(e) =>
                        setNewInternTask({ ...newInternTask, time_required_minutes: Number.parseInt(e.target.value) })
                      }
                      required
                      className="bangla-text"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" /> ইন্টার্ন টাস্ক যোগ করুন
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">বিদ্যমান ইন্টার্ন টাস্ক</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          নাম
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          পুরস্কার
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          সময়
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {internTaskDefinitions.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">
                            {task.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            ৳{task.reward.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">
                            {task.time_required_minutes} মিনিট
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteInternTask(task.id)}
                              className="bangla-text"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
