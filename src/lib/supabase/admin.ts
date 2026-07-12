import "server-only";
import { createClient } from "@supabase/supabase-js";

// Secret-klient: kringgår RLS. Får aldrig importeras i klientkod.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } }
  );
}
