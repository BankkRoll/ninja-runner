import { defaultSEO, getSEO } from "@/config/seo";

// src/pages/404.tsx
import { Button } from "@/components/ui/button";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();

  const seo = getSEO({
    title: "404",
    description: "Oops! The page you're looking for doesn't exist.",
    canonical: `${defaultSEO.canonical}${router.asPath}`,
    openGraph: {
      url: `${defaultSEO.canonical}${router.asPath}`,
    },
  });

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <NextSeo {...seo} />

      <motion.div
        className="m-auto min-h-screen flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.3 }}
      >
        <div className="text-center">
          <motion.h1
            className="mb-8 text-9xl font-bold"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            404
          </motion.h1>
          <motion.div
            className="mb-8 text-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Oops! Page not found
          </motion.div>
          <motion.div
            className="mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <Button variant="outline" size="lg" onClick={handleGoBack}>
              Go Back
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default NotFound;
