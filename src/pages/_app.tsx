import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { Footer } from "@/components/footer";
import Head from "next/head";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </>
  );
}
