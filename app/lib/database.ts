"use client"
import { createClient } from "@supabase/supabase-js"

// Define types for your database entities
export interface User {
  id: string
  name: string
  email: string
  balance: number
  invested: number
  earned: number
  level: number
  referral_code: string
  referred_by: string | null
  phone: string | null
  total_referrals: number
  is_active: boolean
  login_streak: number
  last_login: string
  password_hash: string
  created_at?: string
  updated_at?: string
  completed_daily_tasks?: string[]
  completed_intern_tasks?: string[]
  daily_bonus_amount?: number
  last_daily_bonus_claim?: string
}

export interface InvestmentPackage {
  id: string
  name: string
  description: string
  price: number
  daily_return_percentage: number
  duration_days: number
}

export interface UserInvestment {
  id: string
  user_id: string
  package_id: string
  package_name: string
  invested_amount: number
  daily_return: number
  start_date: string
  end_date: string
  status: "active" | "completed"
}

export interface DailyTask {
  id: string
  name: string
  description: string
  reward: number
  time_required_minutes: number
  is_active: boolean
}

export interface InternTask {
  id: string
  name: string
  description: string
  reward: number
  time_required_minutes: number
  is_active: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number // Price in wallet balance
  image_url: string
  stock: number
}

export interface Transaction {
  id: string
  user_id: string
  type: "deposit" | "withdraw" | "purchase" | "bonus" | "task_reward" | "investment_return"
  amount: number
  status: "pending" | "completed" | "failed" | "cancelled"
  method: string | null
  account_number: string | null
  reference: string | null
  description: string | null
  created_at: string
  updated_at: string
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// --- Admin Functions ---
export const adminFunctions = {
  async checkAdminRole(userId: string): Promise<{ isAdmin: boolean; role?: string; permissions?: any }> {
    try {
      // Get user email from auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        return { isAdmin: false }
      }

      // Check if user is super admin by email
      if (user.email === "superadmin@ajbell.com") {
        return {
          isAdmin: true,
          role: "super_admin",
          permissions: {
            manage_users: true,
            manage_packages: true,
            manage_products: true,
            manage_tasks: true,
            view_analytics: true,
            system_settings: true,
          },
        }
      }

      // Check database for admin role
      const { data, error } = await supabase
        .from("admin_roles")
        .select("role, permissions")
        .eq("user_id", userId)
        .maybeSingle()

      if (error) {
        console.error("Error checking admin role:", error)
        return { isAdmin: false }
      }

      if (data) {
        return {
          isAdmin: true,
          role: data.role,
          permissions: data.permissions,
        }
      }

      return { isAdmin: false }
    } catch (error) {
      console.error("Admin role check error:", error)
      return { isAdmin: false }
    }
  },

