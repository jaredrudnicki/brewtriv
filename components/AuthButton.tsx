import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-green-700 hover:bg-green-600 ">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <div className="flex flex-row gap-1">
      <Link
        href="/login"
        className="py-2 px-3 flex rounded-md no-underline bg-green-700 hover:bg-green-600"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="py-2 px-3 flex rounded-md no-underline bg-green-700 hover:bg-green-600"
      >
        Sign Up
      </Link>
  </div>
  );
}
