-- Create super admin user directly in database
-- This ensures the super admin exists even if auth signup fails

-- First, create admin_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS on admin_roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_roles
DROP POLICY IF EXISTS "Admin roles are viewable by authenticated users" ON admin_roles;
CREATE POLICY "Admin roles are viewable by authenticated users" ON admin_roles
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin roles are manageable by super admins" ON admin_roles;
CREATE POLICY "Admin roles are manageable by super admins" ON admin_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'superadmin@ajbell.com'
        )
    );

-- Create a function to handle super admin creation
CREATE OR REPLACE FUNCTION create_super_admin_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    super_admin_id UUID;
BEGIN
    -- Check if super admin already exists in auth.users
    SELECT id INTO super_admin_id 
    FROM auth.users 
    WHERE email = 'superadmin@ajbell.com' 
    LIMIT 1;
    
    -- If super admin exists in auth but not in users table, create profile
    IF super_admin_id IS NOT NULL THEN
        INSERT INTO users (
            id,
            name,
            email,
            balance,
            invested,
            earned,
            level,
            referral_code,
            referred_by,
            phone,
            total_referrals,
            is_active,
            login_streak,
            last_login,
            password_hash,
            created_at,
            updated_at
        ) VALUES (
            super_admin_id,
            'Super Administrator',
            'superadmin@ajbell.com',
            999999.99,
            0,
            0,
            999,
            'SUPERADMIN',
            NULL,
            NULL,
            0,
            true,
            0,
            NOW(),
            '', -- Empty since we use Supabase auth
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            balance = EXCLUDED.balance,
            level = EXCLUDED.level,
            referral_code = EXCLUDED.referral_code,
            is_active = EXCLUDED.is_active,
            updated_at = NOW();
            
        -- Create admin role entry
        INSERT INTO admin_roles (
            user_id,
            role,
            permissions,
            created_at,
            updated_at
        ) VALUES (
            super_admin_id,
            'super_admin',
            '{
                "manage_users": true,
                "manage_packages": true,
                "manage_products": true,
                "manage_tasks": true,
                "view_analytics": true,
                "system_settings": true
            }'::jsonb,
            NOW(),
            NOW()
        ) ON CONFLICT (user_id) DO UPDATE SET
            role = EXCLUDED.role,
            permissions = EXCLUDED.permissions,
            updated_at = NOW();
            
        RAISE NOTICE 'Super admin profile updated for existing auth user';
    ELSE
        RAISE NOTICE 'Super admin not found in auth.users - will be created on first login';
    END IF;
END;
$$;

-- Execute the function
SELECT create_super_admin_profile();

-- Create demo user profile function
CREATE OR REPLACE FUNCTION create_demo_user_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Check if demo user already exists in auth.users
    SELECT id INTO demo_user_id 
    FROM auth.users 
    WHERE email = 'demo@example.com' 
    LIMIT 1;
    
    -- If demo user exists in auth but not in users table, create profile
    IF demo_user_id IS NOT NULL THEN
        INSERT INTO users (
            id,
            name,
            email,
            balance,
            invested,
            earned,
            level,
            referral_code,
            referred_by,
            phone,
            total_referrals,
            is_active,
            login_streak,
            last_login,
            password_hash,
            created_at,
            updated_at
        ) VALUES (
            demo_user_id,
            'Demo User',
            'demo@example.com',
            1000.00,
            0,
            0,
            1,
            'DEMO123',
            NULL,
            NULL,
            0,
            true,
            0,
            NOW(),
            '', -- Empty since we use Supabase auth
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            balance = EXCLUDED.balance,
            is_active = EXCLUDED.is_active,
            updated_at = NOW();
            
        RAISE NOTICE 'Demo user profile updated for existing auth user';
    ELSE
        RAISE NOTICE 'Demo user not found in auth.users - will be created on first login';
    END IF;
END;
$$;

-- Execute the demo user function
SELECT create_demo_user_profile();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_roles;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE investments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMIT;
