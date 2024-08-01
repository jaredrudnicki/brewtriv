"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { profileIcon } from "@/utils/showIcons";

export default function AuthButton() {
  const pathname = usePathname();
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

  return (
    !user && (
      <div className="w-full bg-yellow-700 rounded-md p-5 mb-5">
      <h3 className="mb-2">
        We noticed you are not logged in. To use this site, first log in or create an account.
      </h3>
     
      <div className="w-full flex flex-row gap-2">
        <Link
          href="/login"
          className="py-2 px-3 flex rounded-md no-underline bg-green-700 hover:bg-green-600 w-1/2"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="py-2 px-3 flex rounded-md no-underline bg-green-700 hover:bg-green-600 w-1/2"
        >
          Sign Up
        </Link>
      </div>

    </div>
    )
  );
}
