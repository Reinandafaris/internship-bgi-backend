// src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // Memuat variabel dari file .env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL and Key must be defined in .env file"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
