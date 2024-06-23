"use client";
import { User } from "@supabase/supabase-js";
import { ProfileStatsData } from "@/utils/types";
import { getUser } from "@/utils/actions";
import { useEffect, useState } from "react";

export default function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  let [user, setUser] = useState<User | null>(null);
  let [profile, setProfile] = useState<ProfileStatsData | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setUser(user);
    })();
  }, []);
  // TODO
  return <p>{id}</p>;
}
