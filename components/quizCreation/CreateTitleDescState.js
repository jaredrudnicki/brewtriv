"use client";
import {showEye } from "@/utils/showIcons";

export default function CreateTitleQuizDescState({quizTitle, setQuizTitle, quizDescription, setQuizDescription, showQuizTitle, setShowQuizTitle, showDescription, setShowDescription}) {
    return (
        <div>
            <div className="flex flex-row justify-between">
                <label htmlFor="quiz-title">Quiz Title</label>
                <div onClick={() => setShowQuizTitle(!showQuizTitle)}>
                    {showEye(showQuizTitle)}
                </div>
            </div>
            {showQuizTitle && (
                <div onBlur={() => setShowQuizTitle(!showQuizTitle)}>
                    <input
                        type="text"
                        id="quiz-title"
                        className="jinput mb-4 w-full"
                        placeholder="History Quiz"
                        required
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                    />
                </div>
            )}
            <div className="flex flex-row justify-between">
                <label htmlFor="quiz-description">Description</label>
                <div onClick={() => setShowDescription(!showDescription)}>
                    {showEye(showDescription)}
                </div>
            </div>
            {showDescription && (
                <textarea
                    id="quiz-description"
                    rows={4}
                    className="jinput w-full"
                    placeholder="This is a quiz about history"
                    onChange={(e) => setQuizDescription(e.target.value)}
                    value={quizDescription}
                    onBlur={() => setShowDescription(false)}
                />
            )}
        </div>
    );
}