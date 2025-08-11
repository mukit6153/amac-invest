import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
}

// Client-side Supabase client (for public access and RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define types for your database entities
export interface User {
  id: string;
  email: string;
  wallet_balance: number;
  referral_code: string;
  referred_by: string | null;
  is_admin: boolean;
  password_hash: string;
  last_daily_bonus_claim: string | null; // ISO string date
  daily_bonus_amount: number;
  completed_daily_tasks: number;
  completed_intern_tasks: number;
}

export interface InvestmentPackage {
  id: number;
  name: string;
  min_amount: number;
  max_amount: number;
  daily_profit_percentage: number;
  duration_days: number;
  total_return_percentage: number;
}

export interface UserInvestment {
  id: number;
  user_id: string;
  package_id: number;
  invested_amount: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  package_name?: string; // Optional, for easier display
  daily_profit_percentage?: number; // Optional, for easier display
}

export interface Transaction {
  id: number;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'bonus' | 'referral_bonus' | 'task_reward' | 'purchase';
  amount: number;
  date: string;
  description: string;
}

export interface DailyTask {
  id: number;
  title: string;
  description: string;
  reward_amount: number;
  is_completed: boolean;
}

export interface InternTask {
  id: number;
  title: string;
  description: string;
  reward_amount: number;
  is_completed: boolean;
  video_url?: string; // New column for YouTube video tasks
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export interface Referral {
  id: number;
  referrer_id: string;
  referred_id: string;
  referral_bonus_amount: number;
  date: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  reward_amount: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface FreeGift {
  id: number;
  name: string;
  description: string;
  reward_amount: number;
  is_claimed: boolean;
}

export interface SpinWheelReward {
  id: number;
  name: string;
  type: 'balance' | 'gift';
  amount: number;
  probability: number;
}

// --- Auth Functions (Client-side) ---
export const authFunctions = {
  async signIn(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password) // DANGER: In real app, never store plain passwords. Use Supabase auth.
      .single()

    if (error) {
      console.error('Login error:', error)
      throw new Error(error.message)
    }
    return data as User
  },

  async signUp(name: string, email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: password, // DANGER: In real app, never store plain passwords. Use Supabase auth.
        wallet_balance: 0,
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        referred_by: null,
        daily_bonus_amount: 10,
        completed_daily_tasks: 0,
        completed_intern_tasks: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Signup error:', error)
      throw new Error(error.message)
    }
    return data as User
  },

  async getCurrentUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Fetch current user error:', error)
      return null
    }
    return data as User
  },

  async signOut(): Promise<void> {
    console.log('User signed out (simulated)')
  },
}

// --- Read-only Data Functions (Client-side) ---
export const dataFunctions = {
  async getInvestmentPackages(): Promise<InvestmentPackage[]> {
    const { data, error } = await supabase
      .from('investment_packages')
      .select('*')
      .order('min_amount', { ascending: true })

    if (error) {
      console.error('Error fetching investment packages:', error)
      throw new Error(error.message)
    }
    return data as InvestmentPackage[]
  },

  async getUserInvestments(userId: string): Promise<UserInvestment[]> {
    const { data, error } = await supabase
      .from('user_investments')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching user investments:', error)
      throw new Error(error.message)
    }
    return data as UserInvestment[]
  },

  async getDailyTasks(userId: string): Promise<DailyTask[]> {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('completed_daily_tasks')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      throw new Error(userError?.message || 'User not found.')
    }

    const completedTaskCount = user.completed_daily_tasks || 0

    const { data: staticTasks, error: tasksError } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (tasksError) {
      console.error('Error fetching daily task definitions:', tasksError)
      throw new Error(tasksError.message)
    }

    return (staticTasks as DailyTask[]).map(task => ({
      ...task,
      is_completed: completedTaskCount >= task.id
    }))
  },

  async getInternTasks(userId: string): Promise<InternTask[]> {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('completed_intern_tasks')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      throw new Error(userError?.message || 'User not found.')
    }

    const completedTaskCount = user.completed_intern_tasks || 0

    const { data: staticInternTasks, error: tasksError } = await supabase
      .from('intern_tasks')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (tasksError) {
      console.error('Error fetching intern task definitions:', tasksError)
      throw new Error(tasksError.message)
    }

    return (staticInternTasks as InternTask[]).map(task => ({
      ...task,
      is_completed: completedTaskCount >= task.id
    }))
  },

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: true })

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error(error.message)
    }
    return data as Product[]
  },

  async getReferrals(userId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('referred_by', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching referrals:', error)
      throw new Error(error.message)
    }
    return data as User[]
  },
}

// --- Realtime Subscriptions ---
export const subscribeToUserUpdates = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`user_changes:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}
