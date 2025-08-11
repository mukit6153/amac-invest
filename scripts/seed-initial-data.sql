-- Insert sample users
INSERT INTO users (id, phone, name, email, wallet_pin, password, balance, bonus_balance, total_invested, total_earned, referral_code, login_streak, kyc_status, status, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', '01712345678', 'রহিম আহমেদ', 'rahim@example.com', '1234', 'password123', 5000.00, 500.00, 10000.00, 2500.00, 'AJ001', 5, 'approved', 'active', 'user'),
('550e8400-e29b-41d4-a716-446655440001', '01812345679', 'করিম হোসেন', 'karim@example.com', '5678', 'password123', 3000.00, 300.00, 5000.00, 1200.00, 'AJ002', 3, 'approved', 'active', 'user'),
('550e8400-e29b-41d4-a716-446655440002', '01912345680', 'ফাতেমা খাতুন', 'fatema@example.com', '9012', 'password123', 8000.00, 800.00, 15000.00, 4000.00, 'AJ003', 7, 'approved', 'active', 'user'),
('550e8400-e29b-41d4-a716-446655440003', '01612345681', 'আব্দুল্লাহ', 'abdullah@example.com', '3456', 'password123', 2000.00, 200.00, 3000.00, 800.00, 'AJ004', 2, 'pending', 'active', 'user'),
('550e8400-e29b-41d4-a716-446655440004', '01512345682', 'Admin User', 'admin@ajbell.com', '0000', 'admin123', 100000.00, 10000.00, 0.00, 0.00, 'ADMIN', 1, 'approved', 'active', 'admin'),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'টেস্ট ইউজার', 'test@example.com', 'password123', 1000.00, 0.00, 1, 'AMAC1234', 10.00),
('admin_user_id_123', 'অ্যাডমিন', 'admin@example.com', 'adminpass', 99999.00, 0.00, 100, 'ADMIN001', 50.00)
ON CONFLICT (id) DO NOTHING;

-- Insert investment packages
INSERT INTO investment_packages (id, name, description, price, daily_return_percentage, duration_days)
VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Starter Package', 'স্টার্টার প্যাকেজ', 500.00, 2.50, 30),
('660e8400-e29b-41d4-a716-446655440001', 'Silver Package', 'সিলভার প্যাকেজ', 2000.00, 3.00, 45),
('660e8400-e29b-41d4-a716-446655440002', 'Gold Package', 'গোল্ড প্যাকেজ', 5000.00, 3.50, 60),
('660e8400-e29b-41d4-a716-446655440003', 'Platinum Package', 'প্ল্যাটিনাম প্যাকেজ', 10000.00, 4.00, 90),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'স্টার্টার প্যাকেজ', 'ছোট বিনিয়োগকারীদের জন্য আদর্শ।', 500.00, 3.00, 30),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'সিলভার প্যাকেজ', 'মাঝারি বিনিয়োগের জন্য উপযুক্ত।', 2000.00, 4.00, 45),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'গোল্ড প্যাকেজ', 'উচ্চ রিটার্নের জন্য সেরা বিকল্প।', 5000.00, 5.00, 60),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'প্লাটিনাম প্যাকেজ', 'সর্বোচ্চ রিটার্ন এবং সুবিধা।', 10000.00, 6.00, 90)
ON CONFLICT (id) DO NOTHING;

-- Insert sample investments
INSERT INTO investments (id, user_id, package_id, amount, daily_return, total_return, days_completed, total_days, status, next_payment) VALUES
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 5000.00, 150.00, 6750.00, 15, 45, 'active', NOW() + INTERVAL '1 day'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 1000.00, 25.00, 750.00, 20, 30, 'active', NOW() + INTERVAL '1 day'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 15000.00, 525.00, 31500.00, 30, 60, 'active', NOW() + INTERVAL '1 day');

