"use client";

import { useState } from "react";
import { addDaily, getUser, getDailyDate } from "@/utils/actions";

export default function Page() {
    const [question, setQuestion] = useState("");
    const [correct, setCorrect] = useState("");
    const [incorrect, setIncorrect] = useState(["", "", ""]);
    const [error, setError] = useState("");

    const handleIncorrect = (e: any, index: number) => {
        const value = e.target.value;
        const newarr = [...incorrect];
        newarr[index] = value;
        setIncorrect([...newarr]);
    };

    const handleAddDaily = () => {
        //check any are empty
        if (question.length === 0 || correct.length === 0) {
            setError("An item was left blank.");
            return;
        }

        incorrect.map((option, i) => {
            if (option.length === 0) {
                setError("An item was left blank.");
                return;
            }
        });

        //encode the correct and incorrect options and pass to database
        addDaily(question, correct, incorrect);
        setQuestion("");
        setCorrect("");
        setIncorrect(["","",""]);
        setError("Success!");
    };

    return (
        <>
            <div className="flex flex-col">
                <label htmlFor="daily-question">Question</label>
                <input
                    value={question}
                    onChange={(e: any) => setQuestion(e.target.value)}
                    className="jinput"
                    type="text"
                    id="daily-question"
                />

                <label htmlFor="daily-correct">Correct</label>
                <input
                    value={correct}
                    onChange={(e: any) => setCorrect(e.target.value)}
                    className="jinput"
                    type="text"
                    id="daily-correct"
                />

                <label htmlFor="daily-incorrect">Incorrect</label>
                <div id="daily-incorrect">
                    {incorrect.map((option, i) => {
                        return (
                            <input
                                value={option}
                                onChange={(e: any) => handleIncorrect(e, i)}
                                className="jinput mb-2 w-full"
                                type="text"
                                id={`daily-incorrect-${i}`}
                            />
                        );
                    })}
                </div>

                <button
                    onClick={() => handleAddDaily()}
                    className="mt-4 w-full rounded border-2 p-2 hover:border-white"
                >
          Submit
                </button>
                {error && <p>{error}</p>}
            </div>
        </>
    );
}
