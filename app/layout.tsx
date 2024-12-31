import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Weeding Nur & Balqis",
  description: "Merayakan cinta dan kebahagiaan bersama Nur dan Balqis. Temukan informasi lengkap tentang acara pernikahan mereka di sini.",
  icons: {
    icon: "/assets/favicon.ico",
  },
  openGraph: {
    title: "Weeding Nur & Balqis",
    description: "Merayakan cinta dan kebahagiaan bersama Nur dan Balqis.",
    url: "https://my-weeding-dream.netlify.app/",
    images: [
      {
        url: "/assets/preview.png",
        width: 800,
        height: 600,
        alt: "Foto pernikahan Nur dan Balqis",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/favicon.ico" />
        <meta property="og:title" content="Weeding Nur & Balqis" />
        <meta
          property="og:description"
          content="Merayakan cinta dan kebahagiaan bersama Nur dan Balqis. Temukan informasi lengkap tentang acara pernikahan mereka di sini."
        />
        <meta property="og:image" content="/assets/preview.png" />
        <meta property="og:url" content="https://my-weeding-dream.netlify.app/" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-amber-600" size={48} />
          </div>
        }
      >
        {children}
      </Suspense>
    </html>
  );
}
