// src\utils\supabase\auth-server-props.ts
import { type GetServerSidePropsContext } from "next";
import { createClient } from "@/utils/supabase/server-props";

/**
 * Retrieves the authenticated user for server-side rendered pages.
 *
 * This function ensures the user is authenticated and redirects unauthenticated
 * users to the sign-in page.
 */
export async function getUserServerSideProps(
  context: GetServerSidePropsContext,
) {
  // Create a Supabase client using the provided server-side context
  const supabase = createClient(context);

  // Fetch the current authenticated user from Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // Redirect unauthenticated users to the sign-in page
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  // Return serializable user data as props for the page
  return {
    props: {
      user,
    },
  };
}
