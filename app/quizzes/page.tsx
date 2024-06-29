"use client";
import { createClient } from "@/utils/supabase/client";
import Quiz from "@/components/Quiz";
import RegularLayout from "../regular-layout";
import { useState, useEffect } from "react";
import { getQuizzes, getUser } from "@/utils/actions";
import { User } from "@supabase/supabase-js";
import ogImage from './opengraph-image.png';
import twitterImage from './twitter-image.png';

const defaultUrl = process.env.NODE_ENV === "production" 
  ? 'https://www.brewtriv.com'
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BrewTriv",
  description: "The social trivia app helping you become a trivia buff",
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
  },
  twitter: {
    images: [
      {
        url: twitterImage.src,
        width: twitterImage.width,
        height: twitterImage.height
      },
    ]
  },
  type: 'website',
}



export default function Page() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>({} as User);
  const [disabled, setDisabled] = useState(true);
  const [quizzesData, setQuizzesData] = useState<any[] | null>([{}]);
  const [step, setStep] = useState(0);
  const [limit, setLimit] = useState(9);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const quizzes = await getQuizzes(step, 2);
      setQuizzesData(quizzes);

      let user = await getUser();
      setUserData(user);

      if (user) {
        setDisabled(false);
      }
      setLoading(false);
    })();
  }, []);

  const showMore = async () => {
    setStep(limit + 1);
    setLimit(limit + 10);
    const quizzes = await getQuizzes(step, limit);
    // @ts-ignore
    setQuizzesData([...quizzesData, ...quizzes]);
  };

  return (
    <RegularLayout>
      {!loading && (
        <div>
          {quizzesData?.map((quiz) => {
            return <Quiz quiz={quiz} disabled={disabled} user={userData} />;
          })}
          <button
            onClick={() => showMore()}
            className="mb-8 w-full rounded border-2 p-2 hover:border-white"
          >
            show more
          </button>
        </div>
      )}
      {loading && <div>loading</div>}
    </RegularLayout>
  );
}
