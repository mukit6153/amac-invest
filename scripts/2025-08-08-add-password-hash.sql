-- This script is for adding a password_hash column if it didn't exist.
-- If it already exists from create-supabase-schema.sql, this script will do nothing or error if column types conflict.
-- It's generally safer to manage schema changes with migrations.
-- This file is superseded by create-database-schema.sql which includes password_hash.
-- This is kept for historical context.

DO $$
BEGIN
    -- Check if the column 'password_hash' exists in 'users' table
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'password_hash'
    ) THEN
        -- Add the column if it does not exist
        ALTER TABLE public.users
        ADD COLUMN password_hash text;

        -- Update existing rows with a placeholder or null if needed
        -- For a real application, you would need a strategy to set this for existing users
        -- For this demo, we assume new users will have it set on signup.
        UPDATE public.users
        SET password_hash = 'default_hashed_password'
        WHERE password_hash IS NULL;

        -- Make the column NOT NULL after updating existing data
        ALTER TABLE public.users
        ALTER COLUMN password_hash SET NOT NULL;

        RAISE NOTICE 'Column password_hash added to public.users table.';
    ELSE
        RAISE NOTICE 'Column password_hash already exists in public.users table. No action taken.';
    END IF;
END $$;
