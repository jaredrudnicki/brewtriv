import SideNav from "@/components/sidenav";

// @ts-ignore
export default function RegularLayout({ children }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64 sticky top-0">
                <SideNav />
            </div>
            <div className="flex-grow px-6 md:overflow-y-auto md:p-12">        
                {children}
            </div>
            <div className="w-full flex-none md:w-40">
        
            </div>
        </div>
    );
}
