-- Run this once in Supabase Studio > SQL Editor
CREATE TABLE IF NOT EXISTS visits (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  puzzle_date date NOT NULL,
  ip_address  text,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS visits_puzzle_date_idx ON visits(puzzle_date);
CREATE INDEX IF NOT EXISTS visits_created_at_idx  ON visits(created_at);
