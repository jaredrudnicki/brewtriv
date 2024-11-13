"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/utils/types";
import { logout } from "@/lib/user/userSlice";

export default function AuthButton() {
    const dispatch = useDispatch();
    const { push } = useRouter();
    const user = useSelector((state: UserState) => state.user);

    const signOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        dispatch(logout({}));

        return push("/login");
    };
    return (
        <>
        {user && user?.user_id === null && (
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
        )}
        {(user && user?.stripe_customer_id !== null) && (
            
            <div className="w-full border-2 border-white rounded-md p-5 mb-5">
                <h3 className="mb-2">
                    Subscribe to our premium plan!
                </h3>

                <li>create quizzes with the help of AI</li>

                <button>subscribe</button>
            </div>
        )}
        </>
    );
}
