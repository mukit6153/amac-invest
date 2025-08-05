"use client"

import { createClient } from "@supabase/supabase-js"

// Use environment variables or fallback values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types matching actual Supabase schema
export interface User {
  id: string
  name: string
  phone: string
  email: string
  balance: number
  invested: number
  earned: number
  referralCode: string
  joinDate: string
}

export interface Investment {
  id: string
  user_id: string
  package_id: string
  amount: number
  daily_return: number
  total_return: number
  days_completed: number
  total_days: number
  status: "active" | "completed" | "cancelled"
  next_payment: string
  created_at: string
  updated_at: string
  investment_packages?: InvestmentPackage
}

export interface InvestmentPackage {
  id: string
  name: string
  minAmount: number
  maxAmount: number
  dailyReturn: number
  duration: number
  totalReturn: number
  popular: boolean
}

export interface Transaction {
  id: string
  userId: string
  type: string
  amount: number
  description: string
  status: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  title_bn: string
  description: string
  description_bn: string
  type: "daily" | "video" | "survey" | "referral" | "social"
  reward: number
  requirement: string
  status: "active" | "inactive"
  icon: string
  color: string
  created_at: string
}

export interface UserTask {
  id: string
  user_id: string
  task_id: string
  status: "pending" | "completed" | "claimed"
  progress: number
  completed_at?: string
  claimed_at?: string
  created_at: string
  tasks?: Task
}

export interface SpinWheel {
  id: string
  user_id: string
  type: "daily" | "premium" | "mega"
  prize_amount: number
  prize_type: "cash" | "bonus" | "points"
  status: "completed"
  created_at: string
}

export interface Event {
  id: string
  title: string
  title_bn: string
  description: string
  description_bn: string
  type: "bonus" | "referral" | "task" | "investment"
  reward: string
  start_date: string
  end_date: string
  status: "upcoming" | "active" | "completed"
  participants: number
  max_participants?: number
  banner_image?: string
  created_at: string
}

export interface Gift {
  id: string
  title: string
  title_bn: string
  description: string
  description_bn: string
  type: "daily" | "premium" | "special"
  reward: number
  requirement: string
  status: "active" | "inactive"
  icon: string
  color: string
  created_at: string
}

export interface UserGift {
  id: string
  user_id: string
  gift_id: string
  status: "claimed"
  claimed_at: string
  gifts?: Gift
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  level: number
  commission_rate: number
  total_earned: number
  status: "active"
  created_at: string
  users?: User
}

export interface Banner {
  id: string
  title: string
  title_bn: string
  description: string
  description_bn: string
  image_url: string
  link_url?: string
  status: "active" | "inactive"
  order_index: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  title_bn: string
  message: string
  message_bn: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  name_bn: string
  description: string
  description_bn: string
  price: number
  image_url?: string
  category: string
  stock: number
  status: "active" | "inactive" | "out_of_stock"
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  quantity: number
  total_amount: number
  delivery_address: string
  phone: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  tracking_number?: string
  created_at: string
  updated_at: string
  products?: Product
}

export interface Withdrawal {
  id: string
  user_id: string
  amount: number
  method: string
  account_number: string
  account_name?: string
  status: "pending" | "processing" | "completed" | "rejected"
  admin_note?: string
  processed_at?: string
  created_at: string
  updated_at: string
}

// Mock data for development when database is not available
const mockBanners: Banner[] = [
  {
    id: "1",
    title: "Welcome to AMAC",
    title_bn: "AMAC এ স্বাগতম",
    description: "Start your investment journey today",
    description_bn: "আজই আপনার বিনিয়োগ যাত্রা শুরু করুন",
    image_url: "/placeholder.svg?height=160&width=400&text=Welcome",
    status: "active",
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "High Returns",
    title_bn: "উচ্চ রিটার্ন",
    description: "Get up to 15% daily returns",
    description_bn: "দৈনিক ১৫% পর্যন্ত রিটার্ন পান",
    image_url: "/placeholder.svg?height=160&width=400&text=High+Returns",
    status: "active",
    order_index: 2,
    created_at: new Date().toISOString(),
  },
]

