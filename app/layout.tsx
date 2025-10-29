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
  metadataBase: new URL('https://x402os.com'),
  title: "x402OS - Payment Gateway",
  description:
    "The first Solana-based operating system where every action requires verified micro-payments. Built for Web3.",
  keywords: ["x402OS", "Solana", "Web3", "Payment Gateway", "Blockchain OS"],
  icons: {
    icon: [
      { url: '/osonly.png', sizes: 'any' },
      { url: '/osonly.png', type: 'image/png', sizes: '32x32' },
      { url: '/osonly.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/osonly.png',
    apple: [
      { url: '/osonly.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "x402OS - Payment Gateway",
    description: "The first Solana-based operating system where every action requires verified micro-payments. Built for Web3.",
    images: [
      {
        url: '/osonly.png',
        width: 1200,
        height: 630,
        alt: 'x402OS Logo',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "x402OS - Payment Gateway",
    description: "The first Solana-based operating system where every action requires verified micro-payments. Built for Web3.",
    images: ['/osonly.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/osonly.png" type="image/png" />
        <link rel="shortcut icon" href="/osonly.png" type="image/png" />
        <link rel="apple-touch-icon" href="/osonly.png" />
      </head>
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
