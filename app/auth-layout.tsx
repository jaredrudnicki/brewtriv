import Header from "@/components/Header";

// @ts-ignore
export default function AuthLayout({ children }) {
  return (
    <>
    <Header />
    <div>{children}</div>
    </>
  );
}
