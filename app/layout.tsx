import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "@/components/Header";

const defaultUrl = process.env.NODE_ENV === "production" 
  ? 'https://www.brewtriv.com'
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BrewTriv",
  description: "The social trivia app helping you become a trivia buff",
  openGraph: {
    images: '/opengraph-image.png',
  },
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
