ALTER TABLE publications 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'video' 
CHECK (type IN ('video', 'photo', 'text'));
