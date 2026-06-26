import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "./client-layout-wrapper";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICC Portfolio",
  description:
    "I build systems that bridge the screen and the physical world. Full Stack Developer specializing in software architecture, AI integration, and robotics.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png",  media: "(prefers-color-scheme: dark)"  },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning prevents a mismatch caused by next-themes injecting the .dark class server-side
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-background`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="font-sans antialiased relative min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </ThemeProvider>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
