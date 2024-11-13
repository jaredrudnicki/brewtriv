"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { getUser } from "@/utils/auth";

export default function AuthButton() {
    let user = getUser();

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
