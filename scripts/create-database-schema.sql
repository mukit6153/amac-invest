-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  wallet_pin VARCHAR(10) NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0,
  bonus_balance DECIMAL(12,2) DEFAULT 0,
  locked_balance DECIMAL(12,2) DEFAULT 0,
  total_invested DECIMAL(12,2) DEFAULT 0,
  total_earned DECIMAL(12,2) DEFAULT 0,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id),
  login_streak INTEGER DEFAULT 0,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment packages table
CREATE TABLE investment_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  name_bn VARCHAR(100) NOT NULL,
  min_amount DECIMAL(12,2) NOT NULL,
  max_amount DECIMAL(12,2) NOT NULL,
  daily_rate DECIMAL(5,2) NOT NULL,
  total_days INTEGER NOT NULL,
  total_return_rate DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  icon VARCHAR(50) DEFAULT '💎',
  color VARCHAR(50) DEFAULT 'blue',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments table
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES investment_packages(id),
  amount DECIMAL(12,2) NOT NULL,
  daily_return DECIMAL(12,2) NOT NULL,
  total_return DECIMAL(12,2) NOT NULL,
  days_completed INTEGER DEFAULT 0,
  total_days INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  next_payment TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdraw', 'investment', 'return', 'bonus', 'referral')),
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  method VARCHAR(50),
  account_number VARCHAR(100),
  description TEXT NOT NULL,
  reference VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  title_bn VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  description_bn TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'video', 'survey', 'referral', 'social')),
  reward DECIMAL(12,2) NOT NULL,
  requirement TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  icon VARCHAR(50) DEFAULT '✅',
  color VARCHAR(50) DEFAULT 'green',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tasks table
CREATE TABLE user_tasks (
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
CREATE TABLE spin_wheels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'premium', 'mega')),
  prize_amount DECIMAL(12,2) NOT NULL,
  prize_type VARCHAR(20) DEFAULT 'cash' CHECK (prize_type IN ('cash', 'bonus', 'points')),
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
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
CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  title_bn VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  description_bn TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'premium', 'special')),
  reward DECIMAL(12,2) NOT NULL,
  requirement TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  icon VARCHAR(50) DEFAULT '🎁',
  color VARCHAR(50) DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User gifts table
CREATE TABLE user_gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'claimed',
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, gift_id)
);

-- Referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_earned DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Banners table
CREATE TABLE banners (
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
CREATE TABLE notifications (
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

-- Admin settings table
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_status ON user_tasks(status);
CREATE INDEX idx_spin_wheels_user_id ON spin_wheels(user_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Create function for referral bonus
CREATE OR REPLACE FUNCTION add_referral_bonus(
  referrer_id UUID,
  referred_id UUID,
  bonus_amount DECIMAL
) RETURNS VOID AS $$
BEGIN
  -- Add bonus to referrer
  UPDATE users 
  SET bonus_balance = bonus_balance + bonus_amount,
      updated_at = NOW()
  WHERE id = referrer_id;
  
  -- Create transaction record
  INSERT INTO transactions (user_id, type, amount, status, description)
  VALUES (referrer_id, 'referral', bonus_amount, 'completed', 'রেফারেল বোনাস');
  
  -- Update referral earnings
  UPDATE referrals 
  SET total_earned = total_earned + bonus_amount
  WHERE referrer_id = referrer_id AND referred_id = referred_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to process daily returns
CREATE OR REPLACE FUNCTION process_daily_returns() RETURNS VOID AS $$
DECLARE
  investment_record RECORD;
  return_amount DECIMAL;
BEGIN
  FOR investment_record IN 
      SELECT i.*, u.id as user_id
      FROM investments i
      JOIN users u ON i.user_id = u.id
      WHERE i.status = 'active' 
      AND i.next_payment <= NOW()
      AND i.days_completed < i.total_days
  LOOP
      return_amount := investment_record.daily_return;
      
      -- Add return to user balance
      UPDATE users 
      SET balance = balance + return_amount,
          total_earned = total_earned + return_amount,
          updated_at = NOW()
      WHERE id = investment_record.user_id;
      
      -- Create transaction record
      INSERT INTO transactions (user_id, type, amount, status, description)
      VALUES (investment_record.user_id, 'return', return_amount, 'completed', 
              'দৈনিক বিনিয়োগ রিটার্ন');
      
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE spin_wheels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - adjust based on your auth system)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Users can view own investments" ON investments FOR SELECT USING (true);
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Users can view own tasks" ON user_tasks FOR SELECT USING (true);
CREATE POLICY "Users can view own spins" ON spin_wheels FOR SELECT USING (true);
CREATE POLICY "Users can view own gifts" ON user_gifts FOR SELECT USING (true);
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (true);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (true);

-- Allow inserts for authenticated users
CREATE POLICY "Allow inserts" ON investments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow inserts" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow inserts" ON user_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow inserts" ON spin_wheels FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow inserts" ON user_gifts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow inserts" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow inserts" ON notifications FOR INSERT WITH CHECK (true);
