import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import Header from "@/components/sections/header";
import "@workspace/ui/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bitstat - Build Smarter Web3 Games with Data",
  description:
    "Comprehensive analytics and insights for Web3 game developers. Track user behavior, optimize retention, and maximize revenue with real-time data across your entire gaming ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const url =
    "https://uihkeovjmvttopqxecme.supabase.co/storage/v1/object/public/bitstat/axie-infinity-bg.jpg";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistSans.variable} font-sans antialiased `}
      >
        <Providers>
          <div
            style={{
              backgroundImage: `url('${url}')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundAttachment: "fixed",
              minHeight: "100vh",
              width: "100%",
              position: "relative",
            }}
          >
            <div className="bg-background/80 backdrop-blur-3xl container mx-auto">
              <Header />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
