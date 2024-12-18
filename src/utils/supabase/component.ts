// src\utils\supabase\component.ts
import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser components.
 *
 * This function is used for client-side interactions with Supabase, such as fetching
 * data or triggering Supabase functions in a React component.
 */
export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );

  // Return the configured Supabase client for use in the browser
  return supabase;
}
