"use client"
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "@/components/submit-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertBox from "@/components/AlertBox";
import RegularLayout from "../regular-layout";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const signIn = async () => {
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if(data.user === null) {
      setShowAlert(true);
      setAlertType('error')
      setAlertMessage("No user with that email, please sign up");
      return;
      //alert('No user with that email, please sign up')
      //return redirect('/login?message=No user with that email please sign up')
    }

    if (error) {
      setShowAlert(true);
      setAlertType('error')
      setAlertMessage("Could not authenticate user");
      return;
      //return redirect("/login?message=Could not authenticate user");
    }
    setShowAlert(false);
    push('/quizzes');
    //return redirect("/quizzes");
  };

  const resetPassword = async () => {
    //verify email 
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email');
        return;
    }

    const isProd = process.env.NODE_ENV === 'production';
    const redirectLink = isProd ? 'https://www.brewtriv.com/reset-password' : 'http://localhost:3000/reset-password';
    //send reset link
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectLink,
    });

    if(error){
      setShowAlert(true);
      setAlertType('error');
      setAlertMessage('Error resetting password: ' + error.message);
      return;
    } else {
      setShowAlert(true);
      setAlertType('success');
      setAlertMessage(`Recovery instructions sent to ${email}. Please check your spam folder.`)
      return;
    }
  }


  return (
    <RegularLayout>
    {AlertBox(showAlert, alertType, alertMessage)}
    <div className="jcontainer justify-center gap-2 px-8 sm:max-w-md">
      <Link
        href="/quizzes"
        className="text-foreground text-white border border-slate-500 hover:border-white group absolute flex items-center rounded-md px-4 py-2 text-sm no-underline"
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
        <h1 className="w-full text-center text-white text-lg">Log In</h1>
        <p className="text-yellow-400 text-center">In order to play on brewtriv.com, you need to create an account and be logged in!</p>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2 border-white"
          name="email"
          placeholder="you@example.com"
          required
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md border bg-inherit px-4 py-2 border-white"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <button className="underline italic text-gray-200 text-left"
          onClick={(e) => {
            resetPassword();
          }}
        >Forgot Password?</button>
        <SubmitButton
          onClick={() => {signIn()}}
          className="text-foreground mb-2 rounded-md bg-green-700 px-4 py-2 text-white"
          pendingText="Logging In..."
        >
          Log In
        </SubmitButton>
        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center text-yellow-400">
            {searchParams.message}
          </p>
        )}
        <p className="text-center">Dont have an account? <Link href="/signup" className="underline">Sign Up</Link></p>
      </div>
    </div>
    </RegularLayout>
  );
}
