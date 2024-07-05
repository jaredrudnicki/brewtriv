import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if(data.user === null) {
      return redirect('/login?message=No user with that email please sign up')
    }

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    return redirect("/quizzes");
  };


  return (
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

      
      <form className="animate-in text-foreground mt-16 flex w-full flex-1 flex-col justify-center gap-2 text-white">
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
        />
        <SubmitButton
          formAction={signIn}
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
      </form>
    </div>
  );
}
