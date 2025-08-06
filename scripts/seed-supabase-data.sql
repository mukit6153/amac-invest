-- Insert investment packages
INSERT INTO investment_packages (name, name_bn, min_amount, max_amount, daily_rate, total_days, total_return_rate, features, is_popular, color, icon, sort_order) VALUES
('Starter Package', 'স্টার্টার প্যাকেজ', 500, 2000, 3.0, 30, 90.0, '["দৈনিক ৩% রিটার্ন", "৩০ দিনের মেয়াদ", "২৪/৭ সাপোর্ট"]', false, 'from-blue-500 to-cyan-500', 'zap', 1),
('Premium Package', 'প্রিমিয়াম প্যাকেজ', 2000, 10000, 4.0, 30, 120.0, '["দৈনিক ৪% রিটার্ন", "৩০ দিনের মেয়াদ", "প্রিমিয়াম সাপোর্ট", "বোনাস রিওয়ার্ড"]', true, 'from-purple-500 to-pink-500', 'star', 2),
('VIP Package', 'ভিআইপি প্যাকেজ', 10000, 50000, 5.0, 30, 150.0, '["দৈনিক ৫% রিটার্ন", "৩০ দিনের মেয়াদ", "ভিআইপি সাপোর্ট", "এক্সক্লুসিভ বোনাস", "প্রাইভেট ম্যানেজার"]', false, 'from-yellow-500 to-orange-500', 'crown', 3);

-- Insert demo user
INSERT INTO users (name, email, phone, password_hash, balance, invested, earned, referral_code, login_streak, level, total_referrals) VALUES
('ডেমো ইউজার', 'demo@amac.com', '01700000000', '$2b$10$demo.hash.for.password123', 5000.00, 2000.00, 450.00, 'AMAC001', 5, 2, 3);

-- Get the demo user ID for foreign key references
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE phone = '01700000000';
    
    -- Insert sample transactions for demo user
    INSERT INTO transactions (user_id, type, amount, status, description, description_bn) VALUES
    (demo_user_id, 'bonus', 100.00, 'completed', 'Welcome Bonus', 'স্বাগতম বোনাস'),
    (demo_user_id, 'investment', -2000.00, 'completed', 'Premium Package Investment', 'প্রিমিয়াম প্যাকেজ বিনিয়োগ'),
    (demo_user_id, 'earning', 80.00, 'completed', 'Daily Return', 'দৈনিক রিটার্ন'),
    (demo_user_id, 'earning', 80.00, 'completed', 'Daily Return', 'দৈনিক রিটার্ন'),
    (demo_user_id, 'referral', 100.00, 'completed', 'Referral Bonus', 'রেফারেল বোনাস'),
    (demo_user_id, 'bonus', 50.00, 'completed', 'Daily Login Bonus', 'দৈনিক লগইন বোনাস');
    
    -- Insert sample investment for demo user
    INSERT INTO investments (user_id, package_id, amount, daily_return, total_return, days_completed, total_days, status, next_payment) VALUES
    (demo_user_id, 2, 2000.00, 80.00, 2400.00, 15, 30, 'active', NOW() + INTERVAL '1 day');
END $$;

-- Insert banners
INSERT INTO banners (title, title_bn, subtitle, subtitle_bn, image_url, color_scheme, sort_order) VALUES
('Special Bonus Offer!', 'বিশেষ বোনাস অফার!', 'Get up to 50% bonus', '৫০% পর্যন্ত বোনাস পান', '/placeholder.svg?height=120&width=300&text=Special+Bonus', 'from-purple-500 to-pink-500', 1),
('New Package Launched!', 'নতুন প্যাকেজ চালু!', 'Daily returns up to 5%', 'দৈনিক ৫% পর্যন্ত রিটার্ন', '/placeholder.svg?height=120&width=300&text=New+Package', 'from-blue-500 to-cyan-500', 2),
('Referral Program', 'রেফারেল প্রোগ্রাম', 'Earn from referrals', 'রেফারেল থেকে আয় করুন', '/placeholder.svg?height=120&width=300&text=Referral+Program', 'from-green-500 to-teal-500', 3);