const mockPackages: InvestmentPackage[] = [
  {
    id: "1",
    name: "স্টার্টার প্যাকেজ",
    minAmount: 500,
    maxAmount: 2000,
    dailyReturn: 3,
    duration: 30,
    totalReturn: 90,
    popular: false,
  },
  {
    id: "2",
    name: "প্রিমিয়াম প্যাকেজ",
    minAmount: 2000,
    maxAmount: 10000,
    dailyReturn: 4,
    duration: 30,
    totalReturn: 120,
    popular: true,
  },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Daily Check-in",
    title_bn: "দৈনিক চেক-ইন",
    description: "Check in daily to earn bonus",
    description_bn: "বোনাস পেতে প্রতিদিন চেক-ইন করুন",
    type: "daily",
    reward: 50,
    requirement: "Login daily",
    status: "active",
    icon: "📅",
    color: "green",
    created_at: new Date().toISOString(),
  },
]

const mockEvents: Event[] = [
  {
    id: "1",
    title: "New Year Bonus",
    title_bn: "নববর্ষ বোনাস",
    description: "Special bonus for new year",
    description_bn: "নববর্ষের জন্য বিশেষ বোনাস",
    type: "bonus",
    reward: "500 Taka Bonus",
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    participants: 150,
    max_participants: 500,
    created_at: new Date().toISOString(),
  },
]

const mockGifts: Gift[] = [
  {
    id: "1",
    title: "Daily Gift",
    title_bn: "দৈনিক গিফট",
    description: "Claim your daily gift",
    description_bn: "আপনার দৈনিক গিফট দাবি করুন",
    type: "daily",
    reward: 25,
    requirement: "Login daily",
    status: "active",
    icon: "🎁",
    color: "red",
    created_at: new Date().toISOString(),
  },
]

const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    name_bn: "আইফোন ১৫ প্রো",
    description: "Latest iPhone with advanced features",
    description_bn: "উন্নত ফিচারসহ সর্বশেষ আইফোন",
    price: 120000,
    category: "Electronics",
    stock: 10,
    status: "active",
    image_url: "/placeholder.svg?height=300&width=300&text=iPhone+15+Pro",
    created_at: new Date().toISOString(),
  },
]

// Authentication Functions
export async function signUp(userData: {
  name: string
  phone: string
  email: string
  password: string
  referralCode?: string
}) {
  try {
    // Generate referral code
    const referralCode = `AMC${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          password_hash: userData.password, // In production, hash this properly
          referral_code: referralCode,
          balance: 0,
          invested: 0,
          earned: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Signup error:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      user: {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        balance: data.balance || 0,
        invested: data.invested || 0,
        earned: data.earned || 0,
        referralCode: data.referral_code,
        joinDate: data.created_at,
      },
    }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "Registration failed" }
  }
}

export async function signIn(phone: string, password: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .eq("password_hash", password) // In production, compare hashed passwords
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid credentials" }
    }

    return {
      success: true,
      user: {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        balance: data.balance || 0,
        invested: data.invested || 0,
        earned: data.earned || 0,
        referralCode: data.referral_code,
        joinDate: data.created_at,
      },
    }
  } catch (error) {
    console.error("Signin error:", error)
    return { success: false, error: "Login failed" }
  }
}

// Real-time Functions
export function subscribeToUserUpdates(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel("user-updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=eq.${userId}`,
      },
      callback,
    )
    .subscribe()
}

export function subscribeToTransactions(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel("user-transactions")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "transactions",
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe()
}

