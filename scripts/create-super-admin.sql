-- Create super admin user and update admin access system
-- This script creates a super admin user and updates the admin panel to use proper role-based access

-- First, let's create an admin_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_roles
CREATE POLICY "Allow authenticated users to read admin roles" ON admin_roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow service role to manage admin roles" ON admin_roles FOR ALL USING (auth.role() = 'service_role');

-- Create a super admin user (you can change the email to your preferred admin email)
-- Note: This creates a user in the auth.users table and assigns super admin role
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Insert into auth.users (this would normally be done through Supabase Auth)
  -- For demo purposes, we'll create a profile in our users table
  
  -- Create super admin profile in users table
  INSERT INTO users (
    id,
    email,
    name,
    balance,
    level,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    'super-admin-' || gen_random_uuid()::text,
    'superadmin@ajbell.com',
    'Super Administrator',
    999999.99,
    999,
    true,
    NOW(),
    NOW()
  ) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    level = EXCLUDED.level,
    balance = EXCLUDED.balance,
    updated_at = NOW()
  RETURNING id INTO admin_user_id;
  
  -- Assign super admin role
  INSERT INTO admin_roles (user_id, role, permissions) 
  VALUES (
    admin_user_id,
    'super_admin',
    '{"manage_users": true, "manage_packages": true, "manage_products": true, "manage_tasks": true, "view_analytics": true, "system_settings": true}'
  ) ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Super admin user created with ID: %', admin_user_id;
END $$;

-- Create additional admin functions
CREATE OR REPLACE FUNCTION get_user_admin_role(user_id_param UUID)
RETURNS TABLE(role VARCHAR, permissions JSONB) AS $$
BEGIN
  RETURN QUERY
  SELECT ar.role, ar.permissions
  FROM admin_roles ar
  WHERE ar.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM admin_roles
  WHERE user_id = user_id_param AND role IN ('admin', 'super_admin');
  
  RETURN admin_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
