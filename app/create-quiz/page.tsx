"use client";
import QuizForm from "@/components/QuizForm";

// import { User } from "@supabase/supabase-js";
// import { ProfileStatsData } from "@/utils/types";
import { getIsPremiumUser, getUser } from "@/utils/actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// export default function Profile() {

//   const supabase = createClient();
//   const [loading, setLoading] = useState(true);
//   let [user, setUser] = useState<User | null>(null);
//   let [profile, setProfile] = useState<ProfileStatsData | null>(null);

export default function Page() {
    const { push } = useRouter();

    let [isPremiumUser, setIsPremiumUser] = useState(false);

    useEffect(() => {
        (async () => {
            const user = await getUser();
            if (user === null) {
                return push("/login");
            } 
            isPremiumUser = await getIsPremiumUser(user.id);
            setIsPremiumUser(isPremiumUser);
            console.log(isPremiumUser);
			
        })();
    }, []);

    return (
        <QuizForm isPremiumUser={isPremiumUser}/>
    );
}
