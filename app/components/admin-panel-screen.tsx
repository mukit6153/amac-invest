"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Users, Package, DollarSign, Plus, Edit, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { dataFunctions, User, InvestmentPackage, Product, DailyTask, InternTask, UserInvestment, Transaction, subscribeToUserUpdates, supabase } from "@/app/lib/database"
import { useSound } from "@/app/hooks/use-sound"
import { useHaptic } from "@/app/hooks/use-haptic"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAllUsersAction, getAllInvestmentsAction, getAllTransactionsAction, updateInvestmentStatusAction, deleteUserAction } from '@/app/lib/server-actions' // Import Server Actions

// Mock Admin User ID (replace with actual admin check in a real app)
const ADMIN_USER_ID = "admin_user_id_123" // This should be securely managed

interface AdminPanelScreenProps {
  user: User
}

export default function AdminPanelScreen({ user }: AdminPanelScreenProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("users") // 'users', 'packages', 'products', 'tasks'
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { playSound } = useSound()
  const { vibrate } = useHaptic()

  // Data states
  const [users, setUsers] = useState<User[]>([])
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [dailyTaskDefinitions, setDailyTaskDefinitions] = useState<DailyTask[]>([])
  const [internTaskDefinitions, setInternTaskDefinitions] = useState<InternTask[]>([])
  const [investments, setInvestments] = useState<UserInvestment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Form states for adding/editing
  const [newPackage, setNewPackage] = useState({ name: "", description: "", price: 0, daily_return_percentage: 0, duration_days: 0 })
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, image_url: "", stock: 0 })
  const [newDailyTask, setNewDailyTask] = useState({ name: "", description: "", reward: 0, time_required_minutes: 0 })
  const [newInternTask, setNewInternTask] = useState({ name: "", description: "", reward: 0, time_required_minutes: 0 })

  useEffect(() => {
    if (user?.id) {
      const channel = subscribeToUserUpdates(user.id, (payload) => {
        if (payload.new) {
          // Handle user update
        }
      })
      return () => {
        channel.unsubscribe()
      }
    }
  }, [user?.id])

  useEffect(() => {
    // In a real app, this check would be more robust (e.g., checking user roles from DB)
    if (!user.is_admin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have administrative privileges.',
        variant: 'destructive',
      })
      router.replace("/") // Redirect non-admins
      return
    }
    fetchData()
  }, [activeTab, user.is_admin, router])

  const fetchData = async () => {
    setLoading(true)
    setMessage(null)
    try {
      if (activeTab === "users") {
        const { data, error } = await supabase.from('users').select('*')
        if (error) throw error
        setUsers(data as User[])
      } else if (activeTab === "packages") {
        const data = await dataFunctions.getInvestmentPackages()
        setPackages(data)
      } else if (activeTab === "products") {
        const data = await dataFunctions.getProducts()
        setProducts(data)
      } else if (activeTab === "tasks") {
        const { data: daily, error: dailyError } = await supabase.from('daily_tasks').select('*')
        if (dailyError) throw dailyError
        setDailyTaskDefinitions(daily as DailyTask[])

        const { data: intern, error: internError } = await supabase.from('intern_tasks').select('*')
        if (internError) throw internError
        setInternTaskDefinitions(intern as InternTask[])
      } else if (activeTab === "investments") {
        const data = await getAllInvestmentsAction()
        setInvestments(data)
      } else if (activeTab === "transactions") {
        const data = await getAllTransactionsAction()
        setTransactions(data)
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "ডেটা লোড করতে ব্যর্থ হয়েছে।" })
      toast({
        title: 'Error',
        description: err.message || 'Failed to load admin data.',
        variant: 'destructive',
      })
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
      const { data, error } = await supabase.from('investment_packages').insert(newPackage).select().single()
      if (error) throw error
      setPackages([...packages, data as InvestmentPackage])
      setNewPackage({ name: "", description: "", price: 0, daily_return_percentage: 0, duration_days: 0 })
      setMessage({ type: "success", text: "প্যাকেজ সফলভাবে যোগ করা হয়েছে!" })
      playSound("success")
      toast({
        title: 'Success',
        description: 'Package added successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "প্যাকেজ যোগ করতে ব্যর্থ হয়েছে।" })
      playSound("error")
      toast({
        title: 'Error',
        description: err.message || 'Failed to add package.',
        variant: 'destructive',
      })
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
      const { error } = await supabase.from('investment_packages').delete().eq('id', id)
      if (error) throw error
      setPackages(packages.filter(pkg => pkg.id !== id))
      setMessage({ type: "success", text: "প্যাকেজ সফলভাবে মুছে ফেলা হয়েছে!" })
      playSound("success")
      toast({
        title: 'Success',
        description: 'Package deleted successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "প্যাকেজ মুছে ফেলতে ব্যর্থ হয়েছে।" })
      playSound("error")
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete package.',
        variant: 'destructive',
      })
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
      const { data, error } = await supabase.from('products').insert(newProduct).select().single()
      if (error) throw error
      setProducts([...products, data as Product])
      setNewProduct({ name: "", description: "", price: 0, image_url: "", stock: 0 })
      setMessage({ type: "success", text: "পণ্য সফলভাবে যোগ করা হয়েছে!" })
      playSound("success")
      toast({
        title: 'Success',
        description: 'Product added successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "পণ্য যোগ করতে ব্যর্থ হয়েছে।" })
      playSound("error")
      toast({
        title: 'Error',
        description: err.message || 'Failed to add product.',
        variant: 'destructive',
      })
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
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProducts(products.filter(prod => prod.id !== id))
      setMessage({ type: "success", text: "পণ্য সফলভাবে মুছে ফেলা হয়েছে!" })
      playSound("success")
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "পণ্য মুছে ফেলতে ব্যর্থ হয়েছে।" })
      playSound("error")
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete product.',
        variant: 'destructive',
      })
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
      const { data, error } = await supabase.from('daily_tasks').insert(newDailyTask).select().single()
      if (error) throw error
      setDailyTaskDefinitions([...dailyTaskDefinitions, data as DailyTask])
      setNewDailyTask({ name: "", description: "", reward: 0, time_required_minutes: 0 })
      setMessage({ type: "success", text: "দৈনিক টাস্ক সফলভাবে যোগ করা হয়েছে!" })
      playSound("success")
      toast({
        title: 'Success',
        description: 'Daily task added successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "দৈনিক টাস্ক যোগ করতে ব্যর্থ হয়েছে।" })
      playSound("error")
      toast({
        title: 'Error',
        description: err.message || 'Failed to add daily task.',
        variant: 'destructive',
      })
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
      const { error } = await supabase.from('daily_tasks').delete().eq('id', id)
      if (error) throw error
      setDailyTaskDefinitions(dailyTaskDefinitions.filter(task => task.id !== id))
      setMessage({ type: "success", text: "দৈনিক টাস্ক সফলভাবে মুছে ফেলা হয়েছে!" })
      playSound("success")
      toast({
        title: 'Success',
        description: 'Daily task deleted successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "দৈনিক টাস্ক মুছে ফেলতে ব্যর্থ হয়েছে।" })
      playSound("error")
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete daily task.',
        variant: 'destructive',
      })
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
      const { data, error } = await supabase.from('intern_tasks').insert(newInternTask).select().single()
      if (error) throw error
      setInternTaskDefinitions([...internTaskDefinitions, data as InternTask])
      setNewInternTask({ name: "", description: "", reward: 0, time_required_minutes: 0 })
      setMessage({ type: "success", text: "ইন্টার্ন টাস্ক সফলভাবে যোগ করা হয়েছে!" })
      playSound("success")
      toast({
        title: 'Success',
        description: 'Intern task added successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "ইন্টার্ন টাস্ক যোগ করতে ব্যর্থ হয়েছে।" })
      playSound("error")
      toast({
        title: 'Error',
        description: err.message || 'Failed to add intern task.',
        variant: 'destructive',
      })
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
      const { error } = await supabase.from('intern_tasks').delete().eq('id', id)
      if (error) throw error
      setInternTaskDefinitions(internTaskDefinitions.filter(task => task.id !== id))
      setMessage({ type: "success", text: "ইন্টার্ন টাস্ক সফলভাবে মুছে ফেলা হয়েছে!" })
      playSound("success")
      toast({
        title: 'Success',
        description: 'Intern task deleted successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "ইন্টার্ন টাস্ক মুছে ফেলতে ব্যর্থ হয়েছে।" })
      playSound("error")
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete intern task.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleUpdateInvestmentStatus = async (investmentId: number, newStatus: 'active' | 'completed' | 'cancelled') => {
    vibrate('medium')
    setLoading(true)
    try {
      await updateInvestmentStatusAction(investmentId, newStatus)
      const updatedInvestments = await getAllInvestmentsAction()
      setInvestments(updatedInvestments)
      playSound('success')
      toast({
        title: 'Success',
        description: 'Investment status updated.',
        variant: 'default',
      })
    } catch (error: any) {
      console.error('Failed to update investment status:', error)
      playSound('error')
      toast({
        title: 'Error',
        description: error.message || 'Failed to update investment status.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userIdToDelete: string) => {
    vibrate('heavy')
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    setLoading(true)
    try {
      await deleteUserAction(userIdToDelete)
      const updatedUsers = await getAllUsersAction()
      setUsers(updatedUsers)
      playSound('success')
      toast({
        title: 'Success',
        description: 'User deleted successfully.',
        variant: 'default',
      })
    } catch (error: any) {
      console.error('Failed to delete user:', error)
      playSound('error')
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user.is_admin) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-lg font-semibold">
        Access Denied: Admin privileges required.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading admin data...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50">Admin Panel</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">Manage users, investments, and transactions.</p>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" onClick={() => { setActiveTab("users"); fetchData() }}>Users</TabsTrigger>
          <TabsTrigger value="packages" onClick={() => { setActiveTab("packages"); fetchData() }}>Packages</TabsTrigger>
          <TabsTrigger value="products" onClick={() => { setActiveTab("products"); fetchData() }}>Products</TabsTrigger>
          <TabsTrigger value="tasks" onClick={() => { setActiveTab("tasks"); fetchData() }}>Tasks</TabsTrigger>
          <TabsTrigger value="investments" onClick={() => { setActiveTab("investments"); fetchData() }}>Investments</TabsTrigger>
          <TabsTrigger value="transactions" onClick={() => { setActiveTab("transactions"); fetchData() }}>Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Referral Code</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>${u.wallet_balance.toFixed(2)}</TableCell>
                        <TableCell>{u.referral_code}</TableCell>
                        <TableCell>{u.is_admin ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={loading || u.is_admin} // Prevent deleting admin user
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <div className="space-y-6">
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">নতুন প্যাকেজ যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPackage} className="space-y-4">
                  <div>
                    <Label htmlFor="packageName" className="bangla-text">প্যাকেজের নাম</Label>
                    <Input id="packageName" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} required className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="packageDesc" className="bangla-text">বর্ণনা</Label>
                    <Textarea id="packageDesc" value={newPackage.description} onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })} required className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="packagePrice" className="bangla-text">মূল্য</Label>
                    <Input id="packagePrice" type="number" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) })} required step="0.01" className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="packageReturn" className="bangla-text">দৈনিক রিটার্ন (%)</Label>
                    <Input id="packageReturn" type="number" value={newPackage.daily_return_percentage} onChange={(e) => setNewPackage({ ...newPackage, daily_return_percentage: parseFloat(e.target.value) })} required step="0.1" className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="packageDuration" className="bangla-text">মেয়াদ (দিন)</Label>
                    <Input id="packageDuration" type="number" value={newPackage.duration_days} onChange={(e) => setNewPackage({ ...newPackage, duration_days: parseInt(e.target.value) })} required className="bangla-text" />
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">নাম</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">মূল্য</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">রিটার্ন (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">মেয়াদ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {packages.map((pkg) => (
                        <tr key={pkg.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">{pkg.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">৳{pkg.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">{pkg.daily_return_percentage}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">{pkg.duration_days} দিন</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="destructive" size="sm" onClick={() => handleDeletePackage(pkg.id)} className="bangla-text">
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
        </TabsContent>

        <TabsContent value="products">
          <div className="space-y-6">
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">নতুন পণ্য যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="productName" className="bangla-text">পণ্যের নাম</Label>
                    <Input id="productName" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="productDesc" className="bangla-text">বর্ণনা</Label>
                    <Textarea id="productDesc" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="productPrice" className="bangla-text">মূল্য (ব্যালেন্স)</Label>
                    <Input id="productPrice" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} required step="0.01" className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="productImage" className="bangla-text">ছবির URL</Label>
                    <Input id="productImage" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="productStock" className="bangla-text">স্টক</Label>
                    <Input id="productStock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} required className="bangla-text" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 bangla-text" disabled={loading}>
                    <Plus className="mr-2 h-4" /> পণ্য যোগ করুন
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">নাম</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">মূল্য</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">স্টক</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((prod) => (
                        <tr key={prod.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">{prod.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">৳{prod.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">{prod.stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(prod.id)} className="bangla-text">
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
        </TabsContent>

        <TabsContent value="tasks">
          <div className="space-y-6">
            <Card className="bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold bangla-text">নতুন দৈনিক টাস্ক যোগ করুন</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDailyTask} className="space-y-4">
                  <div>
                    <Label htmlFor="dailyTaskName" className="bangla-text">টাস্কের নাম</Label>
                    <Input id="dailyTaskName" value={newDailyTask.name} onChange={(e) => setNewDailyTask({ ...newDailyTask, name: e.target.value })} required className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="dailyTaskDesc" className="bangla-text">বর্ণনা</Label>
                    <Textarea id="dailyTaskDesc" value={newDailyTask.description} onChange={(e) => setNewDailyTask({ ...newDailyTask, description: e.target.value })} required className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="dailyTaskReward" className="bangla-text">পুরস্কার</Label>
                    <Input id="dailyTaskReward" type="number" value={newDailyTask.reward} onChange={(e) => setNewDailyTask({ ...newDailyTask, reward: parseFloat(e.target.value) })} required step="0.01" className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="dailyTaskTime" className="bangla-text">সময় (মিনিট)</Label>
                    <Input id="dailyTaskTime" type="number" value={newDailyTask.time_required_minutes} onChange={(e) => setNewDailyTask({ ...newDailyTask, time_required_minutes: parseInt(e.target.value) })} required className="bangla-text" />
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">নাম</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">পুরস্কার</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">সময়</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dailyTaskDefinitions.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">{task.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">৳{task.reward.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">{task.time_required_minutes} মিনিট</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteDailyTask(task.id)} className="bangla-text">
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
                    <Label htmlFor="internTaskName" className="bangla-text">টাস্কের নাম</Label>
                    <Input id="internTaskName" value={newInternTask.name} onChange={(e) => setNewInternTask({ ...newInternTask, name: e.target.value })} required className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="internTaskDesc" className="bangla-text">বর্ণনা</Label>
                    <Textarea id="internTaskDesc" value={newInternTask.description} onChange={(e) => setNewInternTask({ ...newInternTask, description: e.target.value })} required className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="internTaskReward" className="bangla-text">পুরস্কার</Label>
                    <Input id="internTaskReward" type="number" value={newInternTask.reward} onChange={(e) => setNewInternTask({ ...newInternTask, reward: parseFloat(e.target.value) })} required step="0.01" className="bangla-text" />
                  </div>
                  <div>
                    <Label htmlFor="internTaskTime" className="bangla-text">সময় (মিনিট)</Label>
                    <Input id="internTaskTime" type="number" value={newInternTask.time_required_minutes} onChange={(e) => setNewInternTask({ ...newInternTask, time_required_minutes: parseInt(e.target.value) })} required className="bangla-text" />
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">নাম</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">পুরস্কার</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">সময়</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bangla-text">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {internTaskDefinitions.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bangla-text">{task.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">৳{task.reward.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bangla-text">{task.time_required_minutes} মিনিট</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteInternTask(task.id)} className="bangla-text">
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
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>All Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Email</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>{(inv as any).users?.email || 'N/A'}</TableCell>
                        <TableCell>{(inv as any).investment_packages?.name || inv.package_name || 'N/A'}</TableCell>
                        <TableCell>${inv.invested_amount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(inv.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(inv.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select
                            value={inv.status}
                            onValueChange={(value: 'active' | 'completed' | 'cancelled') =>
                              handleUpdateInvestmentStatus(inv.id, value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {/* Add more actions here if needed */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{(tx as any).users?.email || 'N/A'}</TableCell>
                        <TableCell>{tx.type}</TableCell>
                        <TableCell>${tx.amount.toFixed(2)}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>{new Date(tx.date).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
