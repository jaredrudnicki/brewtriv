"use client";
import { createClient } from "@/utils/supabase/client";

import { User } from "@supabase/supabase-js";
import { ProfileStatsData, UserState } from "@/utils/types";
import { getUser, getProfile, updateProfileName } from "@/utils/actions";
import { profileIcon } from "@/utils/showIcons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { check, logOut } from "@/utils/showIcons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/user/userSlice";

export default function Profile() {
    const dispatch = useDispatch();
    let user = useSelector((state : UserState) => state.user);
    const { push } = useRouter();
    const [loading, setLoading] = useState(true);
    let [profile, setProfile] = useState<ProfileStatsData | null>(null);
    const [profileName, setProfileName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        (async () => {
            // user = await getUser();
            if (user && user?.user_id !== null) {
                profile = await getProfile(user?.user_id);
                setProfile(profile);
            } else {
                return push("/login");
            }

            setLoading(false);
        })();
    }, []);

    const getSoloSuccessRate = () => {
        if (profile) {
            if (profile?.play_solo_total === 0) {
                return 0;
            }
            return profile?.play_solo_correct / profile?.play_solo_total;
        }
        return 0;
    };

    const signOut = async () => {
        dispatch(logout({}));
        const supabase = createClient();
        await supabase.auth.signOut();
        return push("/login");
    };

    return (
        <>
            {!loading && user && (
                <div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-2">
                            {profileIcon()}
                            <p className="text-xl">{user.email}</p>
                        </div>
                        <button 
                            onClick={async() => await signOut()}
                            className="flex flew-row gap-1 bg-red-700 w-1/3 justify-center p-2 rounded"
                        >
                            {logOut()}
                            logout
                        </button>
                    </div>

                    <hr />

                    <br />

                    <label
                        htmlFor="profile-name"
                        className="text-sm font-semibold text-gray-400"
                    >
            profile name
                    </label>
                    <div className="flex flex-row">
                        <input
                            type="text"
                            id="profile-name"
                            className="jinput"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                        />
                        <button
                            disabled={profile?.profile_name === profileName}
                            className="rounded bg-blue-900 px-2 hover:bg-blue-800 disabled:bg-slate-900 disabled:text-slate-600"
                            onClick={async() => {
                                updateProfileName(profileName);
                                setProfileName(profileName || profile?.profile_name || "");
                                setErrorMessage('success!');
                            }}
                        >
                            {check()}
                        </button>
                        <p className="m-2">
                            {errorMessage}
                        </p>
                    </div>

                    <br />

                    <label
                        htmlFor="stats-table"
                        className="text-sm font-semibold text-gray-400"
                    >
            profile stats
                    </label>
                    <table className="w-full table-auto text-left " id="stats-table">
                        <tbody className="">
                            <tr className="border-2 odd:bg-gray-800 even:bg-gray-900">
                                <th scope="row">Current Daily Streak</th>
                                <td>{`${profile?.current_daily_streak} 🔥`}</td>
                            </tr>
                            <tr className="border-2 odd:bg-gray-800 even:bg-gray-900">
                                <th scope="row">Longest Daily Streak</th>
                                <td>{`${profile?.longest_daily_streak} 🔥`}</td>
                            </tr>
                            <tr className="border-2 odd:bg-gray-800 even:bg-gray-900">
                                <th scope="row">Play Together Wins</th>
                                <td>{profile?.play_together_wins}</td>
                            </tr>
                            <tr className="border-2 odd:bg-gray-800 even:bg-gray-900">
                                <th scope="row">Play Solo Success Rate</th>
                                <td>{`${getSoloSuccessRate()} (${profile?.play_solo_correct} / ${profile?.play_solo_total})`}</td>
                            </tr>
                            <tr className="border-2 odd:bg-gray-800 even:bg-gray-900">
                                <th scope="row">Quizzes Made</th>
                                <td>{profile?.quizzes_made}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            )}
        </>
    );
}
