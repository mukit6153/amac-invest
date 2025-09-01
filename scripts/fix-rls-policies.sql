-- Fix RLS policies for users table to allow proper authentication
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow public read access" ON users;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON users;
DROP POLICY IF EXISTS "Allow individual update access" ON users;
DROP POLICY IF EXISTS "Allow super admin access" ON users;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to manage all users (for admin operations)
CREATE POLICY "Service role can manage all users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Create admin_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  permissions jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_roles table
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own role
CREATE POLICY "Users can view own role" ON admin_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to manage all roles
CREATE POLICY "Service role can manage roles" ON admin_roles
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to insert their own role
CREATE POLICY "Users can insert own role" ON admin_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_roles;

-- Add RLS policies for other important tables if they exist
-- Transactions table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions') THEN
    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
    DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
    DROP POLICY IF EXISTS "Service role can manage transactions" ON transactions;
    
    CREATE POLICY "Users can view own transactions" ON transactions
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert own transactions" ON transactions
      FOR INSERT WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Service role can manage transactions" ON transactions
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
  END IF;
END $$;

-- User investments table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_investments') THEN
    ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own investments" ON user_investments;
    DROP POLICY IF EXISTS "Users can insert own investments" ON user_investments;
    DROP POLICY IF EXISTS "Service role can manage investments" ON user_investments;
    
    CREATE POLICY "Users can view own investments" ON user_investments
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert own investments" ON user_investments
      FOR INSERT WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Service role can manage investments" ON user_investments
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE user_investments;
  END IF;
END $$;

-- Daily tasks table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'daily_tasks') THEN
    ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to daily tasks" ON daily_tasks;
    DROP POLICY IF EXISTS "Service role can manage daily tasks" ON daily_tasks;
    
    CREATE POLICY "Allow public read access to daily tasks" ON daily_tasks
      FOR SELECT USING (true);
      
    CREATE POLICY "Service role can manage daily tasks" ON daily_tasks
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE daily_tasks;
  END IF;
END $$;

-- Intern tasks table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'intern_tasks') THEN
    ALTER TABLE intern_tasks ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to intern tasks" ON intern_tasks;
    DROP POLICY IF EXISTS "Service role can manage intern tasks" ON intern_tasks;
    
    CREATE POLICY "Allow public read access to intern tasks" ON intern_tasks
      FOR SELECT USING (true);
      
    CREATE POLICY "Service role can manage intern tasks" ON intern_tasks
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE intern_tasks;
  END IF;
END $$;

-- Investment packages table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'investment_packages') THEN
    ALTER TABLE investment_packages ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to packages" ON investment_packages;
    DROP POLICY IF EXISTS "Service role can manage packages" ON investment_packages;
    
    CREATE POLICY "Allow public read access to packages" ON investment_packages
      FOR SELECT USING (true);
      
    CREATE POLICY "Service role can manage packages" ON investment_packages
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE investment_packages;
  END IF;
END $$;

-- Products table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to products" ON products;
    DROP POLICY IF EXISTS "Service role can manage products" ON products;
    
    CREATE POLICY "Allow public read access to products" ON products
      FOR SELECT USING (true);
      
    CREATE POLICY "Service role can manage products" ON products
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
  END IF;
END $$;

-- Notifications table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
    DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
    DROP POLICY IF EXISTS "Service role can manage notifications" ON notifications;
    
    CREATE POLICY "Users can view own notifications" ON notifications
      FOR SELECT USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can insert own notifications" ON notifications
      FOR INSERT WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Service role can manage notifications" ON notifications
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

-- Events table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
    ALTER TABLE events ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to events" ON events;
    DROP POLICY IF EXISTS "Service role can manage events" ON events;
    
    CREATE POLICY "Allow public read access to events" ON events
      FOR SELECT USING (true);
      
    CREATE POLICY "Service role can manage events" ON events
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE events;
  END IF;
END $$;

-- Gifts table
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gifts') THEN
    ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to gifts" ON gifts;
    DROP POLICY IF EXISTS "Service role can manage gifts" ON gifts;
    
    CREATE POLICY "Allow public read access to gifts" ON gifts
      FOR SELECT USING (true);
      
    CREATE POLICY "Service role can manage gifts" ON gifts
      FOR ALL USING (auth.role() = 'service_role');
      
    ALTER PUBLICATION supabase_realtime ADD TABLE gifts;
  END IF;
END $$;

-- Create function to check if user is admin by email
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT CASE 
      WHEN auth.jwt() ->> 'email' = 'superadmin@ajbell.com' THEN true
      WHEN EXISTS (
        SELECT 1 FROM admin_roles ar 
        JOIN users u ON ar.user_id = u.id 
        WHERE u.id = auth.uid() AND ar.role IN ('admin', 'super_admin')
      ) THEN true
      ELSE false
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_user() TO anon;

-- Add admin policies using the function
CREATE POLICY "Admin users can manage all users" ON users
  FOR ALL USING (is_admin_user());

CREATE POLICY "Admin users can manage all admin roles" ON admin_roles
  FOR ALL USING (is_admin_user());
