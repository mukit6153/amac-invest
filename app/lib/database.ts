"use client"

import { createClient } from "@supabase/supabase-js"

// Use fallback values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  phone: string
  name: string
  email?: string
  wallet_pin: string
  password: string
  balance: number
  bonus_balance: number
  locked_balance: number
  total_invested: number
  total_earned: number
  referral_code: string
  referred_by?: string
  login_streak: number
  last_login: string
  kyc_status: "pending" | "approved" | "rejected"
  status: "active" | "suspended" | "banned"
  role: "user" | "admin"
  avatar?: string
  created_at: string
  updated_at: string
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
  name_bn: string
  min_amount: number
  max_amount: number
  daily_rate: number
  total_days: number
  total_return_rate: number
  status: "active" | "inactive"
  icon: string
  color: string
  features: string[]
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: "deposit" | "withdraw" | "investment" | "return" | "bonus" | "referral"
  amount: number
  status: "pending" | "completed" | "failed" | "cancelled"
  method?: string
  account_number?: string
  description: string
  reference?: string
  created_at: string
  updated_at: string
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

// Mock data for development when database is not available
const mockBanners: Banner[] = [
  {
    id: "1",
    title: "Welcome to AMAC",
    title_bn: "AMAC এ স্বাগতম",
    description: "Start your investment journey today",
    description_bn: "আজই আপনার বিনিয়োগ যাত্রা শুরু করুন",
    image_url: "/placeholder.svg?height=160&width=400",
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
    image_url: "/placeholder.svg?height=160&width=400",
    status: "active",
    order_index: 2,
    created_at: new Date().toISOString(),
  },
]

