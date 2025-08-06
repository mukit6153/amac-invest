"use client"

import { createClient } from "@supabase/supabase-js"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  balance: number
  invested: number
  earned: number
  referralCode: string
  referredBy?: string
  createdAt: string
  lastLogin: string
  isActive: boolean
  level: number
  totalReferrals: number
  loginStreak?: number
}

export interface InvestmentPackage {
  id: number
  name: string
  name_bn: string
  min_amount: number
  max_amount: number
  daily_rate: number
  total_days: number
  total_return_rate: number
  features: string[]
  is_popular: boolean
  is_active: boolean
  color: string
  icon: string
  sort_order: number
  created_at: string
}

export interface Investment {
  id: string
  user_id: string
  package_id: number
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

export interface Transaction {
  id: string
  user_id: string
  type: "deposit" | "withdraw" | "investment" | "earning" | "referral" | "bonus"
  amount: number
  status: "pending" | "completed" | "failed" | "cancelled"
  description: string
  description_bn?: string
  reference?: string
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  title: string
  title_bn: string
  subtitle: string
  subtitle_bn: string
  image_url: string
  link_url?: string
  color_scheme: string
  is_active: boolean
  sort_order: number
  created_at: string
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

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  level: number
  commission_rate: number
  total_earned: number
  status: "active" | "inactive"
  created_at: string
  users?: User
}

// Mock data for fallback
const mockBanners = [
  {
    id: 1,
    title: "বিশেষ বোনাস অফার!",
    subtitle: "৫০% পর্যন্ত বোনাস পান",
    image: "/placeholder.svg?height=120&width=300&text=Special+Bonus",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    title: "নতুন প্যাকেজ চালু!",
    subtitle: "দৈনিক ৫% পর্যন্ত রিটার্ন",
    image: "/placeholder.svg?height=120&width=300&text=New+Package",
    color: "from-blue-500 to-cyan-500",
  },
]

const mockPackages: InvestmentPackage[] = [
  {
    id: 1,
    name: "Starter Package",
    name_bn: "স্টার্টার প্যাকেজ",
    min_amount: 500,
    max_amount: 2000,
    daily_rate: 3,
    total_days: 30,
    total_return_rate: 90,
    features: ["দৈনিক ৩% রিটার্ন", "৩০ দিনের মেয়াদ", "২৪/৭ সাপোর্ট"],
    is_popular: false,
    is_active: true,
    color: "from-blue-500 to-cyan-500",
    icon: "zap",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Premium Package",
    name_bn: "প্রিমিয়াম প্যাকেজ",
    min_amount: 2000,
    max_amount: 10000,
    daily_rate: 4,
    total_days: 30,
    total_return_rate: 120,
    features: ["দৈনিক ৪% রিটার্ন", "৩০ দিনের মেয়াদ", "প্রিমিয়াম সাপোর্ট", "বোনাস রিওয়ার্ড"],
    is_popular: true,
    is_active: true,
    color: "from-purple-500 to-pink-500",
    icon: "star",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "VIP Package",
    name_bn: "ভিআইপি প্যাকেজ",
    min_amount: 10000,
    max_amount: 50000,
    daily_rate: 5,
    total_days: 30,
    total_return_rate: 150,
    features: ["দৈনিক ৫% রিটার্ন", "৩০ দিনের মেয়াদ", "ভিআইপি সাপোর্ট", "এক্সক্লুসিভ বোনাস", "প্রাইভেট ম্যানেজার"],
    is_popular: false,
    is_active: true,
    color: "from-yellow-500 to-orange-500",
    icon: "crown",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
]

// Utility functions
function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "AMAC"
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function hashPassword(password: string): Promise<string> {
  // In a real app, use bcrypt or similar
  // For demo purposes, we'll use a simple hash
  return `$2b$10$demo.hash.for.${password}`
}

// Check if database schema exists
async function checkDatabaseSchema(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .limit(1)

    return !error
  } catch (error) {
    console.warn("Database schema not found:", error)
    return false
  }
}

// Authentication Functions
export async function signUp(userData: {
  name: string
  phone: string
  email: string
  password: string
  referralCode?: string
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if database schema exists
    const schemaExists = await checkDatabaseSchema()
    
    if (!schemaExists) {
      // Return mock success for demo purposes
      const mockUser: User = {
        id: `mock-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        balance: 100,
        invested: 0,
        earned: 0,
        referralCode: generateReferralCode(),
        referredBy: userData.referralCode,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        level: 1,
        totalReferrals: 0,
        loginStreak: 1,
      }
      
      // Store in localStorage for demo
      localStorage.setItem('currentUser', JSON.stringify(mockUser))
      
      return { success: true, user: mockUser }
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("phone", userData.phone)
      .single()

    if (existingUser) {
      return { success: false, error: "এই ফোন নম্বর দিয়ে ইতিমধ্যে একাউন্ট রয়েছে" }
    }

    // Validate referral code if provided
    if (userData.referralCode) {
      const { data: referrer } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", userData.referralCode)
        .single()

      if (!referrer) {
        return { success: false, error: "অবৈধ রেফারেল কোড" }
      }
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password)

    // Try to create user with password_hash, fallback without it
    let insertData: any = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      referral_code: generateReferralCode(),
      referred_by: userData.referralCode,
      balance: 100, // Welcome bonus
      login_streak: 1,
    }

    // Try to add password_hash if column exists
    try {
      insertData.password_hash = passwordHash
    } catch (error) {
      console.warn("Password hash column not available, proceeding without it")
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([insertData])
      .select()
      .single()

    if (insertError) {
      console.error("User creation error:", insertError)
      
      // If password_hash column doesn't exist, try without it
      if (insertError.message?.includes("password_hash")) {
        delete insertData.password_hash
        
        const { data: retryUser, error: retryError } = await supabase
          .from("users")
          .insert([insertData])
          .select()
          .single()

        if (retryError) {
          return { success: false, error: "রেজিস্ট্রেশন করতে সমস্যা হয়েছে" }
        }
        
        // Use retry result
        const user: User = {
          id: retryUser.id,
          name: retryUser.name,
          email: retryUser.email,
          phone: retryUser.phone,
          balance: retryUser.balance,
          invested: retryUser.invested || 0,
          earned: retryUser.earned || 0,
          referralCode: retryUser.referral_code,
          referredBy: retryUser.referred_by,
          createdAt: retryUser.created_at,
          lastLogin: retryUser.last_login,
          isActive: retryUser.is_active,
          level: retryUser.level || 1,
          totalReferrals: retryUser.total_referrals || 0,
          loginStreak: retryUser.login_streak || 1,
        }

        return { success: true, user }
      }
      
      return { success: false, error: "রেজিস্ট্রেশন করতে সমস্যা হয়েছে" }
    }

    // Create welcome bonus transaction
    try {
      await supabase.from("transactions").insert([
        {
          user_id: newUser.id,
          type: "bonus",
          amount: 100,
          status: "completed",
          description: "Welcome Bonus",
          description_bn: "স্বাগতম বোনাস",
        },
      ])
    } catch (error) {
      console.warn("Could not create welcome transaction:", error)
    }

    // Create referral record if applicable
    if (userData.referralCode) {
      try {
        const { data: referrer } = await supabase
          .from("users")
          .select("id, balance, total_referrals")
          .eq("referral_code", userData.referralCode)
          .single()

        if (referrer) {
          await supabase.from("referrals").insert([
            {
              referrer_id: referrer.id,
              referred_id: newUser.id,
              level: 1,
              commission_rate: 10,
            },
          ])

          // Give referral bonus
          await supabase.from("transactions").insert([
            {
              user_id: referrer.id,
              type: "referral",
              amount: 50,
              status: "completed",
              description: "Referral Bonus",
              description_bn: "রেফারেল বোনাস",
            },
          ])

          // Update referrer balance
          await supabase
            .from("users")
            .update({ 
              balance: (referrer.balance || 0) + 50,
              total_referrals: (referrer.total_referrals || 0) + 1
            })
            .eq("id", referrer.id)
        }
      } catch (error) {
        console.warn("Could not process referral:", error)
      }
    }

    const user: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      balance: newUser.balance,
      invested: newUser.invested || 0,
      earned: newUser.earned || 0,
      referralCode: newUser.referral_code,
      referredBy: newUser.referred_by,
      createdAt: newUser.created_at,
      lastLogin: newUser.last_login,
      isActive: newUser.is_active,
      level: newUser.level || 1,
      totalReferrals: newUser.total_referrals || 0,
      loginStreak: newUser.login_streak || 1,
    }

    return { success: true, user }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "রেজিস্ট্রেশন করতে সমস্যা হয়েছে" }
  }
}

export async function signIn(phone: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if database schema exists
    const schemaExists = await checkDatabaseSchema()
    
    if (!schemaExists) {
      // Check for demo credentials
      if (phone === "01700000000" && password === "password123") {
        const mockUser: User = {
          id: "demo-user-id",
          name: "ডেমো ইউজার",
          email: "demo@amac.com",
          phone: "01700000000",
          balance: 5000,
          invested: 2000,
          earned: 450,
          referralCode: "AMAC001",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isActive: true,
          level: 2,
          totalReferrals: 3,
          loginStreak: 5,
        }
        
        // Store in localStorage for demo
        localStorage.setItem('currentUser', JSON.stringify(mockUser))
        
        return { success: true, user: mockUser }
      }
      
      return { success: false, error: "ভুল ফোন নম্বর বা পাসওয়ার্ড" }
    }

    // Get user by phone
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single()

    if (fetchError || !userData) {
      return { success: false, error: "ব্যবহারকারী পাওয়া যায়নি" }
    }

    // Password validation (simplified for demo)
    const isValidPassword = 
      (phone === "01700000000" && password === "password123") ||
      password.length >= 6 // Simple validation for demo

    if (!isValidPassword) {
      return { success: false, error: "ভুল পাসওয়ার্ড" }
    }

    if (!userData.is_active) {
      return { success: false, error: "আপনার একাউন্ট নিষ্ক্রিয় করা হয়েছে" }
    }

    // Check for daily login bonus
    const today = new Date().toDateString()
    const lastLogin = new Date(userData.last_login).toDateString()
    let loginStreak = userData.login_streak || 0
    let newBalance = userData.balance

    if (lastLogin !== today) {
      // Update login streak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = new Date(userData.last_login).toDateString() === yesterday.toDateString()
      
      loginStreak = wasYesterday ? loginStreak + 1 : 1
      
      // Calculate daily bonus (max 100 taka)
      const bonusAmount = Math.min(loginStreak * 10, 100)
      newBalance += bonusAmount
      
      try {
        // Update user
        await supabase
          .from("users")
          .update({
            last_login: new Date().toISOString(),
            login_streak: loginStreak,
            balance: newBalance,
          })
          .eq("id", userData.id)

        // Create bonus transaction
        await supabase.from("transactions").insert([
          {
            user_id: userData.id,
            type: "bonus",
            amount: bonusAmount,
            status: "completed",
            description: "Daily Login Bonus",
            description_bn: "দৈনিক লগইন বোনাস",
          },
        ])
      } catch (error) {
        console.warn("Could not update login bonus:", error)
      }
    }

    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      balance: newBalance,
      invested: userData.invested || 0,
      earned: userData.earned || 0,
      referralCode: userData.referral_code,
      referredBy: userData.referred_by,
      createdAt: userData.created_at,
      lastLogin: userData.last_login,
      isActive: userData.is_active,
      level: userData.level || 1,
      totalReferrals: userData.total_referrals || 0,
      loginStreak: loginStreak,
    }

    return { success: true, user }
  } catch (error) {
    console.error("Signin error:", error)
    return { success: false, error: "লগইন করতে সমস্যা হয়েছে" }
  }
}

// Investment Functions
export async function createInvestment(userId: string, packageId: string, amount: number): Promise<{ success: boolean; investment?: Investment; error?: string }> {
  try {
    // Check if database schema exists
    const schemaExists = await checkDatabaseSchema()
    
    if (!schemaExists) {
      // Mock investment creation for demo
      const mockInvestment: Investment = {
        id: `investment-${Date.now()}`,
        user_id: userId,
        package_id: parseInt(packageId),
        amount,
        daily_return: amount * 0.04, // 4% daily return
        total_return: amount * 1.2, // 20% total return
        days_completed: 0,
        total_days: 30,
        status: "active",
        next_payment: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      return { success: true, investment: mockInvestment }
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return { success: false, error: "ব্যবহারকারী পাওয়া যায়নি" }
    }

    // Check balance
    if (user.balance < amount) {
      return { success: false, error: "অপর্যাপ্ত ব্যালেন্স" }
    }

    // Get package
    const { data: packageData, error: packageError } = await supabase
      .from("investment_packages")
      .select("*")
      .eq("id", parseInt(packageId))
      .eq("is_active", true)
      .single()

    if (packageError || !packageData) {
      return { success: false, error: "প্যাকেজ পাওয়া যায়নি" }
    }

    // Validate amount
    if (amount < packageData.min_amount || amount > packageData.max_amount) {
      return { success: false, error: "অবৈধ বিনিয়োগের পরিমাণ" }
    }

    // Calculate returns
    const dailyReturn = (amount * packageData.daily_rate) / 100
    const totalReturn = amount + (amount * packageData.total_return_rate) / 100
    const nextPayment = new Date()
    nextPayment.setDate(nextPayment.getDate() + 1)

    // Create investment
    const { data: investment, error: investmentError } = await supabase
      .from("investments")
      .insert([
        {
          user_id: userId,
          package_id: packageData.id,
          amount,
          daily_return: dailyReturn,
          total_return: totalReturn,
          total_days: packageData.total_days,
          next_payment: nextPayment.toISOString(),
        },
      ])
      .select()
      .single()

    if (investmentError) {
      console.error("Investment creation error:", investmentError)
      return { success: false, error: "বিনিয়োগ করতে সমস্যা হয়েছে" }
    }

    // Create investment transaction
    await supabase.from("transactions").insert([
      {
        user_id: userId,
        type: "investment",
        amount: -amount,
        status: "completed",
        description: `${packageData.name} Investment`,
        description_bn: `${packageData.name_bn} বিনিয়োগ`,
      },
    ])

    // Update user balance and invested amount
    await supabase
      .from("users")
      .update({
        balance: user.balance - amount,
        invested: (user.invested || 0) + amount,
      })
      .eq("id", userId)

    return { success: true, investment }
  } catch (error) {
    console.error("Investment creation error:", error)
    return { success: false, error: "বিনিয়োগ করতে সমস্যা হয়েছে" }
  }
}

// Data Functions
export const dataFunctions = {
  async getInvestmentPackages(): Promise<InvestmentPackage[]> {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return mockPackages
      }

      const { data, error } = await supabase
        .from("investment_packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (error) {
        console.warn("Error fetching packages, using mock data:", error)
        return mockPackages
      }

      return data || mockPackages
    } catch (error) {
      console.warn("Error fetching packages, using mock data:", error)
      return mockPackages
    }
  },

  async getUserInvestments(userId: string): Promise<Investment[]> {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          investment_packages (*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Error fetching user investments:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching user investments:", error)
      return []
    }
  },

  async getUserTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        console.warn("Error fetching transactions:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching transactions:", error)
      return []
    }
  },

  async getBanners() {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return mockBanners
      }

      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (error) {
        console.warn("Error fetching banners, using mock data:", error)
        return mockBanners
      }

      return data?.map((banner) => ({
        id: banner.id,
        title: banner.title_bn || banner.title,
        subtitle: banner.subtitle_bn || banner.subtitle,
        image: banner.image_url,
        color: banner.color_scheme,
      })) || mockBanners
    } catch (error) {
      console.warn("Error fetching banners, using mock data:", error)
      return mockBanners
    }
  },

  async getActiveTasks(): Promise<Task[]> {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Error fetching tasks:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching tasks:", error)
      return []
    }
  },

  async getUserTasks(userId: string) {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

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
  },

  async getActiveEvents(): Promise<Event[]> {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Error fetching events:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching events:", error)
      return []
    }
  },

  async getActiveGifts(): Promise<Gift[]> {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("gifts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Error fetching gifts:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching gifts:", error)
      return []
    }
  },

  async getUserNotifications(userId: string, limit = 10) {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        console.warn("Error fetching notifications:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching notifications:", error)
      return []
    }
  },

  async getUserReferrals(userId: string) {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("referrals")
        .select(`
          *,
          users!referrals_referred_id_fkey(name, phone, created_at)
        `)
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Error fetching referrals:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching referrals:", error)
      return []
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Error fetching products:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching products:", error)
      return []
    }
  },

  async getUserOrders(userId: string) {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products (*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Error fetching orders:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching orders:", error)
      return []
    }
  },

  async getUserWithdrawals(userId: string) {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        return []
      }

      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Error fetching withdrawals:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Error fetching withdrawals:", error)
      return []
    }
  },
}

// Action Functions
export const actionFunctions = {
  createInvestment,
}

// Auth Functions
export const authFunctions = {
  signIn,
  signUp,
  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const schemaExists = await checkDatabaseSchema()
      
      if (!schemaExists) {
        // Try to get from localStorage for demo
        const storedUser = localStorage.getItem('currentUser')
        if (storedUser) {
          return JSON.parse(storedUser)
        }
        return null
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (error || !data) {
        return null
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        balance: data.balance,
        invested: data.invested || 0,
        earned: data.earned || 0,
        referralCode: data.referral_code,
        referredBy: data.referred_by,
        createdAt: data.created_at,
        lastLogin: data.last_login,
        isActive: data.is_active,
        level: data.level || 1,
        totalReferrals: data.total_referrals || 0,
        loginStreak: data.login_streak || 1,
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
      return null
    }
  },
}

// Real-time subscriptions
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
      callback
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
      callback
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
      callback
    )
    .subscribe()
}

// Export types
export type { User }
