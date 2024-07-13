import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { getProfile } from "@/utils/actions";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/v1`,
      },
    });

    //if theyve confirmed
    (async()=> {
        if(data.user) {
            const profile = await getProfile(data.user.id)
            if(profile === undefined) {
                return redirect("/signup?message=Email already exists please log in")
            }
        }
    })()

    if (error) {
        return redirect("/signup?message=Could not authenticate user");
    }

    return redirect("/signup?message=Check your email to continue sign in process");
  };

  return (
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

      
      <form className="animate-in text-foreground mt-16 flex w-full flex-1 flex-col justify-center gap-2 text-white">
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
          formAction={signUp}
          className="text-foreground mb-2 rounded-md bg-green-700 px-4 py-2 text-white"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center text-yellow-400">
            {searchParams.message}
          </p>
        )}
        <p className="text-center">Already have an account? <Link href="/login" className="underline">Log In</Link></p>
        
      </form>
    </div>
  );
}
