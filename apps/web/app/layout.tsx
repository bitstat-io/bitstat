import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import DotGrid from "@workspace/ui/components/dot-grid";
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <div className="relative">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <DotGrid
                dotSize={1.5}
                gap={15}
                baseColor="#5227FF"
                activeColor="#5227FF"
                proximity={120}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
              />
            </div>
            <div className="relative z-10">
              <Header />

              {children}
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
