'use server'

import { createClient } from '@supabase/supabase-js'
import { User, InvestmentPackage, DailyTask, InternTask, Product, Transaction } from './database' // Import types

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables for server actions.')
}

// Server-side Supabase client (for admin actions, bypasses RLS)
const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Helper function to get user by ID (server-side)
export async function getUserByIdServer(userId: string): Promise<User | null> {
  const { data, error } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user (server):', error);
    return null;
  }
  return data;
}

// Helper function to update user balance (server-side)
export async function updateUserBalanceServer(userId: string, amount: number): Promise<boolean> {
  const { data: user, error: fetchError } = await adminSupabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single();

  if (fetchError || !user) {
    console.error('Error fetching user balance (server):', fetchError);
    return false;
  }

  const newBalance = user.wallet_balance + amount;

  const { error: updateError } = await adminSupabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating user balance (server):', updateError);
    return false;
  }
  return true;
}

// Helper function to record a transaction (server-side)
export async function recordTransactionServer(transaction: Omit<Transaction, 'id' | 'date'>): Promise<boolean> {
  const { error } = await adminSupabase
    .from('transactions')
    .insert({ ...transaction, date: new Date().toISOString() });

  if (error) {
    console.error('Error recording transaction (server):', error);
    return false;
  }
  return true;
}

// --- Server Actions for Data Manipulation ---

export async function investInPackageAction(userId: string, packageId: number): Promise<User> {
  const { data: user, error: userError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw new Error(userError?.message || 'User not found.')
  }

  const { data: pkg, error: pkgError } = await adminSupabase
    .from('investment_packages')
    .select('*')
    .eq('id', packageId)
    .single()

  if (pkgError || !pkg) {
    throw new Error(pkgError?.message || 'Investment package not found.')
  }

  if (user.wallet_balance < pkg.min_amount) {
    throw new Error('Insufficient balance to invest in this package.')
  }

  const newBalance = user.wallet_balance - pkg.min_amount
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + pkg.duration_days)

  const { error: updateError } = await adminSupabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  const { data: newInvestment, error: investmentError } = await adminSupabase
    .from('user_investments')
    .insert({
      user_id: userId,
      package_id: pkg.id,
      invested_amount: pkg.min_amount,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active',
      package_name: pkg.name,
      daily_profit_percentage: pkg.daily_profit_percentage,
    })
    .select()
    .single()

  if (investmentError) {
    await adminSupabase.from('users').update({ wallet_balance: user.wallet_balance }).eq('id', userId)
    throw new Error(investmentError.message)
  }

  const { data: updatedUser, error: fetchUpdatedUserError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (fetchUpdatedUserError || !updatedUser) {
    throw new Error(fetchUpdatedUserError?.message || 'Failed to fetch updated user data.')
  }

  return updatedUser as User
}

export async function completeDailyTaskAction(userId: string, taskId: number): Promise<User> {
  const { data: user, error: userError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw new Error(userError?.message || 'User not found.')
  }

  const completedTaskCount = user.completed_daily_tasks || 0

  if (completedTaskCount >= taskId) {
    throw new Error('এই টাস্কটি আজই সম্পন্ন করা হয়েছে।')
  }

  const { data: task, error: taskError } = await adminSupabase
    .from('daily_tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (taskError || !task) {
    throw new Error(taskError?.message || 'টাস্ক পাওয়া যায়নি।')
  }

  const newBalance = user.wallet_balance + task.reward_amount
  const updatedCompletedTasks = completedTaskCount + 1

  const { data: updatedUser, error: updateError } = await adminSupabase
    .from('users')
    .update({ wallet_balance: newBalance, completed_daily_tasks: updatedCompletedTasks })
    .eq('id', userId)
    .select()
    .single()

  if (updateError) {
    throw new Error(updateError.message)
  }
  return updatedUser as User
}

