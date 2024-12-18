// src\utils\supabase\static-props.ts
import { createClient as createClientPrimitive } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in static generation.
 *
 * This function is ideal for Next.js pages using `getStaticProps` to fetch
 * data during the build process.
 */
export function createClient() {
  const supabase = createClientPrimitive(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );

  // Return the configured Supabase client for static generation use
  return supabase;
}
