"use client"
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "@/components/submit-button";
import { getProfile } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AlertBox from "@/components/AlertBox";
import AuthLayout from "../auth-layout";

export default function SignUp() {

  const supabase = createClient();
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const signUp = async () => {
    const isProd = process.env.NODE_ENV === 'production';
    const redirectLink = isProd ? 'https://www.brewtriv.com/quizzes' : 'http://localhost:3000/quizzes';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectLink,
      },
    });

    //if theyve confirmed
    (async()=> {
        if(data.user) {
            const profile = await getProfile(data.user.id)
            if(profile === undefined) {
                setShowAlert(true);
                setAlertType("error");
                setAlertMessage("Email already exists please log in");
                return;
            }
        }
    })()

    if (error) {
        setShowAlert(true);
        setAlertType("error");
        setAlertMessage("message=Could not authenticate user");
        return;
    }

    setShowAlert(true);
    setAlertType("success");
    setAlertMessage("Check your email to continue sign in process");
    return;
  };

  return (
    <AuthLayout>
    {AlertBox(showAlert, alertType, alertMessage)}
    <div className="jcontainer justify-center gap-2 px-8 sm:max-w-md">
      <Link
        href="/quizzes"
        className="text-foreground bg-btn-background hover:bg-btn-background-hover group absolute flex items-center rounded-md px-4 py-2 text-sm no-underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      
      <div className="animate-in text-foreground mt-16 flex w-full flex-1 flex-col justify-center gap-2 text-white">
        <h1 className="w-full text-center text-white text-lg">Sign Up</h1>
        <p className="text-yellow-400 text-center">In order to play on brewtriv.com, you need to create an account and be logged in!</p>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2 border-white"
          name="email"
          placeholder="you@example.com"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2 border-white"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton
          onClick={() => signUp()}
          className="text-foreground mb-2 rounded-md bg-green-700 px-4 py-2 text-white"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        <p className="text-center">Already have an account? <Link href="/login" className="underline">Log In</Link></p>
        
      </div>
    </div>
    </AuthLayout>
  );
}
