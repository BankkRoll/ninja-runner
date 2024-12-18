// src/config/seo.ts
import { DefaultSeoProps } from "next-seo";

export const defaultSEO: DefaultSeoProps = {
  title: "CTJR",
  description: "CTJR",
  canonical: "https://ctjr-arcade.vercel.app/",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://ctjr-arcade.vercel.app",
    siteName: "ctjr",
    images: [
      {
        url: "https://ctjr-arcade.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "ctjr",
      },
    ],
  },
  twitter: {
    handle: "@ctjr",
    site: "@ctjr",
    cardType: "summary_large_image",
  },
};

export const getSEO = (pageSEO?: DefaultSeoProps): DefaultSeoProps => {
  return {
    ...defaultSEO,
    ...pageSEO,
    openGraph: {
      ...defaultSEO.openGraph,
      ...pageSEO?.openGraph,
    },
    twitter: {
      ...defaultSEO.twitter,
      ...pageSEO?.twitter,
    },
  };
};
