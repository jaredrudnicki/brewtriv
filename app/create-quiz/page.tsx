"use client";
import QuizForm from "@/components/QuizForm";
import RegularLayout from "../regular-layout";

// import { User } from "@supabase/supabase-js";
// import { ProfileStatsData } from "@/utils/types";
import { getUser } from "@/utils/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import RegularLayout from "../regular-layout";

// export default function Profile() {

//   const supabase = createClient();
//   const [loading, setLoading] = useState(true);
//   let [user, setUser] = useState<User | null>(null);
//   let [profile, setProfile] = useState<ProfileStatsData | null>(null);

export default function Page() {
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      let user = await getUser();
      if (user === null) {
        return push("/login");
      }
    })();
  }, []);

  return (
    <RegularLayout>
      <QuizForm />
    </RegularLayout>
  );
}
