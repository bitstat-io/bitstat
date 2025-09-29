import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import "@workspace/ui/globals.css";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <div
            style={{
              backgroundImage: `url('${url}')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "fix",
              backgroundPosition: "top left",
              backgroundAttachment: "fixed",
              minHeight: "100vh",
              width: "100%",
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
