import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

// @ts-ignore
export default function RegularLayout({ children }) {
  return (
    <>
    <Header />
    <div className="grid grid-cols-5 text-white">
      <div className="ml-3 mt-3">
        <Navbar />
      </div>
      <div className="col-span-3 ml-3 mt-3 ">{children}</div>
    </div>
    </>
  );
}
