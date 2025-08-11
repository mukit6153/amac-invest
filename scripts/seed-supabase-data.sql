-- Seed data for 'users' table (example users)
INSERT INTO public.users (id, name, phone_number, password_hash, balance, invested, level, last_login_bonus_date, login_streak)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'আরিফ হোসেন', '01712345678', 'password123', 1500.00, 10000.00, 2, '2025-08-07', 5),
  ('b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'নাসির উদ্দিন', '01812345678', 'securepass', 500.00, 0.00, 1, '2025-08-06', 1),
  ('c2def012-3f4a-5b6c-7d8e-9f0a1b2c3d4e', 'ফারজানা আক্তার', '01912345678', 'mysecret', 2500.00, 25000.00, 3, '2025-08-08', 2);

-- Seed data for 'tasks' table
INSERT INTO public.tasks (title, title_bn, description, description_bn, reward, daily_limit)
VALUES
  ('Daily Check-in', 'দৈনিক চেক-ইন', 'Log in daily to earn bonus.', 'বোনাস পেতে প্রতিদিন লগইন করুন।', 50.00, 1),
  ('Watch Ad', 'বিজ্ঞাপন দেখুন', 'Watch a short advertisement.', 'একটি ছোট বিজ্ঞাপন দেখুন।', 20.00, 5),
  ('Complete Survey', 'জরিপ সম্পন্ন করুন', 'Complete a quick survey.', 'একটি দ্রুত জরিপ সম্পন্ন করুন।', 100.00, 1),
  ('Share on Social Media', 'সোশ্যাল মিডিয়ায় শেয়ার করুন', 'Share our app on your social media.', 'আমাদের অ্যাপ আপনার সোশ্যাল মিডিয়ায় শেয়ার করুন।', 30.00, 1);

-- Seed data for 'products' table
INSERT INTO public.products (name, name_bn, price, image_url, description, description_bn, stock)
VALUES
  ('Smartphone', 'স্মার্টফোন', 25000.00, '/placeholder.svg?height=150&width=150&text=Smartphone', 'Latest model smartphone with advanced features.', 'উন্নত বৈশিষ্ট্য সহ সর্বশেষ মডেলের স্মার্টফোন।', 10),
  ('Wireless Headphones', 'ওয়্যারলেস হেডফোন', 5000.00, '/placeholder.svg?height=150&width=150&text=Headphones', 'High-quality sound and comfortable design.', 'উচ্চ মানের শব্দ এবং আরামদায়ক ডিজাইন।', 25),
  ('Smartwatch', 'স্মার্টওয়াচ', 10000.00, '/placeholder.svg?height=150&width=150&text=Smartwatch', 'Track your fitness and receive notifications.', 'আপনার ফিটনেস ট্র্যাক করুন এবং বিজ্ঞপ্তি পান।', 15),
  ('Laptop', 'ল্যাপটপ', 60000.00, '/placeholder.svg?height=150&width=150&text=Laptop', 'Powerful laptop for work and entertainment.', 'কাজ এবং বিনোদনের জন্য শক্তিশালী ল্যাপটপ।', 5);

-- Seed data for 'investments' table (example investments)
INSERT INTO public.investments (user_id, package_name, amount, daily_return_rate, duration_days, start_date, end_date, status)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Starter', 10000.00, 0.03, 30, '2025-08-01', '2025-08-31', 'active'),
  ('c2def012-3f4a-5b6c-7d8e-9f0a1b2c3d4e', 'Premium', 25000.00, 0.04, 45, '2025-07-15', '2025-08-29', 'active');

-- Seed data for 'transactions' table (example transactions)
INSERT INTO public.transactions (user_id, type, amount, description)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'deposit', 10000.00, 'Initial deposit for investment'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'task_reward', 50.00, 'Daily check-in reward'),
  ('b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'deposit', 500.00, 'Initial deposit');

-- Seed data for 'referrals' table
INSERT INTO public.referrals (referrer_id, referred_id, commission_earned, status)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 50.00, 'completed');

-- This file is superseded by seed-initial-data.sql and is kept for historical context.
-- Please refer to scripts/seed-initial-data.sql for the most up-to-date seed data.
