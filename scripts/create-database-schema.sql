-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- In a real app, use Supabase Auth for secure password handling
    balance NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    invested NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    level INT DEFAULT 1 NOT NULL,
    referral_code VARCHAR(10) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id),
    last_daily_bonus_claim TIMESTAMP WITH TIME ZONE,
    daily_bonus_amount NUMERIC(10, 2) DEFAULT 10.00 NOT NULL,
    completed_daily_tasks TEXT[] DEFAULT '{}', -- Array of task IDs completed today (e.g., ["2025-08-08-task-1"])
    completed_intern_tasks TEXT[] DEFAULT '{}', -- Array of intern task IDs completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investment_packages table
CREATE TABLE IF NOT EXISTS investment_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    daily_return_percentage NUMERIC(5, 2) NOT NULL,
    duration_days INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_investments table
CREATE TABLE IF NOT EXISTS user_investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    package_id UUID REFERENCES investment_packages(id) ON DELETE SET NULL,
    package_name VARCHAR(255) NOT NULL, -- Store name in case package is deleted
    invested_amount NUMERIC(10, 2) NOT NULL,
    daily_return NUMERIC(10, 2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL, -- 'active', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table for the product store
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL, -- Price in wallet balance
    image_url TEXT,
    stock INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table (for withdrawals, deposits, purchases, etc.)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'deposit', 'withdraw', 'purchase', 'bonus', 'task_reward', 'investment_return'
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'completed', 'failed', 'cancelled'
    method VARCHAR(100), -- e.g., 'bkash', 'nagad', 'bank', 'wallet'
    account_number VARCHAR(255), -- For withdraw/deposit methods
    reference TEXT, -- Transaction ID from payment gateway or internal reference
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_tasks table (definitions of daily tasks)
CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    reward NUMERIC(10, 2) NOT NULL,
    time_required_minutes INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create intern_tasks table (definitions of intern tasks)
CREATE TABLE IF NOT EXISTS intern_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    reward NUMERIC(10, 2) NOT NULL,
    time_required_minutes INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE intern_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access" ON users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow individual update access" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for investment_packages table
CREATE POLICY "Allow public read access" ON investment_packages FOR SELECT USING (true);

-- RLS Policies for user_investments table
CREATE POLICY "Allow individual read access" ON user_investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert access" ON user_investments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for products table
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- RLS Policies for transactions table
CREATE POLICY "Allow individual read access" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated insert access" ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for daily_tasks table
CREATE POLICY "Allow public read access" ON daily_tasks FOR SELECT USING (true);

-- RLS Policies for intern_tasks table
CREATE POLICY "Allow public read access" ON intern_tasks FOR SELECT USING (true);

-- Optional: Add a function to handle daily investment returns (can be called via a cron job or Supabase function)
CREATE OR REPLACE FUNCTION process_daily_returns()
RETURNS VOID AS $$
BEGIN
    UPDATE users u
    SET balance = u.balance + ui.daily_return
    FROM user_investments ui
    WHERE u.id = ui.user_id
      AND ui.status = 'active'
      AND NOW() BETWEEN ui.start_date AND ui.end_date; -- Only process for active investments within their duration
END;
$$ LANGUAGE plpgsql;

-- Optional: Add a function to update investment status to 'completed'
CREATE OR REPLACE FUNCTION update_investment_status()
RETURNS VOID AS $$
BEGIN
    UPDATE user_investments
    SET status = 'completed'
    WHERE status = 'active' AND NOW() >= end_date;
END;
$$ LANGUAGE plpgsql;
