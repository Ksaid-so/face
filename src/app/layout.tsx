import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Pro - POS & Inventory Management",
  description: "Modern inventory management and point of sale system with barcode scanning, inventory alerts, and receipt generation.",
  keywords: ["Inventory", "POS", "Management", "Barcode", "Receipt", "Next.js"],
  authors: [{ name: "Inventory Pro Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Inventory Pro - POS & Inventory Management",
    description: "Modern inventory management and point of sale system",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inventory Pro - POS & Inventory Management",
    description: "Modern inventory management and point of sale system",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            {children}
            <Toaster />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
