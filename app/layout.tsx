import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import {NextUIProvider} from "@nextui-org/react";
import SideNav from "@/components/sidenav";

import "./globals.css";

const defaultUrl = process.env.NODE_ENV === "production" 
    ? 'https://www.brewtriv.com'
    : 'http://localhost:3000';

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "BrewTriv",
    description: "The social trivia app helping you become a trivia buff",
    openGraph: {
        images: [
            {
                url: `${defaultUrl}/opengraph-image.png`,
                width: 1200,
                height: 600,
            },
        ],
    },
    twitter: {
        images: [
            {
                url: `${defaultUrl}/twitter-image.png`,
                width: 1200,
                height: 600,
            },
        ]
    },
    type: 'website',
};

export default async function RootLayout({
    children,
}: {
  children: React.ReactNode;
}) {
    return (
        <html lang="en" className={GeistSans.className}>
          <head>
            <link rel="preconnect" href="https://va.vercel-scripts.com" />
          </head>
            <body className="bg-background text-foreground bg-brewtriv-gray">
              <NextUIProvider>
                

                <main className="dark min-h-screen flex-col">
                <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                    <div className="w-full flex-none md:w-64 sticky top-0">
                        <SideNav />
                    </div>
                    <div className="flex-grow text-white px-6 md:overflow-y-auto md:p-12">        
                        {children}
                    </div>
                    <div className="w-full flex-none md:w-40">
                
                    </div>
                </div>
                </main>
                
              </NextUIProvider>
              <Analytics />
            </body>
        </html>
    );
}
