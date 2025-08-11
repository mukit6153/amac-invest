-- Insert new intern tasks with YouTube video URLs
INSERT INTO intern_tasks (id, title, description, reward_amount, is_active, video_url, created_at) VALUES
(1, 'Watch Introduction Video', 'Watch the introductory video about our platform.', 5, TRUE, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NOW()),
(2, 'Learn About Investments', 'Watch a video explaining basic investment concepts.', 10, TRUE, 'https://www.youtube.com/embed/L_Guz73e6fw', NOW()),
(3, 'Understand Referral System', 'Watch a tutorial on how our referral system works.', 7, TRUE, 'https://www.youtube.com/embed/tgbNymZ7vqY', NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  reward_amount = EXCLUDED.reward_amount,
  is_active = EXCLUDED.is_active,
  video_url = EXCLUDED.video_url;
