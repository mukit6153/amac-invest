-- Add missing columns to the users table
DO $$
BEGIN
    -- Add last_daily_bonus_claim if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_daily_bonus_claim') THEN
        ALTER TABLE users ADD COLUMN last_daily_bonus_claim TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add daily_bonus_amount if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='daily_bonus_amount') THEN
        ALTER TABLE users ADD COLUMN daily_bonus_amount NUMERIC DEFAULT 10;
    END IF;

    -- Add completed_daily_tasks if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='completed_daily_tasks') THEN
        ALTER TABLE users ADD COLUMN completed_daily_tasks INTEGER DEFAULT 0;
    END IF;

    -- Add completed_intern_tasks if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='completed_intern_tasks') THEN
        ALTER TABLE users ADD COLUMN completed_intern_tasks INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Add video_url column to intern_tasks table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='intern_tasks' AND column_name='video_url') THEN
        ALTER TABLE intern_tasks ADD COLUMN video_url TEXT;
    END IF;
END
$$;