-- Insert tasks
INSERT INTO tasks (title, title_bn, description, description_bn, type, reward, requirement, icon, color) VALUES
('Daily Check-in', 'দৈনিক চেক-ইন', 'Check in daily to earn bonus', 'বোনাস পেতে প্রতিদিন চেক-ইন করুন', 'daily', 50.00, 'Login daily', '📅', 'green'),
('Watch Video', 'ভিডিও দেখুন', 'Watch promotional video', 'প্রমোশনাল ভিডিও দেখুন', 'video', 25.00, 'Watch 1 video', '📺', 'blue'),
('Complete Survey', 'সার্ভে সম্পন্ন করুন', 'Complete user survey', 'ব্যবহারকারী সার্ভে সম্পন্ন করুন', 'survey', 100.00, 'Complete survey', '📋', 'purple'),
('Refer Friends', 'বন্ধুদের রেফার করুন', 'Refer friends to earn bonus', 'বোনাস পেতে বন্ধুদের রেফার করুন', 'referral', 200.00, 'Refer 1 friend', '👥', 'orange');

-- Insert events
INSERT INTO events (title, title_bn, description, description_bn, type, reward, start_date, end_date, status, participants, max_participants) VALUES
('New Year Bonus', 'নববর্ষ বোনাস', 'Special bonus for new year celebration', 'নববর্ষ উদযাপনের জন্য বিশেষ বোনাস', 'bonus', '500 Taka Bonus', NOW(), NOW() + INTERVAL '7 days', 'active', 150, 500),
('Investment Contest', 'বিনিয়োগ প্রতিযোগিতা', 'Top investors get extra rewards', 'শীর্ষ বিনিয়োগকারীরা অতিরিক্ত পুরস্কার পান', 'investment', 'Extra 10% Return', NOW() + INTERVAL '1 day', NOW() + INTERVAL '30 days', 'upcoming', 0, 100);

-- Insert gifts
INSERT INTO gifts (title, title_bn, description, description_bn, type, reward, requirement, icon, color) VALUES
('Daily Gift', 'দৈনিক গিফট', 'Claim your daily gift', 'আপনার দৈনিক গিফট দাবি করুন', 'daily', 25.00, 'Login daily', '🎁', 'red'),
('Premium Gift', 'প্রিমিয়াম গিফট', 'Special gift for premium users', 'প্রিমিয়াম ব্যবহারকারীদের জন্য বিশেষ গিফট', 'premium', 100.00, 'Premium member', '💎', 'gold'),
('Special Gift', 'বিশেষ গিফট', 'Limited time special gift', 'সীমিত সময়ের বিশেষ গিফট', 'special', 500.00, 'Complete 5 tasks', '🌟', 'rainbow');

-- Insert products
INSERT INTO products (name, name_bn, description, description_bn, price, category, stock, image_url) VALUES
('iPhone 15 Pro', 'আইফোন ১৫ প্রো', 'Latest iPhone with advanced features', 'উন্নত ফিচারসহ সর্বশেষ আইফোন', 120000.00, 'Electronics', 10, '/placeholder.svg?height=300&width=300&text=iPhone+15+Pro'),
('Samsung Galaxy S24', 'স্যামসাং গ্যালাক্সি এস২৪', 'Premium Android smartphone', 'প্রিমিয়াম অ্যান্ড্রয়েড স্মার্টফোন', 95000.00, 'Electronics', 15, '/placeholder.svg?height=300&width=300&text=Galaxy+S24'),
('MacBook Air M3', 'ম্যাকবুক এয়ার এম৩', 'Powerful laptop for professionals', 'পেশাদারদের জন্য শক্তিশালী ল্যাপটপ', 150000.00, 'Electronics', 5, '/placeholder.svg?height=300&width=300&text=MacBook+Air'),
('AirPods Pro', 'এয়ারপডস প্রো', 'Wireless earbuds with noise cancellation', 'নয়েজ ক্যান্সেলেশনসহ ওয়্যারলেস ইয়ারবাড', 25000.00, 'Electronics', 20, '/placeholder.svg?height=300&width=300&text=AirPods+Pro');

-- Insert sample notifications for demo user
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE phone = '01700000000';
    
    INSERT INTO notifications (user_id, title, title_bn, message, message_bn, type) VALUES
    (demo_user_id, 'Welcome to AMAC', 'AMAC এ স্বাগতম', 'Thank you for joining our investment platform', 'আমাদের বিনিয়োগ প্ল্যাটফর্মে যোগ দেওয়ার জন্য ধন্যবাদ', 'success'),
    (demo_user_id, 'Daily Return Credited', 'দৈনিক রিটার্ন জমা হয়েছে', 'Your daily return of 80 Taka has been credited', 'আপনার ৮০ টাকার দৈনিক রিটার্ন জমা হয়েছে', 'success'),
    (demo_user_id, 'New Package Available', 'নতুন প্যাকেজ উপলব্ধ', 'Check out our new VIP investment package', 'আমাদের নতুন ভিআইপি বিনিয়োগ প্যাকেজ দেখুন', 'info');
END $$;
