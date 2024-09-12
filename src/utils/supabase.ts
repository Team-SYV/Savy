import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

// Create and export Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
