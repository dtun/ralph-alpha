import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ralph Alpha - Multiplayer AI Coding",
  description: "Your team's laptops. One AI-powered fleet.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  // Open Graph - Share preview
  openGraph: {
    title: "Ralph Alpha - Multiplayer AI Coding",
    description: "Your team's laptops. One AI-powered fleet.",
    type: "website",
    url: "https://ralph-alpha.com",
    siteName: "Ralph Alpha",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ralph Alpha - Multiplayer AI Coding",
      },
    ],
  },
  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "Ralph Alpha - Multiplayer AI Coding",
    description: "Your team's laptops. One AI-powered fleet.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
