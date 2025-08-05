-- Insert investment packages
INSERT INTO investment_packages (name, name_bn, min_amount, max_amount, daily_return, duration, total_return, is_popular) VALUES
('Starter Package', 'স্টার্টার প্যাকেজ', 500.00, 2000.00, 3.00, 30, 90.00, false),
('Premium Package', 'প্রিমিয়াম প্যাকেজ', 2000.00, 10000.00, 4.00, 30, 120.00, true),
('VIP Package', 'ভিআইপি প্যাকেজ', 10000.00, 50000.00, 5.00, 30, 150.00, false),
('Diamond Package', 'ডায়মন্ড প্যাকেজ', 50000.00, 200000.00, 6.00, 30, 180.00, false);

-- Insert demo user
INSERT INTO users (name, phone, email, password_hash, balance, invested, earned, referral_code, status) VALUES
('Demo User', '01700000000', 'demo@amac.com', '$2b$10$dummy.hash.for.demo.user', 1500.50, 5000.00, 750.25, 'DEMO123', 'active');

-- Get demo user ID for foreign key references
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE phone = '01700000000';

    -- Insert sample transactions for demo user
    INSERT INTO transactions (user_id, type, amount, description, description_bn, status) VALUES
    (demo_user_id, 'investment', -1000.00, 'Investment in Premium Package', 'প্রিমিয়াম প্যাকেজে বিনিয়োগ', 'completed'),
    (demo_user_id, 'earning', 40.00, 'Daily return', 'দৈনিক রিটার্ন', 'completed'),
    (demo_user_id, 'referral', 100.00, 'Referral bonus', 'রেফারেল বোনাস', 'completed'),
    (demo_user_id, 'bonus', 50.00, 'Daily login bonus', 'দৈনিক লগইন বোনাস', 'completed');

    -- Insert sample investment for demo user
    INSERT INTO user_investments (user_id, package_id, amount, daily_return, total_return, start_date, end_date, status, days_completed) VALUES
    (demo_user_id, (SELECT id FROM investment_packages WHERE name = 'Premium Package'), 1000.00, 40.00, 1200.00, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'active', 10);
END $$;

-- Insert tasks
INSERT INTO tasks (title, title_bn, description, description_bn, type, reward, url, is_daily, is_active) VALUES
('Watch YouTube Video', 'ইউটিউব ভিডিও দেখুন', 'Watch our latest promotional video', 'আমাদের সর্বশেষ প্রচারণামূলক ভিডিও দেখুন', 'video', 10.00, 'https://youtube.com/watch?v=demo', true, true),
('Follow Facebook Page', 'ফেসবুক পেজ ফলো করুন', 'Follow our official Facebook page', 'আমাদের অফিসিয়াল ফেসবুক পেজ ফলো করুন', 'social', 25.00, 'https://facebook.com/amac', false, true),
('Share on WhatsApp', 'হোয়াটসঅ্যাপে শেয়ার করুন', 'Share our app with friends', 'বন্ধুদের সাথে আমাদের অ্যাপ শেয়ার করুন', 'share', 15.00, null, true, true),
('Complete Profile', 'প্রোফাইল সম্পূর্ণ করুন', 'Complete your profile information', 'আপনার প্রোফাইল তথ্য সম্পূর্ণ করুন', 'profile', 50.00, null, false, true);