  async createSuperAdmin(email: string, name: string): Promise<User> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: "superadmin123",
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (authError) {
        console.error("Auth error creating super admin:", authError)
        // If user already exists, try to sign in instead
        if (authError.message.includes("already registered")) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: "superadmin123",
          })

          if (signInError) {
            throw new Error(`Failed to authenticate super admin: ${signInError.message}`)
          }

          if (!signInData.user) {
            throw new Error("No user returned from authentication")
          }

          // Check if profile exists
          const { data: existingProfile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", signInData.user.id)
            .maybeSingle()

          if (profileError) {
            throw new Error(`Failed to check existing profile: ${profileError.message}`)
          }

          if (existingProfile) {
            return existingProfile as User
          }

          // Create profile for existing auth user
          return await authFunctions.createUserProfile(signInData.user.id, name, email)
        }

        throw new Error(`Failed to create super admin auth: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error("No user returned from super admin creation")
      }

      // Wait for auth context to be established
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create user profile with proper UUID from Supabase auth
      const superAdminUser = {
        id: authData.user.id, // Using proper UUID from Supabase auth
        name: name,
        email: email,
        balance: 999999.99,
        invested: 0,
        earned: 0,
        level: 999,
        referral_code: "SUPERADMIN",
        referred_by: null,
        phone: null,
        total_referrals: 0,
        is_active: true,
        login_streak: 0,
        last_login: new Date().toISOString(),
        password_hash: "", // Not needed with Supabase auth
      }

      // Insert super admin user profile
      const { data, error } = await supabase.from("users").upsert([superAdminUser]).select().single()

      if (error) {
        console.error("Error creating super admin profile:", error)
        throw new Error(`Failed to create super admin profile: ${error.message}`)
      }

      // Create admin role entry
      const { error: roleError } = await supabase.from("admin_roles").upsert([
        {
          user_id: authData.user.id,
          role: "super_admin",
          permissions: {
            manage_users: true,
            manage_packages: true,
            manage_products: true,
            manage_tasks: true,
            view_analytics: true,
            system_settings: true,
          },
        },
      ])

      if (roleError) {
        console.error("Error creating admin role:", roleError)
        // Don't throw error here, profile creation is more important
      }

      console.log("Super admin created successfully:", data)
      return data as User
    } catch (error: any) {
      console.error("Create super admin error:", error)
      throw new Error(error.message || "Failed to create super admin")
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data as User[]
    } catch (error: any) {
      console.error("Get all users error:", error)
      throw new Error(error.message || "Failed to get users")
    }
  },

  async updateUserBalance(userId: string, newBalance: number): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data as User
    } catch (error: any) {
      console.error("Update user balance error:", error)
      throw new Error(error.message || "Failed to update user balance")
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) {
        throw new Error(error.message)
      }
    } catch (error: any) {
      console.error("Delete user error:", error)
      throw new Error(error.message || "Failed to delete user")
    }
  },
}

// --- Auth Functions ---
export const authFunctions = {
  async signUp(name: string, email: string, password: string): Promise<User | null> {
    try {
      console.log("Starting signup process for:", email)

      // Use Supabase's built-in authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: {
            name: name,
          },
        },
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("No user returned from authentication")
      }

      console.log("User authenticated successfully:", authData.user.id)

      // Wait for auth context to be established
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Check if user profile already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (checkError) {
        console.error("Error checking existing user:", checkError)
      }

      if (existingUser) {
        console.log("User profile already exists:", existingUser)
        return existingUser as User
      }

      // Create user profile in users table
      console.log("Creating user profile...")
      const newUser = await this.createUserProfile(authData.user.id, name, email)
      return newUser
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw error
    }
  },

  async signIn(email: string, password: string): Promise<User | null> {
    try {
      console.log("Attempting to sign in with:", email)

      // Handle special accounts
      if (email === "superadmin@ajbell.com" && password === "superadmin123") {
        return await this.handleSuperAdminLogin()
      }

      if (email === "demo@example.com" && password === "demo123") {
        return await this.handleDemoLogin()
      }

      // Regular user login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw new Error(`Authentication failed: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error("No user returned from authentication")
      }

      console.log("Authentication successful, getting user profile...")

      // Wait for auth context to be established
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (userError) {
        console.error("User data error:", userError)
        throw new Error(`Failed to get user profile: ${userError.message}`)
      }

      if (!userData) {
        console.log("User profile not found, creating new profile...")
        const newUser = await this.createUserProfile(
          authData.user.id,
          authData.user.user_metadata?.name || authData.user.email || email,
          authData.user.email || email,
        )
        return newUser
      }

      console.log("User profile found:", userData)
      return userData as User
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw new Error(error.message || "Sign in failed")
    }
  },

  async createUserProfile(userId: string, name: string, email: string): Promise<User> {
    try {
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()

      const newUser = {
        id: userId,
        name,
        email,
        balance: 100, // Starting bonus
        invested: 0,
        earned: 0,
        level: 1,
        referral_code: referralCode,
        referred_by: null,
        phone: null,
        total_referrals: 0,
        is_active: true,
        login_streak: 0,
        last_login: new Date().toISOString(),
        password_hash: "", // Not needed with Supabase auth
      }

      console.log("Creating user profile:", newUser)

      // Use upsert to handle potential conflicts
      const { data, error } = await supabase.from("users").upsert([newUser], { onConflict: "id" }).select().single()

      if (error) {
        console.error("Error creating user profile:", error)
        throw new Error(`Failed to create user profile: ${error.message}`)
      }

      console.log("User profile created successfully:", data)
      return data as User
    } catch (error: any) {
      console.error("Create user profile error:", error)
      throw new Error(error.message || "Failed to create user profile")
    }
  },

  async handleDemoLogin(): Promise<User> {
    try {
      // Try to sign in with demo credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: "demo@example.com",
        password: "demo123",
      })

      if (authError) {
        console.log("Demo user doesn't exist in auth, creating...")
        // If demo user doesn't exist, create it
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: "demo@example.com",
          password: "demo123",
          options: {
            data: { name: "Demo User" },
          },
        })

        if (signupError) {
          throw new Error(`Failed to create demo user: ${signupError.message}`)
        }

        if (!signupData.user) {
          throw new Error("No user returned from demo signup")
        }

        // Wait for auth context
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Create demo user profile
        return await this.createUserProfile(signupData.user.id, "Demo User", "demo@example.com")
      }

      if (!authData.user) {
        throw new Error("No user returned from demo authentication")
      }

      // Check if profile exists
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (userError) {
        throw new Error(`Failed to get demo user profile: ${userError.message}`)
      }

      if (!userData) {
        // Create profile if it doesn't exist
        return await this.createUserProfile(authData.user.id, "Demo User", "demo@example.com")
      }

      return userData as User
    } catch (error: any) {
      console.error("Demo login error:", error)
      throw new Error(error.message || "Demo login failed")
    }
  },

  async handleSuperAdminLogin(): Promise<User> {
    try {
      // Try to sign in with super admin credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: "superadmin@ajbell.com",
        password: "superadmin123",
      })

      if (authError) {
        console.log("Super admin doesn't exist in auth, creating...")
        // If super admin doesn't exist, create it
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: "superadmin@ajbell.com",
          password: "superadmin123",
          options: {
            data: { name: "Super Administrator" },
          },
        })

        if (signupError) {
          throw new Error(`Failed to create super admin: ${signupError.message}`)
        }

        if (!signupData.user) {
          throw new Error("No user returned from super admin signup")
        }

        // Wait for auth context
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Create super admin profile
        return await this.createUserProfile(signupData.user.id, "Super Administrator", "superadmin@ajbell.com")
      }

      if (!authData.user) {
        throw new Error("No user returned from super admin authentication")
      }

      // Check if profile exists
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle()

      if (userError) {
        throw new Error(`Failed to get super admin profile: ${userError.message}`)
      }

      if (!userData) {
        // Create profile if it doesn't exist
        return await this.createUserProfile(authData.user.id, "Super Administrator", "superadmin@ajbell.com")
      }

      return userData as User
    } catch (error: any) {
      console.error("Super admin login error:", error)
      throw new Error(error.message || "Super admin login failed")
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error)
      throw new Error(error.message)
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        return null
      }

      const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (userError) {
        console.error("Error getting user profile:", userError)
        return null
      }

      return userData as User
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  },
}