export function subscribeToNotifications(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel("user-notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe()
}

// Data Functions with fallback to mock data
export async function getInvestmentPackages(): Promise<InvestmentPackage[]> {
  try {
    const { data, error } = await supabase
      .from("investment_packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) throw error

    return data.map((pkg) => ({
      id: pkg.id,
      name: pkg.name_bn || pkg.name,
      minAmount: pkg.min_amount,
      maxAmount: pkg.max_amount,
      dailyReturn: pkg.daily_return,
      duration: pkg.duration,
      totalReturn: pkg.total_return,
      popular: pkg.is_popular,
    }))
  } catch (error) {
    console.error("Error fetching packages:", error)
    return mockPackages
  }
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) throw error

    return data.map((tx) => ({
      id: tx.id,
      userId: tx.user_id,
      type: tx.type,
      amount: tx.amount,
      description: tx.description_bn || tx.description,
      status: tx.status,
      createdAt: tx.created_at,
    }))
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return [
      {
        id: "1",
        userId: userId,
        type: "investment",
        amount: -1000,
        description: "প্রিমিয়াম প্যাকেজে বিনিয়োগ",
        status: "completed",
        createdAt: new Date().toISOString(),
      },
    ]
  }
}

export async function getBanners() {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) throw error

    return data.map((banner) => ({
      id: banner.id,
      title: banner.title_bn || banner.title,
      subtitle: banner.subtitle_bn || banner.subtitle,
      image: banner.image_url,
      color: banner.color_scheme,
    }))
  } catch (error) {
    console.error("Error fetching banners:", error)
    return [
      {
        id: 1,
        title: "বিশেষ বোনাস অফার!",
        subtitle: "৫০% পর্যন্ত বোনাস পান",
        image: "/placeholder.svg?height=120&width=300&text=Special+Bonus",
        color: "from-purple-500 to-pink-500",
      },
    ]
  }
}

export async function getNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) throw error

    return data.map((notification) => ({
      id: notification.id,
      title: notification.title_bn || notification.title,
      message: notification.message_bn || notification.message,
      type: notification.type,
      isRead: notification.is_read,
      createdAt: notification.created_at,
    }))
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

export async function getActiveTasks() {
  try {
    const { data, error } = await supabase.from("tasks").select("*").eq("status", "active")

    if (error) {
      console.warn("Error fetching active tasks, using mock data:", error)
      return mockTasks
    }
    return data || mockTasks
  } catch (error) {
    console.warn("Error fetching active tasks, using mock data:", error)
    return mockTasks
  }
}

export async function getUserTasks(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_tasks")
      .select(`
        *,
        tasks (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching user tasks:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.warn("Error fetching user tasks:", error)
    return []
  }
}

export async function getActiveEvents() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching active events, using mock data:", error)
      return mockEvents
    }
    return data || mockEvents
  } catch (error) {
    console.warn("Error fetching active events, using mock data:", error)
    return mockEvents
  }
}

export async function getActiveGifts() {
  try {
    const { data, error } = await supabase.from("gifts").select("*").eq("status", "active")

    if (error) {
      console.warn("Error fetching active gifts, using mock data:", error)
      return mockGifts
    }
    return data || mockGifts
  } catch (error) {
    console.warn("Error fetching active gifts, using mock data:", error)
    return mockGifts
  }
}

export async function getUserNotifications(userId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.warn("Error fetching user notifications:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.warn("Error fetching user notifications:", error)
    return []
  }
}

export async function getUserReferrals(userId: string) {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select(`
        *,
        users!referrals_referred_id_fkey(name, phone, created_at, total_invested)
      `)
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching user referrals:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.warn("Error fetching user referrals:", error)
    return []
  }
}

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching products, using mock data:", error)
      return mockProducts
    }
    return data || mockProducts
  } catch (error) {
    console.warn("Error fetching products, using mock data:", error)
    return mockProducts
  }
}

export async function getUserOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        products (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching user orders:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.warn("Error fetching user orders:", error)
    return []
  }
}

export async function getUserWithdrawals(userId: string) {
  try {
    const { data, error } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Error fetching user withdrawals:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.warn("Error fetching user withdrawals:", error)
    return []
  }
}

export default supabase
