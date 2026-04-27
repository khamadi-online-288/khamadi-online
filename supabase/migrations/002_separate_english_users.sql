-- ============================================================
-- 002: Separate English users from ENT/NISH users
--
-- english_user_roles must ONLY be populated by the /english/register
-- page (explicit insert). No auto-trigger should create rows here.
--
-- Run this in Supabase SQL Editor to clean up any manually-created
-- trigger that might have been added outside of migrations.
-- ============================================================

-- Drop any trigger on auth.users that auto-inserts into english_user_roles
DROP TRIGGER  IF EXISTS on_auth_user_created_english ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_english_user();

-- Also drop the generic handle_new_user trigger if it touches english_user_roles
-- (uncomment only if confirmed it inserts into english_user_roles)
-- DROP TRIGGER  IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();

-- Confirm the two user tables are independent:
--   profiles           → ENT / NISH users (populated by ENT register / trigger)
--   english_user_roles → English platform users (populated ONLY by /english/register)
