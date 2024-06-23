import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default async function Index() {
  const supabase = createClient();
  const { data: questions } = await supabase.from("questions").select();

  return (
    <div className="jcontainer">
      <Header />
    </div>
  );
}
