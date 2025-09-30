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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="container mx-auto">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