const mockPackages: InvestmentPackage[] = [
  {
    id: "1",
    name: "Starter",
    name_bn: "স্টার্টার",
    min_amount: 1000,
    max_amount: 10000,
    daily_rate: 5,
    total_days: 30,
    total_return_rate: 150,
    status: "active",
    icon: "🚀",
    color: "blue",
    features: ["5% daily return", "30 days plan", "Instant withdrawal"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Premium",
    name_bn: "প্রিমিয়াম",
    min_amount: 10000,
    max_amount: 50000,
    daily_rate: 8,
    total_days: 25,
    total_return_rate: 200,
    status: "active",
    icon: "💎",
    color: "purple",
    features: ["8% daily return", "25 days plan", "Priority support"],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "VIP",
    name_bn: "ভিআইপি",
    min_amount: 50000,
    max_amount: 200000,
    daily_rate: 12,
    total_days: 20,
    total_return_rate: 240,
    status: "active",
    icon: "👑",
    color: "gold",
    features: ["12% daily return", "20 days plan", "VIP support"],
    created_at: new Date().toISOString(),
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
  {
    id: "2",
    title: "Refer Friends",
    title_bn: "বন্ধুদের রেফার করুন",
    description: "Refer 3 friends to earn bonus",
    description_bn: "বোনাস পেতে ৩ জন বন্ধুকে রেফার করুন",
    type: "referral",
    reward: 200,
    requirement: "Refer 3 friends",
    status: "active",
    icon: "👥",
    color: "blue",
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

// Authentication Functions
export const authFunctions = {
  async signUp(userData: {
    phone: string
    name: string
    password: string
    walletPin: string
    referralCode?: string
  }) {
    try {
      // Generate unique referral code
      const referralCode = `AJ${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Check if phone already exists
      const { data: existingUser } = await supabase.from("users").select("id").eq("phone", userData.phone).single()

      if (existingUser) {
        throw new Error("এই ফোন নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে")
      }

      // Find referrer if referral code provided
      let referrerId = null
      if (userData.referralCode) {
        const { data: referrer } = await supabase
          .from("users")
          .select("id")
          .eq("referral_code", userData.referralCode)
          .single()

        if (referrer) {
          referrerId = referrer.id
        }
      }

      // Create user
      const { data: newUser, error } = await supabase
        .from("users")
        .insert([
          {
            phone: userData.phone,
            name: userData.name,
            password: userData.password,
            wallet_pin: userData.walletPin,
            referral_code: referralCode,
            referred_by: referrerId,
            balance: 0,
            bonus_balance: referrerId ? 100 : 50, // Signup bonus
            locked_balance: 0,
            total_invested: 0,
            total_earned: 0,
            login_streak: 1,
            last_login: new Date().toISOString(),
            kyc_status: "pending",
            status: "active",
            role: "user",
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Give referral bonus to referrer
      if (referrerId) {
        await supabase.rpc("add_referral_bonus", {
          referrer_id: referrerId,
          referred_id: newUser.id,
          bonus_amount: 200,
        })

        // Create referral record
        await supabase.from("referrals").insert([
          {
            referrer_id: referrerId,
            referred_id: newUser.id,
            level: 1,
            commission_rate: 10,
            total_earned: 0,
            status: "active",
          },
        ])
      }

      // Create welcome notification
      await supabase.from("notifications").insert([
        {
          user_id: newUser.id,
          title: "Welcome to AMAC",
          title_bn: "AMAC এ স্বাগতম",
          message: "Your account has been created successfully!",
          message_bn: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
          type: "success",
          read: false,
        },
      ])

      return { user: newUser, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  },

  async signIn(phone: string, password: string) {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .eq("password", password)
        .single()

      if (error || !user) {
        throw new Error("ভুল ফোন নম্বর বা পাসওয়ার্ড")
      }

      if (user.status !== "active") {
        throw new Error("আপনার অ্যাকাউন্ট নিষিদ্ধ করা হয়েছে")
      }

      // Update last login and login streak
      const today = new Date().toDateString()
      const lastLogin = new Date(user.last_login).toDateString()
      const isConsecutiveDay = new Date(today).getTime() - new Date(lastLogin).getTime() === 86400000

      const newStreak = lastLogin === today ? user.login_streak : isConsecutiveDay ? user.login_streak + 1 : 1

      // Daily login bonus
      let dailyBonus = 0
      if (lastLogin !== today) {
        dailyBonus = Math.min(20 + newStreak * 5, 100) // Max 100 taka daily bonus
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          last_login: new Date().toISOString(),
          login_streak: newStreak,
          bonus_balance: user.bonus_balance + dailyBonus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (updateError) throw updateError

      // Create daily bonus transaction
      if (dailyBonus > 0) {
        await supabase.from("transactions").insert([
          {
            user_id: user.id,
            type: "bonus",
            amount: dailyBonus,
            status: "completed",
            description: `দৈনিক লগইন বোনাস - ${newStreak} দিনের স্ট্রিক`,
          },
        ])

        // Create notification
        await supabase.from("notifications").insert([
          {
            user_id: user.id,
            title: "Daily Login Bonus",
            title_bn: "দৈনিক লগইন বোনাস",
            message: `You received ৳${dailyBonus} login bonus!`,
            message_bn: `আপনি ৳${dailyBonus} লগইন বোনাস পেয়েছেন!`,
            type: "success",
            read: false,
          },
        ])
      }

      return { user: updatedUser, dailyBonus, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  },

  async getCurrentUser(userId: string) {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
      if (error) throw error
      return data
    } catch (error) {
      console.warn("Error fetching current user:", error)
      return null
    }
  },
}

// Real-time Functions
export const realtimeFunctions = {
  subscribeToUserUpdates(userId: string, callback: (user: User) => void) {
    try {
      return supabase
        .channel(`user-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
            filter: `id=eq.${userId}`,
          },
          (payload) => callback(payload.new as User),
        )
        .subscribe()
    } catch (error) {
      console.warn("Error subscribing to user updates:", error)
      return { unsubscribe: () => {} }
    }
  },

  subscribeToTransactions(userId: string, callback: (transaction: Transaction) => void) {
    try {
      return supabase
        .channel(`transactions-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "transactions",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => callback(payload.new as Transaction),
        )
        .subscribe()
    } catch (error) {
      console.warn("Error subscribing to transactions:", error)
      return { unsubscribe: () => {} }
    }
  },

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    try {
      return supabase
        .channel(`notifications-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => callback(payload.new as Notification),
        )
        .subscribe()
    } catch (error) {
      console.warn("Error subscribing to notifications:", error)
      return { unsubscribe: () => {} }
    }
  },

  subscribeToInvestments(userId: string, callback: (investment: Investment) => void) {
    try {
      return supabase
        .channel(`investments-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "investments",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => callback(payload.new as Investment),
        )
        .subscribe()
    } catch (error) {
      console.warn("Error subscribing to investments:", error)
      return { unsubscribe: () => {} }
    }
  },
}

// Data Functions with fallback to mock data
export const dataFunctions = {
  async getBanners() {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("status", "active")
        .order("order_index", { ascending: true })

      if (error) {
        console.warn("Using mock banners data")
        return mockBanners
      }
      return data || mockBanners
    } catch (error) {
      console.warn("Error fetching banners, using mock data:", error)
      return mockBanners
    }
  },

  async getInvestmentPackages() {
    try {
      const { data, error } = await supabase
        .from("investment_packages")
        .select("*")
        .eq("status", "active")
        .order("min_amount", { ascending: true })

      if (error) {
        console.warn("Using mock packages data")
        return mockPackages
      }
      return data || mockPackages
    } catch (error) {
      console.warn("Error fetching investment packages, using mock data:", error)
      return mockPackages
    }
  },

  async getUserInvestments(userId: string) {
    try {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          investment_packages (*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Using empty investments data")
        return []
      }
      return data || []
    } catch (error) {
      console.warn("Error fetching user investments:", error)
      return []
    }
  },

  async getUserTransactions(userId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        console.warn("Using empty transactions data")
        return []
      }
      return data || []
    } catch (error) {
      console.warn("Error fetching user transactions:", error)
      return []
    }
  },

  async getActiveTasks() {
    try {
      const { data, error } = await supabase.from("tasks").select("*").eq("status", "active")

      if (error) {
        console.warn("Using mock tasks data")
        return mockTasks
      }
      return data || mockTasks
    } catch (error) {
      console.warn("Error fetching active tasks, using mock data:", error)
      return mockTasks
    }
  },

  async getUserTasks(userId: string) {
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
        console.warn("Using empty user tasks data")
        return []
      }
      return data || []
    } catch (error) {
      console.warn("Error fetching user tasks:", error)
      return []
    }
  },

  async getActiveEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Using mock events data")
        return mockEvents
      }
      return data || mockEvents
    } catch (error) {
      console.warn("Error fetching active events, using mock data:", error)
      return mockEvents
    }
  },

  async getActiveGifts() {
    try {
      const { data, error } = await supabase.from("gifts").select("*").eq("status", "active")

      if (error) {
        console.warn("Using mock gifts data")
        return mockGifts
      }
      return data || mockGifts
    } catch (error) {
      console.warn("Error fetching active gifts, using mock data:", error)
      return mockGifts
    }
  },

  async getUserNotifications(userId: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        console.warn("Using empty notifications data")
        return []
      }
      return data || []
    } catch (error) {
      console.warn("Error fetching user notifications:", error)
      return []
    }
  },

  async getUserReferrals(userId: string) {
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
        console.warn("Using empty referrals data")
        return []
      }
      return data || []
    } catch (error) {
      console.warn("Error fetching user referrals:", error)
      return []
    }
  },
}

// Action Functions
export const actionFunctions = {
  async createInvestment(userId: string, packageId: string, amount: number) {
    try {
      const { data: user } = await supabase.from("users").select("balance").eq("id", userId).single()

      if (!user || user.balance < amount) {
        throw new Error("অপর্যাপ্ত ব্যালেন্স")
      }

      const { data: package_ } = await supabase.from("investment_packages").select("*").eq("id", packageId).single()

      if (!package_) {
        throw new Error("প্যাকেজ পাওয়া যায়নি")
      }

      // Create investment
      const { data: investment, error } = await supabase
        .from("investments")
        .insert([
          {
            user_id: userId,
            package_id: packageId,
            amount: amount,
            daily_return: (amount * package_.daily_rate) / 100,
            total_return: (amount * package_.total_return_rate) / 100,
            days_completed: 0,
            total_days: package_.total_days,
            status: "active",
            next_payment: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Update user balance
      await supabase
        .from("users")
        .update({
          balance: user.balance - amount,
          total_invested: user.balance + amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      // Create transaction record
      await supabase.from("transactions").insert([
        {
          user_id: userId,
          type: "investment",
          amount: amount,
          status: "completed",
          description: `${package_.name_bn} প্যাকেজে বিনিয়োগ`,
        },
      ])

      return { investment, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  },

  async createWithdrawal(userId: string, amount: number, method: string, accountNumber: string) {
    try {
      const { data: user } = await supabase.from("users").select("balance").eq("id", userId).single()

      if (!user || user.balance < amount) {
        throw new Error("অপর্যাপ্ত ব্যালেন্স")
      }

      if (amount < 500) {
        throw new Error("সর্বনিম্ন উইথড্র পরিমাণ ৫০০ টাকা")
      }

      // Create withdrawal request
      const { data: transaction, error } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: userId,
            type: "withdraw",
            amount: amount,
            status: "pending",
            method: method,
            account_number: accountNumber,
            description: `${method} এর মাধ্যমে উইথড্র`,
            reference: `WD${Date.now()}`,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Lock the amount
      await supabase
        .from("users")
        .update({
          balance: user.balance - amount,
          locked_balance: user.balance + amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      return { transaction, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  },

  async spinWheel(userId: string, type: "daily" | "premium" | "mega") {
    try {
      const { data: user } = await supabase.from("users").select("balance, bonus_balance").eq("id", userId).single()

      if (!user) throw new Error("ব্যবহারকারী পাওয়া যায়নি")

      // Check if user can spin
      const cost = type === "daily" ? 0 : type === "premium" ? 100 : 500
      if (cost > 0 && user.balance < cost) {
        throw new Error("অপর্যাপ্ত ব্যালেন্স")
      }

      // Generate random prize
      const prizes = {
        daily: [10, 20, 30, 50, 100],
        premium: [50, 100, 200, 500, 1000],
        mega: [200, 500, 1000, 2000, 5000],
      }

      const prizeAmount = prizes[type][Math.floor(Math.random() * prizes[type].length)]
      const prizeType = Math.random() > 0.7 ? "cash" : "bonus"

      // Create spin record
      const { data: spin, error } = await supabase
        .from("spin_wheels")
        .insert([
          {
            user_id: userId,
            type: type,
            prize_amount: prizeAmount,
            prize_type: prizeType,
            status: "completed",
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Update user balance
      const balanceUpdate =
        prizeType === "cash"
          ? { balance: user.balance + prizeAmount }
          : { bonus_balance: user.bonus_balance + prizeAmount }

      if (cost > 0) {
        balanceUpdate.balance = (balanceUpdate.balance || user.balance) - cost
      }

      await supabase
        .from("users")
        .update({
          ...balanceUpdate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      // Create transaction
      await supabase.from("transactions").insert([
        {
          user_id: userId,
          type: "bonus",
          amount: prizeAmount,
          status: "completed",
          description: `${type} স্পিন থেকে ${prizeType === "cash" ? "ক্যাশ" : "বোনাস"} পুরস্কার`,
        },
      ])

      return { spin, prizeAmount, prizeType, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  },

  async completeTask(userId: string, taskId: string) {
    try {
      const { data: task } = await supabase.from("tasks").select("*").eq("id", taskId).single()

      if (!task) throw new Error("টাস্ক পাওয়া যায়নি")

      // Check if task already completed
      const { data: existingUserTask } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("task_id", taskId)
        .single()

      if (existingUserTask && existingUserTask.status === "completed") {
        throw new Error("টাস্ক ইতিমধ্যে সম্পন্ন হয়েছে")
      }

      // Complete task
      const { data: userTask, error } = await supabase
        .from("user_tasks")
        .upsert([
          {
            user_id: userId,
            task_id: taskId,
            status: "completed",
            progress: 100,
            completed_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Give reward
      const { data: user } = await supabase.from("users").select("bonus_balance").eq("id", userId).single()

      await supabase
        .from("users")
        .update({
          bonus_balance: (user?.bonus_balance || 0) + task.reward,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      // Create transaction
      await supabase.from("transactions").insert([
        {
          user_id: userId,
          type: "bonus",
          amount: task.reward,
          status: "completed",
          description: `${task.title_bn} টাস্ক সম্পন্ন করার জন্য পুরস্কার`,
        },
      ])

      return { userTask, reward: task.reward, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  },

  async claimGift(userId: string, giftId: string) {
    try {
      const { data: gift } = await supabase.from("gifts").select("*").eq("id", giftId).single()

      if (!gift) throw new Error("গিফট পাওয়া যায়নি")

      // Check if already claimed
      const { data: existingClaim } = await supabase
        .from("user_gifts")
        .select("*")
        .eq("user_id", userId)
        .eq("gift_id", giftId)
        .single()

      if (existingClaim) {
        throw new Error("গিফট ইতিমধ্যে ক্লেইম করা হয়েছে")
      }

      // Claim gift
      const { data: userGift, error } = await supabase
        .from("user_gifts")
        .insert([
          {
            user_id: userId,
            gift_id: giftId,
            status: "claimed",
            claimed_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Give reward
      const { data: user } = await supabase.from("users").select("bonus_balance").eq("id", userId).single()

      await supabase
        .from("users")
        .update({
          bonus_balance: (user?.bonus_balance || 0) + gift.reward,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      // Create transaction
      await supabase.from("transactions").insert([
        {
          user_id: userId,
          type: "bonus",
          amount: gift.reward,
          status: "completed",
          description: `${gift.title_bn} গিফট ক্লেইম`,
        },
      ])

      return { userGift, reward: gift.reward, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  },

  async markNotificationAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.warn("Error marking notification as read:", error)
      return null
    }
  },
}
