"use client";

import { Card, CardContent } from "@/components/ui/card";
import { defaultSEO, getSEO } from "@/config/seo";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const seo = getSEO({
    title: "CTJR",
    description: "CrashTestJoyRide",
    canonical: `${defaultSEO.canonical}${router.asPath}`,
    openGraph: {
      url: `${defaultSEO.canonical}${router.asPath}`,
    },
  });

  return (
    <>
      <NextSeo {...seo} />

      <main className="flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-8">
            <Card>
              <CardContent>
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-none">
                    CRASH
                    <span className="font-light">TEST</span>
                    JOYRIDE
                  </h1>
                  <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide">
                    COMING SOON
                  </p>
                </div>
              </CardContent>
            </Card>
            <Link href="/arcade" passHref>
              <Button
                variant="outline"
                size="lg"
                className="group transition-all duration-300 ease-in-out"
              >
                Enter Arcade
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
