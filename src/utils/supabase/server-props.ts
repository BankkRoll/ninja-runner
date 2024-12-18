// src\utils\supabase\server-props.ts
import { type GetServerSidePropsContext } from "next";
import { createServerClient, serializeCookieHeader } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in server-side rendered pages.
 *
 * This function is ideal for SSR scenarios where you need to fetch data
 * from Supabase and pass it as props to your page.
 */
export function createClient({ req, res }: GetServerSidePropsContext) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      // Custom cookie handling for session management
      cookies: {
        getAll() {
          // Retrieve all cookies from the request and format them for Supabase
          return Object.keys(req.cookies).map((name) => ({
            name,
            value: req.cookies[name] || "",
          }));
        },
        setAll(cookiesToSet) {
          // Set cookies in the HTTP response for session updates
          res.setHeader(
            "Set-Cookie",
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options),
            ),
          );
        },
      },
    },
  );

  // Return the configured Supabase client for server-side use
  return supabase;
}
