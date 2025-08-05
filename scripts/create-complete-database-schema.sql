-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    wallet_pin VARCHAR(6) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0,
    bonus_balance DECIMAL(15,2) DEFAULT 0,
    locked_balance DECIMAL(15,2) DEFAULT 0,
    total_invested DECIMAL(15,2) DEFAULT 0,
    total_earned DECIMAL(15,2) DEFAULT 0,
    referral_code VARCHAR(10) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id),
    login_streak INTEGER DEFAULT 1,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment packages table
CREATE TABLE IF NOT EXISTS investment_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_rate DECIMAL(5,2) NOT NULL,
    total_days INTEGER NOT NULL,
    total_return_rate DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    icon VARCHAR(50),
    color VARCHAR(50),
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES investment_packages(id),
    amount DECIMAL(15,2) NOT NULL,
    daily_return DECIMAL(15,2) NOT NULL,
    total_return DECIMAL(15,2) NOT NULL,
    days_completed INTEGER DEFAULT 0,
    total_days INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    next_payment TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdraw', 'investment', 'return', 'bonus', 'referral')),
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    method VARCHAR(50),
    account_number VARCHAR(100),
    description TEXT NOT NULL,
    reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'video', 'survey', 'referral', 'social')),
    reward DECIMAL(15,2) NOT NULL,
    requirement TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    icon VARCHAR(50),
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tasks table
CREATE TABLE IF NOT EXISTS user_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'claimed')),
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

-- Spin wheels table
CREATE TABLE IF NOT EXISTS spin_wheels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'premium', 'mega')),
    prize_amount DECIMAL(15,2) NOT NULL,
    prize_type VARCHAR(20) NOT NULL CHECK (prize_type IN ('cash', 'bonus', 'points')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('bonus', 'referral', 'task', 'investment')),
    reward VARCHAR(100) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    participants INTEGER DEFAULT 0,
    max_participants INTEGER,
    banner_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gifts table
CREATE TABLE IF NOT EXISTS gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'premium', 'special')),
    reward DECIMAL(15,2) NOT NULL,
    requirement TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    icon VARCHAR(50),
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User gifts table
CREATE TABLE IF NOT EXISTS user_gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'claimed' CHECK (status IN ('claimed')),
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, gift_id)
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1,
    commission_rate DECIMAL(5,2) NOT NULL,
    total_earned DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referrer_id, referred_id)
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200) NOT NULL,
    description TEXT,
    description_bn TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    message_bn TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE spin_wheels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples - adjust based on your auth system)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Users can view own investments" ON investments FOR SELECT USING (true);
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Users can view own tasks" ON user_tasks FOR SELECT USING (true);
CREATE POLICY "Users can view own spins" ON spin_wheels FOR SELECT USING (true);
CREATE POLICY "Users can view own gifts" ON user_gifts FOR SELECT USING (true);
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (true);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (true);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION add_referral_bonus(referrer_id UUID, referred_id UUID, bonus_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET bonus_balance = bonus_balance + bonus_amount,
        updated_at = NOW()
    WHERE id = referrer_id;
    
    INSERT INTO transactions (user_id, type, amount, status, description)
    VALUES (referrer_id, 'referral', bonus_amount, 'completed', 'Referral bonus');
END;
$$ LANGUAGE plpgsql;

-- Function to process daily returns
CREATE OR REPLACE FUNCTION process_daily_returns()
RETURNS VOID AS $$
DECLARE
    investment_record RECORD;
BEGIN
    FOR investment_record IN 
        SELECT * FROM investments 
        WHERE status = 'active' 
        AND next_payment <= NOW()
    LOOP
        -- Add daily return to user balance
        UPDATE users 
        SET balance = balance + investment_record.daily_return,
            total_earned = total_earned + investment_record.daily_return,
            updated_at = NOW()
        WHERE id = investment_record.user_id;
        
        -- Create transaction record
        INSERT INTO transactions (user_id, type, amount, status, description)
        VALUES (
            investment_record.user_id, 
            'return', 
            investment_record.daily_return, 
            'completed', 
            'Daily investment return'
        );
        
        -- Update investment
        UPDATE investments 
        SET days_completed = days_completed + 1,
            next_payment = CASE 
                WHEN days_completed + 1 >= total_days THEN NULL
                ELSE next_payment + INTERVAL '1 day'
            END,
            status = CASE 
                WHEN days_completed + 1 >= total_days THEN 'completed'
                ELSE 'active'
            END,
            updated_at = NOW()
        WHERE id = investment_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