-- Insert events
INSERT INTO events (title, title_bn, description, description_bn, type, reward, start_date, end_date, max_participants) VALUES
('New Year Bonus', 'নববর্ষ বোনাস', 'Special bonus for new year celebration', 'নববর্ষ উদযাপনের জন্য বিশেষ বোনাস', 'bonus', 100.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 1000),
('Investment Challenge', 'বিনিয়োগ চ্যালেঞ্জ', 'Invest minimum 1000 BDT to participate', 'অংশগ্রহণের জন্য সর্বনিম্ন ১০০০ টাকা বিনিয়োগ করুন', 'challenge', 200.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', 500);

-- Insert gifts
INSERT INTO gifts (title, title_bn, description, description_bn, type, value, is_daily, is_active) VALUES
('Daily Check-in Bonus', 'দৈনিক চেক-ইন বোনাস', 'Daily login reward', 'দৈনিক লগইন পুরস্কার', 'bonus', 20.00, true, true),
('Welcome Gift', 'স্বাগত উপহার', 'Welcome bonus for new users', 'নতুন ব্যবহারকারীদের জন্য স্বাগত বোনাস', 'bonus', 100.00, false, true),
('Weekly Surprise', 'সাপ্তাহিক সারপ্রাইজ', 'Random weekly gift', 'এলোমেলো সাপ্তাহিক উপহার', 'surprise', 50.00, false, true);

-- Insert products
INSERT INTO products (name, name_bn, description, description_bn, price, category, stock, is_active) VALUES
('iPhone 15 Pro', 'আইফোন ১৫ প্রো', 'Latest iPhone with advanced features', 'উন্নত বৈশিষ্ট্য সহ সর্বশেষ আইফোন', 120000.00, 'Electronics', 10, true),
('Samsung Galaxy S24', 'স্যামসাং গ্যালাক্সি এস২৪', 'Premium Android smartphone', 'প্রিমিয়াম অ্যান্ড্রয়েড স্মার্টফোন', 95000.00, 'Electronics', 15, true),
('MacBook Air M3', 'ম্যাকবুক এয়ার এম৩', 'Powerful laptop for professionals', 'পেশাদারদের জন্য শক্তিশালী ল্যাপটপ', 150000.00, 'Electronics', 5, true),
('AirPods Pro', 'এয়ারপডস প্রো', 'Wireless earbuds with noise cancellation', 'নয়েজ ক্যান্সেলেশন সহ ওয়্যারলেস ইয়ারবাড', 25000.00, 'Electronics', 20, true);

-- Insert banners
INSERT INTO banners (title, title_bn, subtitle, subtitle_bn, color_scheme, is_active, sort_order) VALUES
('Special Bonus Offer!', 'বিশেষ বোনাস অফার!', 'Get up to 50% bonus', '৫০% পর্যন্ত বোনাস পান', 'from-purple-500 to-pink-500', true, 1),
('New Package Launched!', 'নতুন প্যাকেজ চালু!', 'Daily 5% return', 'দৈনিক ৫% রিটার্ন', 'from-blue-500 to-cyan-500', true, 2),
('Refer and Earn', 'রেফার করুন ও আয় করুন', 'Get 10% commission', '১০% কমিশন পান', 'from-green-500 to-emerald-500', true, 3);

-- Insert spin wheel rewards
INSERT INTO spin_rewards (name, name_bn, type, value, probability, color, is_active) VALUES
('Cash Prize', 'নগদ পুরস্কার', 'cash', 100.00, 10.00, '#FFD700', true),
('Bonus Points', 'বোনাস পয়েন্ট', 'bonus', 50.00, 20.00, '#FF6B6B', true),
('Free Spin', 'ফ্রি স্পিন', 'spin', 1.00, 15.00, '#4ECDC4', true),
('Investment Bonus', 'বিনিয়োগ বোনাস', 'investment', 200.00, 5.00, '#45B7D1', true),
('Better Luck', 'আরও ভাগ্য', 'nothing', 0.00, 30.00, '#95A5A6', true),
('Small Prize', 'ছোট পুরস্কার', 'cash', 25.00, 20.00, '#F39C12', true);

-- Insert notifications for demo user
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE phone = '01700000000';

    INSERT INTO notifications (user_id, title, title_bn, message, message_bn, type, is_read) VALUES
    (demo_user_id, 'Welcome to AMAC!', 'AMAC-এ স্বাগতম!', 'Thank you for joining our platform', 'আমাদের প্ল্যাটফর্মে যোগদানের জন্য ধন্যবাদ', 'welcome', false),
    (demo_user_id, 'Daily Return Credited', 'দৈনিক রিটার্ন জমা হয়েছে', 'Your daily return of ৳40 has been credited', 'আপনার ৪০ টাকার দৈনিক রিটার্ন জমা হয়েছে', 'earning', false),
    (demo_user_id, 'New Task Available', 'নতুন টাস্ক উপলব্ধ', 'Complete tasks to earn extra rewards', 'অতিরিক্ত পুরস্কার অর্জনের জন্য টাস্ক সম্পূর্ণ করুন', 'task', true);
END $$;

-- Insert system settings
INSERT INTO system_settings (key, value, description, type) VALUES
('min_withdrawal_amount', '100', 'Minimum withdrawal amount in BDT', 'number'),
('max_withdrawal_amount', '50000', 'Maximum withdrawal amount in BDT', 'number'),
('withdrawal_fee_percentage', '2', 'Withdrawal fee percentage', 'number'),
('referral_commission_rate', '10', 'Referral commission rate percentage', 'number'),
('daily_spin_limit', '3', 'Daily free spin limit per user', 'number'),
('app_version', '1.0.0', 'Current app version', 'string'),
('maintenance_mode', 'false', 'Enable maintenance mode', 'boolean'),
('support_phone', '01700000000', 'Customer support phone number', 'string'),
('support_email', 'support@amac.com', 'Customer support email', 'string');

-- Insert admin user
INSERT INTO admin_users (username, email, password_hash, role, permissions) VALUES
('admin', 'admin@amac.com', '$2b$10$dummy.hash.for.admin.user', 'super_admin', '{"users": true, "transactions": true, "investments": true, "withdrawals": true, "tasks": true, "events": true, "products": true, "settings": true}');
