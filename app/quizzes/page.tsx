"use client";
import { createClient } from "@/utils/supabase/client";
import Quiz from "@/components/Quiz";
import RegularLayout from "../regular-layout";
import { useState, useEffect } from "react";
import { getQuizzes, getUser } from "@/utils/actions";
import { User } from "@supabase/supabase-js";

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
