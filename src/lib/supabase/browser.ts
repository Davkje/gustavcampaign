"use client";

import { createClient } from "@supabase/supabase-js";

// Publishable-klient för webbläsaren. Används enbart för att slutföra en
// video-uppladdning mot en signed URL som redan utfärdats av servern.
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
