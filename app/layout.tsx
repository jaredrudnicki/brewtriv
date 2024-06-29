import { GeistSans } from "geist/font/sans";
import ogImage from './opengraph-image.png';
import twitterImage from './twitter-image.png';
import "./globals.css";
import Header from "@/components/Header";

const defaultUrl = process.env.NODE_ENV === "production" 
  ? 'https://www.brewtriv.com'
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BrewTriv",
  description: "The social trivia app helping you become a trivia buff",
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
  },
  twitter: {
    images: [
      {
        url: twitterImage.src,
        width: twitterImage.width,
        height: twitterImage.height
      },
    ]
  },
  type: 'website',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <Header />
        <main className="min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
