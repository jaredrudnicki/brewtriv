"use client";
import {
    getQuiz,
    getUser,
    getProfile,
    updateProfileSolo,
    decryptQuestions,
} from "@/utils/actions";
import { useEffect, useState } from "react";
import { chevronLeft, chevronRight } from "@/utils/showIcons";
import { useRouter } from "next/navigation";
import JPie from '@/components/JPie';
import { User } from "@supabase/supabase-js";
import { ProfileStatsData } from "@/utils/types";

const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

// @ts-ignore
export default function PlayQuiz({ id }) {
    const { push } = useRouter();
    let [user, setUser] = useState<User | null>(null);
    let [profile, setProfile] = useState<ProfileStatsData | null>(null);
    const [stats, setStats] = useState(0);
    const [showStats, setShowStats] = useState(false);
    const [selected, setSelected] = useState("");
    const [currentTab, setCurrentTab] = useState(0);
    const [quizTitle, setQuizTitle] = useState("");
    const [questions, setQuestions] = useState<any>(getQuiz(id));
    const [guessState, setGuessState] = useState("guessing");
    const [showNext, setShowNext] = useState(false);
    const [options, setOptions] = useState<Map<number, Array<any>> | []>([]);

    const getOptions = (qs: any) => {
        const os = new Map<number, Array<any>>();
        qs.map((q: any, id: any) => {
            const o = shuffleArray([q.correct, ...q.incorrect]);
            os.set(id, o);
        });
        setOptions(os);
    };

    useEffect(() => {
        (async () => {
            user = await getUser();
            setUser(user);

            if(user===null){
                push("/login");
            } else{
                profile = await getProfile(user.id);
                setProfile(profile);
            }

      

            const quiz = await getQuiz(id);
            setQuestions(decryptQuestions(quiz.quiz));
            setQuizTitle(quiz.title);
            getOptions(decryptQuestions(quiz.quiz));
        })();
    }, []);

    const checkSelected = () => {
        if (selected == questions[currentTab].correct) {
            setGuessState("correct");
            setStats(stats + 1);
        } else {
            setGuessState("incorrect");
        }
        setShowNext(true);
    };

    const handleNextQuestion = () => {
        if (currentTab === questions.length - 1) {
            //if end of quiz
            setShowStats(true);
            // @ts-ignore
            updateProfileSolo(stats, questions.length, user, profile);
        } else {
            setCurrentTab(currentTab + 1);
            setGuessState("guessing");
        }
        setSelected("");
        setShowNext(false);
    };

    const getButtonStyle = (option: string) => {
        if(guessState === "correct"){
            if(option === selected){
                return "w-full p-2 border-2 bg-green-500 my-1 rounded";
            }
        }
        if(guessState === "incorrect") {
            if(option === selected) {
                return "w-full p-2 border-2 bg-red-500 my-1 rounded";
            }
            else if (option === questions[currentTab].correct) {
                return "w-full p-2 border-2 bg-green-500 my-1 rounded";
            }
        }
        if (option === selected) {
            return "w-full p-2 border-2 bg-blue-900 my-1 rounded";
        }
        return "w-full p-2 border-2 bg-gray-900 my-1 rounded disabled:bg-slate-900 disabled:text-slate-600 hover:border-blue-900";
    };

    return (
        <>
            <div className="center mb-4 flex w-full items-center justify-between">
                <div>
                    <button
                        onClick={() => push("/quizzes")}
                        className="flex flex-row gap-2 rounded border-2 px-2 py-1 hover:border-white"
                    >
                        {chevronLeft()}
            Play More
                    </button>
                </div>
                <h1> {quizTitle} </h1>
            </div>
            {!showStats && (
                <>
                    {questions.length > 0 && (
                        <div>
                            <h1 className="mb-4 text-3xl">
                                {" "}
                                {questions[currentTab].question}{" "}
                            </h1>
                            <div className="mb-4 grid gap-4 md:grid-cols-2">
                                {// @ts-ignore
                                    options.get(currentTab).map((option: string, id: number) => {
                                        return (
                                            <button
                                                disabled={guessState != "guessing"}
                                                key={`button-${option}-${id}`}
                                                onClick={() => {
                                                    setSelected(option);
                                                }}
                                                className={getButtonStyle(option)}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                            </div>
                            <button
                                disabled={
                                    guessState === "correct" ||
                  guessState === "incorrect" ||
                  selected === ""
                                }
                                className="w-full rounded bg-blue-500 px-5 py-2 disabled:bg-slate-900 disabled:text-slate-600"
                                onClick={() => checkSelected()}
                            >
                Submit
                            </button>
                        </div>
                    )}

                    {showNext && (
                        <div className="flex justify-end">
                            <button
                                className="mt-4 flex flex-row gap-2 rounded border-2 py-1 pl-4 pr-2 hover:border-white"
                                onClick={() => handleNextQuestion()}
                            >
                                <p>
                                    {currentTab === questions.length - 1 ? "Show Stats" : "Next"}
                                </p>
                                {chevronRight()}
                            </button>
                        </div>
                    )}
                </>
            )}

            {showStats && (
                <div className="mt-8 flex flex-col rounded bg-gray-900 p-4">
                    <p className="text-xl">{`${stats}/${questions.length} correct`}</p>

                    <div className="flex flex-row justify-center">
                        <div className="w-1/2">{JPie(stats, questions.length)}</div>
                    </div>
          
                </div>
            )}
        </>
    );
}
