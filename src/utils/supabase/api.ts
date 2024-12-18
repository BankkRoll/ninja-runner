// src\utils\supabase\api.ts
import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { type NextApiRequest, type NextApiResponse } from "next";

/**
 * Creates a Supabase client for use in API routes, with server-side cookie management.
 *
 * This is ideal for Next.js API routes where you need to access Supabase
 * with user authentication and handle cookies for session persistence.
 */
export default function createClient(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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

  // Return the configured Supabase client for API use
  return supabase;
}
