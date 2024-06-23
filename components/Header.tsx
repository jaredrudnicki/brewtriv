import { createClient } from "@/utils/supabase/client";
import AuthButton from "./AuthButton";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="jheader ">
      <div className="animate-in jcontainer flex items-center">
        <h1> JRIVIA </h1>
        <AuthButton />
      </div>
    </div>
  );
}
