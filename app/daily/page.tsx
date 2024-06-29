"use client";
var CryptoJS = require("crypto-js");

import {
  getDaily,
  getProfile,
  getToday,
  getUser,
  getYesterday,
  shuffleArray,
  updateProfileDailyCorrect,
  updateProfileDailyIncorrect,
  decryptIncorrect,
  decryptCorrect,
} from "@/utils/actions";
import { useEffect, useState } from "react";
import RegularLayout from "../regular-layout";
import { ProfileStatsData } from "@/utils/types";
import { User } from "@supabase/auth-js/src/lib/types";
import { useRouter } from "next/navigation";

export default function Page() {
  const { push } = useRouter();
  let [today, setToday] = useState("");
  let [yesterday, setYesterday] = useState("");
  let [user, setUser] = useState<User | null>(null);
  let [profile, setProfile] = useState<ProfileStatsData>({} as ProfileStatsData);

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

      user = await getUser();
      setUser(user);

      if (user !== null) {
        profile = await getProfile(user.id);
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

      let correctOption = decryptCorrect(daily.correct);
      let incorrectOptions = decryptIncorrect(daily.incorrect);
      setCorrect(correctOption);
      setOptions(shuffleArray([...incorrectOptions, correctOption]));
    })();
  }, []);

  const checkCorrect = () => {
    if (user === null) {
      return push("/login");
    }
    if (selected === correct) {
      //TODO: update user stats... (should update streaks, daily wins, latest daily) all that good stuff
      updateProfileDailyCorrect(user, profile, yesterday, today);
      setTodayCorrect(true);
    } else {
      //TODO: update user stats... (should update streaks, daily wins, latest daily) all that good stuff
      updateProfileDailyIncorrect(user, profile, today);
      setTodayIncorrect(true);
    }
    setCanPlay(false);
    setPlayed(true);
  };

  const getButtonStyle = (option: string) => {
    if (played) {
      if (todayIncorrect) {
        if (option === selected && option !== correct) {
          return "w-full p-2 border-2 bg-red-500 my-1 rounded";
        } else if (option === correct) {
          return "w-full p-2 border-2 bg-green-500 my-1 rounded";
        }
        return "w-full p-2 border-2 bg-gray-900 my-1 rounded disabled:bg-slate-900 disabled:text-slate-600";
      } else {
        if (option === correct) {
          return "w-full p-2 border-2 bg-green-500 my-1 rounded";
        }
        return "w-full p-2 border-2 bg-gray-900 my-1 rounded disabled:bg-slate-900 disabled:text-slate-600";
      }
    } else {
      if (option === selected) {
        return "w-full p-2 border-2 bg-blue-900 my-1 rounded";
      } else {
        return "w-full p-2 border-2 bg-gray-900 my-1 rounded disabled:bg-slate-900 disabled:text-slate-600";
      }
    }
  };

  return (
    <RegularLayout>
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
    </RegularLayout>
  );
}
