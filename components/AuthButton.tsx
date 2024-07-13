"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const supabase = createClient();
  const { push } = useRouter();
  let [user, setUser] = useState<User | null>({} as User);

  useEffect(() => {
    (async() => {
      const {
        data,
      } = await supabase.auth.getUser();
      setUser(data.user);
    })();
    
  }, [])

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);

    return push("/login");
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
