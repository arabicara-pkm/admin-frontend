import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Pastikan variabel ada sebelum membuat client
if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase URL and Anon Key must be defined in .env file");
}

// Buat dan ekspor client Supabase
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        // Supabase akan otomatis menyimpan sesi di localStorage
        persistSession: true,
    }
});