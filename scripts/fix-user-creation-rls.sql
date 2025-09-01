-- Fix RLS policies to allow proper user profile creation
-- This script ensures authenticated users can create and manage their own profiles

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON users;
DROP POLICY IF EXISTS "Allow individual update access" ON users;
DROP POLICY IF EXISTS "Allow public read access" ON users;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for users table
-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admin users to view all profiles (for admin panel)
CREATE POLICY "Admins can view all profiles" ON users
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND role = 'super_admin'
    )
  );

-- Allow admin users to update all profiles (for admin panel)
CREATE POLICY "Admins can update all profiles" ON users
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND role = 'super_admin'
    )
  );

-- Create admin_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_roles (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_roles table
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read admin roles
CREATE POLICY "Allow read admin roles" ON admin_roles
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Insert super admin role
INSERT INTO admin_roles (user_email, role) 
VALUES ('superadmin@ajbell.com', 'super_admin')
ON CONFLICT (user_email) DO UPDATE SET role = 'super_admin';

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to automatically create user profiles
  -- when new users sign up through Supabase Auth
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users TO authenticated;
GRANT ALL ON admin_roles TO authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
