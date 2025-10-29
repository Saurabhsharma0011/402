import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers/PrivyProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "x402OS - Payment Gateway",
  description:
    "The first Solana-based operating system where every action requires verified micro-payments. Built for Web3.",
  keywords: ["x402OS", "Solana", "Web3", "Payment Gateway", "Blockchain OS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-green-400`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
