-- This file is superseded by create-database-schema.sql and is kept for historical context.
-- Please refer to scripts/create-database-schema.sql for the most up-to-date schema.

-- Create the 'users' table
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone_number text UNIQUE NOT NULL,
  password_hash text NOT NULL, -- Store hashed passwords, not plain text
  balance numeric DEFAULT 0 NOT NULL,
  invested numeric DEFAULT 0 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  last_login_bonus_date date,
  login_streak integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'tasks' table
CREATE TABLE public.tasks (
  id serial PRIMARY KEY,
  title text NOT NULL,
  title_bn text NOT NULL,
  description text,
  description_bn text,
  reward numeric NOT NULL,
  daily_limit integer DEFAULT 1 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'user_tasks' table to track task completions by users
CREATE TABLE public.user_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  task_id integer REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  completion_date date NOT NULL DEFAULT current_date,
  completed_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, task_id, completion_date) -- Ensure a user can complete a specific task only once per day
);

-- Create the 'investments' table
CREATE TABLE public.investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  package_name text NOT NULL,
  amount numeric NOT NULL,
  daily_return_rate numeric NOT NULL,
  duration_days integer NOT NULL,
  start_date date NOT NULL DEFAULT current_date,
  end_date date NOT NULL,
  status text DEFAULT 'active' NOT NULL, -- active, completed, cancelled
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'transactions' table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- e.g., 'deposit', 'withdraw', 'task_reward', 'investment_payout', 'bonus', 'purchase'
  amount numeric NOT NULL,
  status text DEFAULT 'completed' NOT NULL, -- e.g., 'pending', 'completed', 'failed'
  description text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'products' table for the store
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_bn text NOT NULL,
  price numeric NOT NULL,
  image_url text,
  description text,
  description_bn text,
  stock integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'orders' table for product purchases
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL, -- RESTRICT to prevent deleting products with active orders
  quantity integer NOT NULL DEFAULT 1,
  total_amount numeric NOT NULL,
  order_status text DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'shipped', 'delivered', 'cancelled'
  shipping_address text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'referrals' table
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  referred_id uuid UNIQUE REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  commission_earned numeric DEFAULT 0 NOT NULL,
  status text DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'completed'
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'users' table
CREATE POLICY "Allow read access to all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to insert" ON public.users FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for 'tasks' table
CREATE POLICY "Allow read access to all tasks" ON public.tasks FOR SELECT USING (true);

-- RLS Policies for 'user_tasks' table
CREATE POLICY "Allow users to read their own task completions" ON public.user_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own task completions" ON public.user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for 'investments' table
CREATE POLICY "Allow users to read their own investments" ON public.investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own investments" ON public.investments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for 'transactions' table
CREATE POLICY "Allow users to read their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for 'products' table
CREATE POLICY "Allow read access to all products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to read their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for 'referrals' table
CREATE POLICY "Allow users to read their own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Allow authenticated users to insert referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referred_id);

-- Optional: Add a function to get user ID from auth.uid() if needed in policies
-- This is usually handled by Supabase's built-in auth.uid()
