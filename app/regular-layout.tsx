import Navbar from "@/components/Navbar";
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
