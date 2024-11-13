"use client";

import {
    getDaily,
    getProfile,
    getToday,
    getYesterday,
    shuffleArray,
    updateProfileDailyCorrect,
    updateProfileDailyIncorrect,
    decryptIncorrect,
    decryptCorrect,
} from "@/utils/actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Page() {
    let user = useSelector((state) => state.user);
    const { push } = useRouter();
    let [today, setToday] = useState("");
    let [yesterday, setYesterday] = useState("");
    let [profile, setProfile] = useState({});

    const [question, setQuestion] = useState("");
    const [canPlay, setCanPlay] = useState(false);
    const [options, setOptions] = useState([""]);
    const [correct, setCorrect] = useState("");

    const [selected, setSelected] = useState("");
    const [played, setPlayed] = useState(false);
    const [todayCorrect, setTodayCorrect] = useState(false);
    const [todayIncorrect, setTodayIncorrect] = useState(false);

    useEffect(() => {

        (async () => {
            today = getToday();
            setToday(today);

            yesterday = getYesterday();
            setYesterday(yesterday);
            if (user && user?.user_id !== null) {
                profile = await getProfile(user.user_id);
                setProfile(profile);

                if (profile !== null) {
                    if (profile.latest_daily !== today) {
                        setCanPlay(true);
                    } else {
                        setPlayed(true);
                        if (profile.current_daily_streak !== 0) {
                            setTodayCorrect(true);
                        }
                    }
                }
            }

            const daily = await getDaily();
            setQuestion(daily.question);

            const correctOption = decryptCorrect(daily.correct);
            const incorrectOptions = decryptIncorrect(daily.incorrect);
            setCorrect(correctOption);
            setOptions(shuffleArray([...incorrectOptions, correctOption]));
        })();
    }, []);

    const checkCorrect = () => {
        if (user && user?.user_id === null) {
            return push("/login");
        }
        if (selected === correct) {
            updateProfileDailyCorrect(user, profile, yesterday, today);
            setTodayCorrect(true);
        } else {
            updateProfileDailyIncorrect(user, profile, today);
            setTodayIncorrect(true);
        }
        setCanPlay(false);
        setPlayed(true);
    };

    const getButtonStyle = (option) => {
        if (played) {
            if (todayIncorrect) {
                if (option === selected && option !== correct) {
                    return "w-full p-2 border-2 bg-red-500 my-1 rounded";
                } else if (option === correct) {
                    return "w-full p-2 border-2 bg-green-500 my-1 rounded";
                }
                return "w-full p-2 border-2 bg-gray-900 my-1 rounded disabled:bg-slate-900 disabled:text-slate-600";
            } 
            if (option === correct) {
                return "w-full p-2 border-2 bg-green-500 my-1 rounded";
            }
            return "w-full p-2 border-2 bg-gray-900 my-1 rounded disabled:bg-slate-900 disabled:text-slate-600";
			
        } 
        if (option === selected) {
            return "w-full p-2 border-2 bg-blue-900 my-1 rounded";
        } 
        return "w-full p-2 border-2 bg-gray-900 my-1 rounded disabled:bg-slate-900 disabled:text-slate-600";
			
		
    };

    return (
        <>
            <h1 className="mb-4 text-xl">{question}</h1>

            {played && (
                <div className="my-4 rounded bg-gray-900 p-2">
                    {todayCorrect && (
                        <p className="w-full text-center text-xl">👏 Well Done! 👏</p>
                    )}
                    <p>{`longest streak: ${profile?.longest_daily_streak}`}</p>
                    <p>{`current streak: ${profile?.current_daily_streak}`}</p>
                </div>
            )}

            <div className="mb-4 grid gap-4 md:grid-cols-2">
                {options.map((option) => {
                    return (
                        <button
                            className={getButtonStyle(option)}
                            onClick={() => setSelected(option)}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            <button
                disabled={played}
                onClick={() => checkCorrect()}
                className="w-full rounded bg-blue-500 px-5 py-2 disabled:bg-slate-900 disabled:text-slate-600"
            >
        Submit
            </button>
        </>
    );
}