-- Insert sample transactions
INSERT INTO transactions (id, user_id, type, amount, status, description) VALUES
('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'deposit', 10000.00, 'completed', 'বিকাশ থেকে জমা'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'investment', 5000.00, 'completed', 'সিলভার প্যাকেজে বিনিয়োগ'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'return', 150.00, 'completed', 'দৈনিক বিনিয়োগ রিটার্ন'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'bonus', 50.00, 'completed', 'দৈনিক লগইন বোনাস'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'withdraw', 2000.00, 'pending', 'নগদ এ উইথড্র');

-- Insert sample tasks
INSERT INTO tasks (id, title, title_bn, description, description_bn, type, reward, requirement, status, icon, color) VALUES
('990e8400-e29b-41d4-a716-446655440000', 'Daily Check-in', 'দৈনিক চেক-ইন', 'Check in daily to earn bonus', 'দৈনিক চেক-ইন করে বোনাস অর্জন করুন', 'daily', 20.00, 'Login daily', 'active', '✅', 'green'),
('990e8400-e29b-41d4-a716-446655440001', 'Watch Video', 'ভিডিও দেখুন', 'Watch promotional video', 'প্রমোশনাল ভিডিও দেখুন', 'video', 30.00, 'Watch 2 minutes video', 'active', '📺', 'blue'),
('990e8400-e29b-41d4-a716-446655440002', 'Share App', 'অ্যাপ শেয়ার করুন', 'Share app with friends', 'বন্ধুদের সাথে অ্যাপ শেয়ার করুন', 'social', 50.00, 'Share app link', 'active', '📤', 'purple'),
('990e8400-e29b-41d4-a716-446655440003', 'Complete Survey', 'সার্ভে সম্পন্ন করুন', 'Complete user feedback survey', 'ব্যবহারকারী ফিডব্যাক সার্ভে সম্পন্ন করুন', 'survey', 100.00, 'Fill survey form', 'active', '📋', 'orange'),
('990e8400-e29b-41d4-a716-446655440004', 'Refer Friend', 'বন্ধু রেফার করুন', 'Refer a new user', 'নতুন ব্যবহারকারী রেফার করুন', 'referral', 200.00, 'Successful referral', 'active', '👥', 'pink'),
('task-1', 'ভিডিও দেখুন', 'একটি বিজ্ঞাপন ভিডিও দেখুন এবং পুরস্কার পান।', 5.00, 1, TRUE),
('task-2', 'অ্যাপ শেয়ার করুন', 'আপনার বন্ধুদের সাথে অ্যাপটি শেয়ার করুন।', 10.00, 2, TRUE),
('task-3', 'প্রোফাইল আপডেট করুন', 'আপনার প্রোফাইল তথ্য আপডেট করুন।', 7.00, 3, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (id, title, title_bn, description, description_bn, type, reward, start_date, end_date, status, participants, max_participants) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', 'New Year Bonus', 'নববর্ষ বোনাস', 'Special bonus for new year', 'নববর্ষের জন্য বিশেষ বোনাস', 'bonus', '500 টাকা বোনাস', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', 'active', 150, 1000),
('aa0e8400-e29b-41d4-a716-446655440001', 'Investment Challenge', 'বিনিয়োগ চ্যালেঞ্জ', 'Invest and win extra rewards', 'বিনিয়োগ করুন এবং অতিরিক্ত পুরস্কার জিতুন', 'investment', '10% অতিরিক্ত রিটার্ন', NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', 'active', 75, 500),
('aa0e8400-e29b-41d4-a716-446655440002', 'Referral Contest', 'রেফারেল প্রতিযোগিতা', 'Refer most users and win', 'সবচেয়ে বেশি ব্যবহারকারী রেফার করুন এবং জিতুন', 'referral', '5000 টাকা পুরস্কার', NOW() + INTERVAL '1 day', NOW() + INTERVAL '31 days', 'upcoming', 0, 100);

-- Insert sample gifts
INSERT INTO gifts (id, title, title_bn, description, description_bn, type, reward, requirement, status, icon, color) VALUES
('bb0e8400-e29b-41d4-a716-446655440000', 'Daily Gift', 'দৈনিক গিফট', 'Free daily gift for all users', 'সকল ব্যবহারকারীর জন্য বিনামূল্যে দৈনিক গিফট', 'daily', 25.00, 'Login daily', 'active', '🎁', 'yellow'),
('bb0e8400-e29b-41d4-a716-446655440001', 'Weekly Surprise', 'সাপ্তাহিক সারপ্রাইজ', 'Special weekly gift', 'বিশেষ সাপ্তাহিক গিফট', 'premium', 100.00, 'Login 7 days straight', 'active', '🎉', 'purple'),
('bb0e8400-e29b-41d4-a716-446655440002', 'VIP Bonus', 'ভিআইপি বোনাস', 'Exclusive gift for VIP users', 'ভিআইপি ব্যবহারকারীদের জন্য এক্সক্লুসিভ গিফট', 'special', 500.00, 'Invest 50000+ taka', 'active', '👑', 'gold');

-- Insert sample banners
INSERT INTO banners (id, title, title_bn, description, description_bn, image_url, status, order_index) VALUES
('cc0e8400-e29b-41d4-a716-446655440000', 'Welcome to AJBell', 'AJBell এ স্বাগতম', 'Start your investment journey today', 'আজই আপনার বিনিয়োগ যাত্রা শুরু করুন', '/placeholder.svg?height=200&width=400&text=Welcome+Banner', 'active', 1),
('cc0e8400-e29b-41d4-a716-446655440001', 'High Returns', 'উচ্চ রিটার্ন', 'Get up to 4.5% daily returns', 'দৈনিক ৪.৫% পর্যন্ত রিটার্ন পান', '/placeholder.svg?height=200&width=400&text=High+Returns', 'active', 2),
('cc0e8400-e29b-41d4-a716-446655440002', 'Refer & Earn', 'রেফার করুন ও আয় করুন', 'Earn bonus by referring friends', 'বন্ধুদের রেফার করে বোনাস অর্জন করুন', '/placeholder.svg?height=200&width=400&text=Refer+Earn', 'active', 3);

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, title_bn, message, message_bn, type, read) VALUES
('dd0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Welcome Bonus', 'স্বাগত বোনাস', 'You received 500 taka welcome bonus!', 'আপনি ৫০০ টাকা স্বাগত বোনাস পেয়েছেন!', 'success', false),
('dd0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Investment Return', 'বিনিয়োগ রিটার্ন', 'Your daily return of 150 taka has been credited', 'আপনার ১৫০ টাকা দৈনিক রিটার্ন জমা হয়েছে', 'info', false),
('dd0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Task Completed', 'টাস্ক সম্পন্ন', 'You completed daily check-in task', 'আপনি দৈনিক চেক-ইন টাস্ক সম্পন্ন করেছেন', 'success', true),
('dd0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Withdrawal Pending', 'উইথড্র অপেক্ষমাণ', 'Your withdrawal request is being processed', 'আপনার উইথড্র অনুরোধ প্রক্রিয়াধীন রয়েছে', 'warning', false);

-- Insert sample referrals
INSERT INTO referrals (id, referrer_id, referred_id, level, commission_rate, total_earned, status) VALUES
('ee0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 1, 10.00, 500.00, 'active'),
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 1, 10.00, 300.00, 'active'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 1, 10.00, 200.00, 'active');

-- Insert sample user tasks (completed tasks)
INSERT INTO user_tasks (id, user_id, task_id, status, progress, completed_at) VALUES
('ff0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', 'completed', 100, NOW() - INTERVAL '1 hour'),
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440000', 'completed', 100, NOW() - INTERVAL '2 hours'),
('ff0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440001', 'completed', 100, NOW() - INTERVAL '3 hours');

-- Insert sample user gifts (claimed gifts)
INSERT INTO user_gifts (id, user_id, gift_id, status, claimed_at) VALUES
('110e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'bb0e8400-e29b-41d4-a716-446655440000', 'claimed', NOW() - INTERVAL '1 day'),
('110e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440000', 'claimed', NOW() - INTERVAL '2 days');

-- Insert sample spin wheel records
INSERT INTO spin_wheels (id, user_id, type, prize_amount, prize_type, status) VALUES
('120e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'daily', 25.00, 'cash', 'completed'),
('120e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'premium', 100.00, 'bonus', 'completed'),
('120e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'mega', 500.00, 'cash', 'completed');

-- Insert admin settings
INSERT INTO admin_settings (key, value, description) VALUES
('app_name', 'AJBell Investment', 'Application name'),
('min_withdrawal', '500', 'Minimum withdrawal amount in taka'),
('max_withdrawal', '50000', 'Maximum withdrawal amount in taka'),
('referral_bonus', '200', 'Referral bonus amount in taka'),
('daily_login_bonus', '20', 'Base daily login bonus in taka'),
('withdrawal_fee', '2', 'Withdrawal fee percentage'),
('app_version', '1.0.0', 'Current app version'),
('maintenance_mode', 'false', 'Maintenance mode status');

-- Insert Products for Product Store
INSERT INTO products (id, name, description, price, image_url, stock)
VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'স্মার্টফোন', 'সর্বশেষ মডেলের অ্যান্ড্রয়েড স্মার্টফোন।', 15000.00, '/placeholder.svg?height=200&width=300', 10),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'ব্লুটুথ হেডফোন', 'উচ্চ মানের সাউন্ড সহ ওয়্যারলেস হেডফোন।', 2500.00, '/placeholder.svg?height=200&width=300', 25),
('g0eebc99-9c0b-41d4-a716-446655440007', 'স্মার্টওয়াচ', 'ফিটনেস ট্র্যাকার এবং নোটিফিকেশন সহ।', 5000.00, '/placeholder.svg?height=200&width=300', 15),
('h0eebc99-9c0b-41d4-a716-446655440008', 'পাওয়ার ব্যাংক', 'দ্রুত চার্জিং সহ ২০০০০ mAh পাওয়ার ব্যাংক।', 1500.00, '/placeholder.svg?height=200&width=300', 30)
ON CONFLICT (id) DO NOTHING;

-- Insert Intern Tasks
INSERT INTO intern_tasks (id, name, description, reward, time_required_minutes, is_active)
VALUES
('intern-task-1', 'গভীর গবেষণা', 'বাজারের প্রবণতা নিয়ে একটি সংক্ষিপ্ত প্রতিবেদন তৈরি করুন।', 50.00, 60, TRUE),
('intern-task-2', 'নতুন ব্যবহারকারী আনুন', 'আপনার রেফারেল কোড ব্যবহার করে ৫ জন নতুন ব্যবহারকারীকে আমন্ত্রণ জানান।', 100.00, 120, TRUE),
('intern-task-3', 'ফিডব্যাক জমা দিন', 'অ্যাপের উন্নতির জন্য বিস্তারিত ফিডব্যাক জমা দিন।', 30.00, 30, TRUE)
ON CONFLICT (id) DO NOTHING;
