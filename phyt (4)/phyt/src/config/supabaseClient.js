import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

let supabase = null;
let useSupabase = false;

// Check if credentials are set and user enabled Supabase
const configIsValid = 
  import.meta.env.VITE_USE_SUPABASE === "true" &&
  supabaseUrl &&
  supabaseUrl.trim() !== "" &&
  supabaseUrl !== "your_project_url" &&
  supabaseAnonKey &&
  supabaseAnonKey.trim() !== "" &&
  supabaseAnonKey !== "your_project_anon_key";

if (configIsValid) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    useSupabase = true;
    console.log("⚡ Supabase Client initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize Supabase client:", error);
  }
} else {
  console.log("ℹ️ Running in Local Mock Authentication mode. Enable VITE_USE_SUPABASE in .env to connect to Supabase.");
}

export { supabase, useSupabase };
export default supabase;
