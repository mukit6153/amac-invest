-- Insert investment packages
INSERT INTO investment_packages (name, name_bn, min_amount, max_amount, daily_rate, total_days, total_return_rate, features) VALUES
('Starter', 'স্টার্টার', 1000, 10000, 5.0, 30, 150.0, ARRAY['5% daily return', '30 days plan', 'Instant withdrawal']),
('Premium', 'প্রিমিয়াম', 10000, 50000, 8.0, 25, 200.0, ARRAY['8% daily return', '25 days plan', 'Priority support']),
('VIP', 'ভিআইপি', 50000, 200000, 12.0, 20, 240.0, ARRAY['12% daily return', '20 days plan', 'VIP support']),
('Gold', 'গোল্ড', 25000, 100000, 10.0, 22, 220.0, ARRAY['10% daily return', '22 days plan', 'Gold benefits']),
('Diamond', 'ডায়মন্ড', 100000, 500000, 15.0, 18, 270.0, ARRAY['15% daily return', '18 days plan', 'Diamond perks']);

-- Insert tasks
INSERT INTO tasks (title, title_bn, description, description_bn, type, reward, requirement, icon, color) VALUES
('Daily Check-in', 'দৈনিক চেক-ইন', 'Check in daily to earn bonus', 'বোনাস পেতে প্রতিদিন চেক-ইন করুন', 'daily', 50, 'Login daily', '📅', 'green'),
('Watch Video', 'ভিডিও দেখুন', 'Watch promotional video', 'প্রচারণামূলক ভিডিও দেখুন', 'video', 100, 'Watch 5 minutes video', '📺', 'blue'),
('Complete Survey', 'সার্ভে সম্পন্ন করুন', 'Complete user feedback survey', 'ব্যবহারকারী মতামত সার্ভে সম্পন্ন করুন', 'survey', 200, 'Complete survey form', '📋', 'purple'),
('Refer Friends', 'বন্ধুদের রেফার করুন', 'Refer 3 friends to earn bonus', 'বোনাস পেতে ৩ জন বন্ধুকে রেফার করুন', 'referral', 500, 'Refer 3 friends', '👥', 'orange'),
('Social Share', 'সোশ্যাল শেয়ার', 'Share on social media', 'সোশ্যাল মিডিয়ায় শেয়ার করুন', 'social', 75, 'Share on Facebook/WhatsApp', '📱', 'pink'),
('Investment Task', 'বিনিয়োগ টাস্ক', 'Make your first investment', 'আপনার প্রথম বিনিয়োগ করুন', 'daily', 300, 'Invest minimum 1000 taka', '💰', 'gold');

-- Insert events
INSERT INTO events (title, title_bn, description, description_bn, type, reward, start_date, end_date, status, participants, max_participants) VALUES
('New Year Bonus', 'নববর্ষ বোনাস', 'Special bonus for new year celebration', 'নববর্ষ উদযাপনের জন্য বিশেষ বোনাস', 'bonus', '500 Taka Bonus', NOW(), NOW() + INTERVAL '7 days', 'active', 150, 500),
('Referral Contest', 'রেফারেল প্রতিযোগিতা', 'Top referrers win prizes', 'শীর্ষ রেফারকারীরা পুরস্কার জিতবেন', 'referral', 'iPhone 15 Pro', NOW() + INTERVAL '1 day', NOW() + INTERVAL '30 days', 'upcoming', 0, 100),
('Investment Challenge', 'বিনিয়োগ চ্যালেঞ্জ', 'Invest and win extra returns', 'বিনিয়োগ করুন এবং অতিরিক্ত রিটার্ন জিতুন', 'investment', '20% Extra Return', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', 'active', 89, 200);

-- Insert gifts
INSERT INTO gifts (title, title_bn, description, description_bn, type, reward, requirement, icon, color) VALUES
('Daily Gift', 'দৈনিক গিফট', 'Claim your daily gift', 'আপনার দৈনিক গিফট দাবি করুন', 'daily', 25, 'Login daily', '🎁', 'red'),
('Weekly Bonus', 'সাপ্তাহিক বোনাস', 'Weekly login bonus', 'সাপ্তাহিক লগইন বোনাস', 'premium', 150, 'Login 7 days consecutively', '🏆', 'gold'),
('Monthly Reward', 'মাসিক পুরস্কার', 'Monthly active user reward', 'মাসিক সক্রিয় ব্যবহারকারী পুরস্কার', 'special', 500, 'Be active for 30 days', '👑', 'purple'),
('First Investment Gift', 'প্রথম বিনিয়োগ গিফট', 'Gift for first investment', 'প্রথম বিনিয়োগের জন্য গিফট', 'special', 200, 'Make first investment', '💎', 'blue');

-- Insert banners
INSERT INTO banners (title, title_bn, description, description_bn, image_url, order_index) VALUES
('Welcome to AMAC', 'AMAC এ স্বাগতম', 'Start your investment journey today', 'আজই আপনার বিনিয়োগ যাত্রা শুরু করুন', '/placeholder.svg?height=160&width=400&text=Welcome', 1),
('High Returns', 'উচ্চ রিটার্ন', 'Get up to 15% daily returns on your investment', 'আপনার বিনিয়োগে দৈনিক ১৫% পর্যন্ত রিটার্ন পান', '/placeholder.svg?height=160&width=400&text=High+Returns', 2),
('Referral Program', 'রেফারেল প্রোগ্রাম', 'Earn commission by referring friends', 'বন্ধুদের রেফার করে কমিশন আয় করুন', '/placeholder.svg?height=160&width=400&text=Referral', 3),
('Secure Investment', 'নিরাপদ বিনিয়োগ', 'Your money is safe with us', 'আমাদের সাথে আপনার অর্থ নিরাপদ', '/placeholder.svg?height=160&width=400&text=Secure', 4);

-- Create a demo user for testing
INSERT INTO users (phone, name, email, wallet_pin, password, balance, bonus_balance, referral_code, login_streak) VALUES
('01700000000', 'Demo User', 'demo@example.com', '123456', 'password123', 50000, 1000, 'DEMO123', 5);

-- Get the demo user ID for further inserts
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE phone = '01700000000';
    
    -- Insert sample transactions for demo user
    INSERT INTO transactions (user_id, type, amount, status, description) VALUES
    (demo_user_id, 'deposit', 10000, 'completed', 'Initial deposit'),
    (demo_user_id, 'bonus', 500, 'completed', 'Welcome bonus'),
    (demo_user_id, 'investment', 5000, 'completed', 'Investment in Starter package'),
    (demo_user_id, 'return', 250, 'completed', 'Daily return from investment'),
    (demo_user_id, 'referral', 200, 'completed', 'Referral bonus from friend');
    
    -- Insert sample notifications for demo user
    INSERT INTO notifications (user_id, title, title_bn, message, message_bn, type) VALUES
    (demo_user_id, 'Welcome to AMAC', 'AMAC এ স্বাগতম', 'Your account has been created successfully!', 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success'),
    (demo_user_id, 'Daily Login Bonus', 'দৈনিক লগইন বোনাস', 'You received ৳50 login bonus!', 'আপনি ৳৫০ লগইন বোনাস পেয়েছেন!', 'success'),
    (demo_user_id, 'Investment Return', 'বিনিয়োগ রিটার্ন', 'You received ৳250 from your investment!', 'আপনি আপনার বিনিয়োগ থেকে ৳২৫০ পেয়েছেন!', 'info');
END $$;
