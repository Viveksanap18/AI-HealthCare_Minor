-- Create user_profiles table for storing user health details
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  age INTEGER,
  blood_group TEXT,
  height DECIMAL(5, 2),
  weight DECIMAL(5, 2),
  gender TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  medical_conditions TEXT,
  allergies TEXT,
  medications TEXT,
  emergency_contact TEXT,
  emergency_contact_number TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_medical_history table for disease history
CREATE TABLE IF NOT EXISTS public.user_medical_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  disease_name TEXT NOT NULL,
  disease_date DATE NOT NULL,
  recovery_date DATE,
  severity TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_medical_history_user_id ON public.user_medical_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_medical_history_date ON public.user_medical_history(disease_date);

-- Enable RLS (Row Level Security) for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS (Row Level Security) for user_medical_history
ALTER TABLE public.user_medical_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_medical_history
-- Allow users to read their own medical history
CREATE POLICY "Users can read own medical history"
  ON public.user_medical_history
  FOR SELECT
  USING (user_id = (SELECT user_id FROM public.user_profiles WHERE user_id = auth.uid()));

-- Allow users to create medical history records
CREATE POLICY "Users can create own medical history"
  ON public.user_medical_history
  FOR INSERT
  WITH CHECK (user_id = (SELECT user_id FROM public.user_profiles WHERE user_id = auth.uid()));

-- Allow users to update their medical history
CREATE POLICY "Users can update own medical history"
  ON public.user_medical_history
  FOR UPDATE
  USING (user_id = (SELECT user_id FROM public.user_profiles WHERE user_id = auth.uid()));

-- Allow users to delete their medical history
CREATE POLICY "Users can delete own medical history"
  ON public.user_medical_history
  FOR DELETE
  USING (user_id = (SELECT user_id FROM public.user_profiles WHERE user_id = auth.uid()));
