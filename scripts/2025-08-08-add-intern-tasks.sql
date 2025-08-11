-- This script is for adding the daily_limit column to the tasks table
-- and ensuring the user_tasks table has a unique constraint for daily completions.
-- This file is superseded by create-database-schema.sql which includes intern_tasks.
-- This is kept for historical context.

DO $$
BEGIN
    -- Add daily_limit column to tasks table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'tasks'
        AND column_name = 'daily_limit'
    ) THEN
        ALTER TABLE public.tasks
        ADD COLUMN daily_limit integer DEFAULT 1 NOT NULL;
        RAISE NOTICE 'Column daily_limit added to public.tasks table.';
    ELSE
        RAISE NOTICE 'Column daily_limit already exists in public.tasks table. No action taken.';
    END IF;

    -- Add unique constraint to user_tasks for daily completion if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'user_tasks_user_id_task_id_completion_date_key'
        AND conrelid = 'public.user_tasks'::regclass
    ) THEN
        ALTER TABLE public.user_tasks
        ADD CONSTRAINT user_tasks_user_id_task_id_completion_date_key UNIQUE (user_id, task_id, completion_date);
        RAISE NOTICE 'Unique constraint added to public.user_tasks table.';
    ELSE
        RAISE NOTICE 'Unique constraint already exists on public.user_tasks table. No action taken.';
    END IF;
END $$;