// --- Data Functions ---
export const dataFunctions = {
  supabase, // Export supabase client for direct use where needed (e.g., Admin Panel)

  async getInvestmentPackages(): Promise<InvestmentPackage[]> {
    const { data, error } = await supabase.from("investment_packages").select("*").order("price", { ascending: true })

    if (error) {
      console.error("Error fetching investment packages:", error)
      throw new Error(error.message)
    }
    return data as InvestmentPackage[]
  },

  async getUserInvestments(userId: string): Promise<UserInvestment[]> {
    const { data, error } = await supabase
      .from("user_investments")
      .select("*")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching user investments:", error)
      throw new Error(error.message)
    }
    return data as UserInvestment[]
  },

  async investInPackage(userId: string, packageId: string): Promise<User> {
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    const { data: pkg, error: pkgError } = await supabase
      .from("investment_packages")
      .select("*")
      .eq("id", packageId)
      .single()

    if (pkgError || !pkg) {
      throw new Error(pkgError?.message || "Investment package not found.")
    }

    if (user.balance < pkg.price) {
      throw new Error("Insufficient balance to invest in this package.")
    }

    const newBalance = user.balance - pkg.price
    const newInvested = user.invested + pkg.price
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + pkg.duration_days)

    // Deduct balance and update invested amount
    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance, invested: newInvested })
      .eq("id", userId)

    if (updateError) {
      throw new Error(updateError.message)
    }

    // Create new user investment record
    const { data: newInvestment, error: investmentError } = await supabase
      .from("user_investments")
      .insert({
        user_id: userId,
        package_id: packageId,
        package_name: pkg.name,
        invested_amount: pkg.price,
        daily_return: (pkg.price * pkg.daily_return_percentage) / 100,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "active",
      })
      .select()
      .single()

    if (investmentError) {
      // If investment record fails, try to revert user balance (basic rollback)
      await supabase.from("users").update({ balance: user.balance, invested: user.invested }).eq("id", userId)
      throw new Error(investmentError.message)
    }

    // Return updated user data
    const { data: updatedUser, error: fetchUpdatedUserError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (fetchUpdatedUserError || !updatedUser) {
      throw new Error(fetchUpdatedUserError?.message || "Failed to fetch updated user data.")
    }

    return updatedUser as User
  },

  async getDailyTasks(userId: string): Promise<DailyTask[]> {
    // In a real app, tasks would be generated daily and tracked per user
    // For demo, we'll use a static list and simulate completion
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("completed_daily_tasks")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    const completedTaskIds = user.completed_daily_tasks || []
    const today = new Date().toDateString()

    // Fetch actual daily task definitions from the database
    const { data: staticTasks, error: tasksError } = await supabase
      .from("daily_tasks")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })

    if (tasksError) {
      console.error("Error fetching daily task definitions:", tasksError)
      throw new Error(tasksError.message)
    }

    return (staticTasks as DailyTask[]).map((task) => ({
      ...task,
      completed: completedTaskIds.includes(`${today}-${task.id}`),
    }))
  },

  async completeDailyTask(userId: string, taskId: string): Promise<User> {
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    const today = new Date().toDateString()
    const taskIdentifier = `${today}-${taskId}`
    const completedTasks = user.completed_daily_tasks || []

    if (completedTasks.includes(taskIdentifier)) {
      throw new Error("এই টাস্কটি আজই সম্পন্ন করা হয়েছে।")
    }

    // Fetch the task definition to get its reward
    const { data: task, error: taskError } = await supabase.from("daily_tasks").select("*").eq("id", taskId).single()

    if (taskError || !task) {
      throw new Error(taskError?.message || "টাস্ক পাওয়া যায়নি।")
    }

    const newBalance = user.balance + task.reward
    const updatedCompletedTasks = [...completedTasks, taskIdentifier]

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance, completed_daily_tasks: updatedCompletedTasks })
      .eq("id", userId)
      .select()
      .single()

    if (updateError) {
      throw new Error(updateError.message)
    }
    return updatedUser as User
  },

  async claimDailyBonus(userId: string): Promise<User> {
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    const today = new Date().toDateString()
    const lastClaimDate = user.last_daily_bonus_claim ? new Date(user.last_daily_bonus_claim).toDateString() : null

    if (lastClaimDate === today) {
      throw new Error("আপনি আজকের দৈনিক বোনাস ইতিমধ্যেই দাবি করেছেন।")
    }

    const bonusAmount = user.daily_bonus_amount || 10 // Default bonus if not set
    const newBalance = user.balance + bonusAmount

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        balance: newBalance,
        last_daily_bonus_claim: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (updateError) {
      throw new Error(updateError.message)
    }
    return updatedUser as User
  },

  async getInternTasks(userId: string): Promise<InternTask[]> {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("completed_intern_tasks")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    const completedTaskIds = user.completed_intern_tasks || []

    // Fetch actual intern task definitions from the database
    const { data: staticInternTasks, error: tasksError } = await supabase
      .from("intern_tasks")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })

    if (tasksError) {
      console.error("Error fetching intern task definitions:", tasksError)
      throw new Error(tasksError.message)
    }

    return (staticInternTasks as InternTask[]).map((task) => ({
      ...task,
      completed: completedTaskIds.includes(task.id),
    }))
  },

  async completeInternTask(userId: string, taskId: string): Promise<User> {
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    const completedTasks = user.completed_intern_tasks || []

    if (completedTasks.includes(taskId)) {
      throw new Error("এই ইন্টার্ন টাস্কটি ইতিমধ্যেই সম্পন্ন করা হয়েছে।")
    }

    // Fetch the task definition to get its reward
    const { data: task, error: taskError } = await supabase.from("intern_tasks").select("*").eq("id", taskId).single()

    if (taskError || !task) {
      throw new Error(taskError?.message || "ইন্টার্ন টাস্ক পাওয়া যায়নি।")
    }

    const newBalance = user.balance + task.reward
    const updatedCompletedTasks = [...completedTasks, task.id]

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance, completed_intern_tasks: updatedCompletedTasks })
      .eq("id", userId)
      .select()
      .single()

    if (updateError) {
      throw new Error(updateError.message)
    }
    return updatedUser as User
  },

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*").order("price", { ascending: true })

    if (error) {
      console.error("Error fetching products:", error)
      throw new Error(error.message)
    }
    return data as Product[]
  },

  async purchaseProduct(userId: string, productId: string): Promise<User> {
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (productError || !product) {
      throw new Error(productError?.message || "Product not found.")
    }

    if (product.stock <= 0) {
      throw new Error("এই পণ্যটি স্টকে নেই।")
    }

    if (user.balance < product.price) {
      throw new Error("অপর্যাপ্ত ব্যালেন্স।")
    }

    const newBalance = user.balance - product.price
    const newStock = product.stock - 1

    // Deduct balance from user
    const { error: updateUserError } = await supabase.from("users").update({ balance: newBalance }).eq("id", userId)

    if (updateUserError) {
      throw new Error(updateUserError.message)
    }

    // Decrease product stock
    const { error: updateProductError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", productId)

    if (updateProductError) {
      // If product update fails, try to revert user balance (basic rollback)
      await supabase.from("users").update({ balance: user.balance }).eq("id", userId)
      throw new Error(updateProductError.message)
    }

    // Record the purchase transaction
    const { error: transactionError } = await supabase.from("transactions").insert({
      user_id: userId,
      type: "purchase",
      amount: product.price,
      status: "completed",
      description: `Purchased ${product.name}`,
    })
    if (transactionError) {
      console.error("Error recording purchase transaction:", transactionError)
      // Decide if you want to throw this error or just log it
    }

    // Return updated user data
    const { data: updatedUser, error: fetchUpdatedUserError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (fetchUpdatedUserError || !updatedUser) {
      throw new Error(fetchUpdatedUserError?.message || "Failed to fetch updated user data.")
    }

    return updatedUser as User
  },

  async getReferrals(userId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("referred_by", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching referrals:", error)
      throw new Error(error.message)
    }
    return data as User[]
  },

  async processWithdrawal(userId: string, amount: number, method: string, accountDetails: string): Promise<User> {
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    if (user.balance < amount) {
      throw new Error("অপর্যাপ্ত ব্যালেন্স।")
    }

    const newBalance = user.balance - amount

    // Update user balance
    const { error: updateError } = await supabase.from("users").update({ balance: newBalance }).eq("id", userId)

    if (updateError) {
      throw new Error(updateError.message)
    }

    // In a real app, you'd also create a withdrawal request record for admin processing
    // For demo, we'll just log it
    console.log(`Withdrawal request from ${user.email}: ${amount} via ${method} to ${accountDetails}`)

    // Return updated user data
    const { data: updatedUser, error: fetchUpdatedUserError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (fetchUpdatedUserError || !updatedUser) {
      throw new Error(fetchUpdatedUserError?.message || "Failed to fetch updated user data.")
    }

    return updatedUser as User
  },

  async updateUserSettings(userId: string, settings: any): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update(settings) // Assuming settings object matches user table columns
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating user settings:", error)
      throw new Error(error.message)
    }
    return data as User
  },

  async changePassword(userId: string, oldPasswordHash: string, newPasswordHash: string): Promise<User> {
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !user) {
      throw new Error(userError?.message || "User not found.")
    }

    if (user.password_hash !== oldPasswordHash) {
      throw new Error("পুরানো পাসওয়ার্ড ভুল।")
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ password_hash: newPasswordHash })
      .eq("id", userId)
      .select()
      .single()

    if (updateError) {
      console.error("Error changing password:", updateError)
      throw new Error(updateError.message)
    }
    return updatedUser as User
  },
}

// --- Realtime Subscriptions ---
export const setupRealtimeSubscriptions = () => {
  const channel = supabase
    .channel("database-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "users" }, (payload) => {
      console.log("Users table change:", payload)
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "investment_packages" }, (payload) => {
      console.log("Investment packages change:", payload)
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
      console.log("Products change:", payload)
    })
    .subscribe()

  return channel
}

export const subscribeToUserUpdates = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`user_changes:${userId}`)
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

export const subscribeToTransactions = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`transactions:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "transactions",
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe()
}

export const subscribeToInvestments = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`investments:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_investments",
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe()
}
