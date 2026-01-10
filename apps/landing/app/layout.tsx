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
  // Open Graph - Share preview with theme support
  openGraph: {
    title: "Ralph Alpha - Multiplayer AI Coding",
    description: "Your team's laptops. One AI-powered fleet.",
    url: "https://ralph-alpha.com",
    siteName: "Ralph Alpha",
    type: "website",
    images: [
      {
        url: "/og-image-light.png",
        width: 1200,
        height: 630,
        alt: "Ralph Alpha - Multiplayer AI Coding (Light Mode)",
      },
      {
        url: "/og-image-dark.png",
        width: 1200,
        height: 630,
        alt: "Ralph Alpha - Multiplayer AI Coding (Dark Mode)",
      },
    ],
  },
  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "Ralph Alpha - Multiplayer AI Coding",
    description: "Your team's laptops. One AI-powered fleet.",
    images: ["/og-image-light.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}