export async function claimDailyBonusAction(userId: string): Promise<User> {
  const { data: user, error: userError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw new Error(userError?.message || 'User not found.')
  }

  const today = new Date().toDateString()
  const lastClaimDate = user.last_daily_bonus_claim ? new Date(user.last_daily_bonus_claim).toDateString() : null

  if (lastClaimDate === today) {
    throw new Error('আপনি আজকের দৈনিক বোনাস ইতিমধ্যেই দাবি করেছেন।')
  }

  const bonusAmount = user.daily_bonus_amount || 10

  const { data: updatedUser, error: updateError } = await adminSupabase
    .from('users')
    .update({
      wallet_balance: user.wallet_balance + bonusAmount,
      last_daily_bonus_claim: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  if (updateError) {
    throw new Error(updateError.message)
  }
  return updatedUser as User
}

export async function completeInternTaskAction(userId: string, taskId: number): Promise<User> {
  const { data: user, error: userError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw new Error(userError?.message || 'User not found.')
  }

  const completedTaskCount = user.completed_intern_tasks || 0

  if (completedTaskCount >= taskId) {
    throw new Error('এই ইন্টার্ন টাস্কটি ইতিমধ্যেই সম্পন্ন করা হয়েছে।')
  }

  const { data: task, error: taskError } = await adminSupabase
    .from('intern_tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (taskError || !task) {
    throw new Error(taskError?.message || 'ইন্টার্ন টাস্ক পাওয়া যায়নি।')
  }

  const newBalance = user.wallet_balance + task.reward_amount
  const updatedCompletedTasks = completedTaskCount + 1

  const { data: updatedUser, error: updateError } = await adminSupabase
    .from('users')
    .update({ wallet_balance: newBalance, completed_intern_tasks: updatedCompletedTasks })
    .eq('id', userId)
    .select()
    .single()

  if (updateError) {
    throw new Error(updateError.message)
  }
  return updatedUser as User
}

export async function purchaseProductAction(userId: string, productId: number): Promise<User> {
  const { data: user, error: userError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw new Error(userError?.message || 'User not found.')
  }

  const { data: product, error: productError } = await adminSupabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (productError || !product) {
    throw new Error(productError?.message || 'Product not found.')
  }

  if (product.stock <= 0) {
    throw new Error('এই পণ্যটি স্টকে নেই।')
  }

  if (user.wallet_balance < product.price) {
    throw new Error('অপর্যাপ্ত ব্যালেন্স।')
  }

  const newBalance = user.wallet_balance - product.price
  const newStock = product.stock - 1

  const { error: updateUserError } = await adminSupabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)

  if (updateUserError) {
    throw new Error(updateUserError.message)
  }

  const { error: updateProductError } = await adminSupabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)

  if (updateProductError) {
    await adminSupabase.from('users').update({ wallet_balance: user.wallet_balance }).eq('id', userId)
    throw new Error(updateProductError.message)
  }

  const { error: transactionError } = await adminSupabase.from('transactions').insert({
    user_id: userId,
    type: 'purchase',
    amount: product.price,
    description: `Purchased ${product.name}`,
    date: new Date().toISOString(),
  })
  if (transactionError) {
    console.error('Error recording purchase transaction:', transactionError)
  }

  const { data: updatedUser, error: fetchUpdatedUserError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (fetchUpdatedUserError || !updatedUser) {
    throw new Error(fetchUpdatedUserError?.message || 'Failed to fetch updated user data.')
  }

  return updatedUser as User
}

export async function processWithdrawalAction(userId: string, amount: number, method: string, accountDetails: string): Promise<User> {
  const { data: user, error: userError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw new Error(userError?.message || 'User not found.')
  }

  if (user.wallet_balance < amount) {
    throw new Error('অপর্যাপ্ত ব্যালেন্স।')
  }

  const newBalance = user.wallet_balance - amount

  const { error: updateError } = await adminSupabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  console.log(`Withdrawal request from ${user.email}: ${amount} via ${method} to ${accountDetails}`)

  const { data: updatedUser, error: fetchUpdatedUserError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (fetchUpdatedUserError || !updatedUser) {
    throw new Error(fetchUpdatedUserError?.message || 'Failed to fetch updated user data.')
  }

  return updatedUser as User
}

export async function updateUserSettingsAction(userId: string, settings: Partial<User>): Promise<User> {
  const { data, error } = await adminSupabase
    .from('users')
    .update(settings)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user settings (server):', error)
    throw new Error(error.message)
  }
  return data as User
}

export async function changePasswordAction(userId: string, oldPasswordHash: string, newPasswordHash: string): Promise<User> {
  const { data: user, error: userError } = await adminSupabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    throw new Error(userError?.message || 'User not found.')
  }

  if (user.password_hash !== oldPasswordHash) {
    throw new Error('পুরানো পাসওয়ার্ড ভুল।')
  }

  const { data: updatedUser, error: updateError } = await adminSupabase
    .from('users')
    .update({ password_hash: newPasswordHash })
    .eq('id', userId)
    .select()
    .single()

  if (updateError) {
    console.error('Error changing password (server):', updateError)
    throw new Error(updateError.message)
  }
  return updatedUser as User
}

// Admin Panel Specific Server Actions
export async function getAllUsersAction(): Promise<User[]> {
  const { data, error } = await adminSupabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all users (admin):', error);
    throw new Error(error.message);
  }
  return data as User[];
}

export async function getAllInvestmentsAction(): Promise<UserInvestment[]> {
  const { data, error } = await adminSupabase
    .from('user_investments')
    .select('*, users(email), investment_packages(name)') // Fetch related user email and package name
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching all investments (admin):', error);
    throw new Error(error.message);
  }
  return data as UserInvestment[];
}

export async function getAllTransactionsAction(): Promise<Transaction[]> {
  const { data, error } = await adminSupabase
    .from('transactions')
    .select('*, users(email)') // Fetch related user email
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching all transactions (admin):', error);
    throw new Error(error.message);
  }
  return data as Transaction[];
}

export async function updateInvestmentStatusAction(investmentId: number, status: 'active' | 'completed' | 'cancelled'): Promise<UserInvestment> {
  const { data, error } = await adminSupabase
    .from('user_investments')
    .update({ status })
    .eq('id', investmentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating investment status (admin):', error);
    throw new Error(error.message);
  }
  return data as UserInvestment;
}

export async function deleteUserAction(userId: string): Promise<void> {
  const { error } = await adminSupabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleting user (admin):', error);
    throw new Error(error.message);
  }
}
