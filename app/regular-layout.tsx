import Navbar from "@/components/Navbar";

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

// @ts-ignore
export default function RegularLayout({ children }) {
  return (
    <div className="grid grid-cols-5">
      <div className="ml-3 mt-3">
        <Navbar />
      </div>
      <div className="col-span-3 ml-3 mt-3 ">{children}</div>
    </div>
  );
}
