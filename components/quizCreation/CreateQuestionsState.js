"use client";
import { useState } from "react";
import {Button, Pagination} from "@nextui-org/react";
import { trash } from "@/utils/showIcons";

export default function CreateQuestionsState({currentTab, setCurrentTab, questions, showError, handlePrevious, handleNext, handleAdd, handleIncorrect, handleInput, handleAddIncorrect, handleRemoveIncorrect, handleDeleteQuestion, handleAddQuiz}) {
    const [incorrectOptionHover, setIncorrectOptionHover] = useState(false);

    return (
        <form>
            <div className="rounded-md bg-gray-800 p-4">
                <div className="flex w-full flex-row justify-between">
                    <div className="align-middle">
                        <label
                            htmlFor="correct"
                            className="mr-2 align-top text-xl"
                        >
                            {`Question ${currentTab}`}
                        </label>
                        {currentTab > 1 && (
                            <button onClick={(e) => handleDeleteQuestion(e)}>
                                {trash("red")}
                            </button>
                        )}
                    </div>
                </div>
                <input
                    id="question"
                    type="text"
                    className="mb-4 mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter question here"
                    value={questions[currentTab-1].question}
                    onChange={(e) => handleInput(e, "question")}
                    required
                />
                <label htmlFor="correct"> Correct</label>
                <input
                    id="correct"
                    type="text"
                    className="mb-4 mt-2 block rounded border-2 border-green-900 bg-gray-50 p-2 text-sm placeholder-gray-400 bg-gray-700"
                    placeholder="Correct answer"
                    value={questions[currentTab-1].correct}
                    onChange={(e) => handleInput(e, "correct")}
                    required
                />

                <label htmlFor="incorrect-options"> Incorrect</label>
                <button
                    onClick={() => handleAddIncorrect()}
                    onMouseOver={() => setIncorrectOptionHover(true)}
                    onMouseLeave={() => setIncorrectOptionHover(false)}
                    className="mb-2 ml-4 rounded border-2 border-inherit pl-2 pr-2 hover:border-white"
                >
                    {incorrectOptionHover ? `+ add incorrect option` : `+`}
                </button>
                <div className="flex flex-row flex-wrap" id="incorrect-options">
                    {questions[currentTab-1].incorrect.map((incorrectOption, id) => {
                        return (
                            <div className="mb-4 flex" key={`incorrect-${id}`}>
                                <input
                                    id={`incorrect-${id}`}
                                    type="text"
                                    className="block rounded border-2 border-red-900 bg-gray-50 p-2 text-sm placeholder-gray-400 bg-gray-700"
                                    placeholder="Incorrect option"
                                    value={incorrectOption}
                                    required
                                    onChange={(e) => handleIncorrect(e, id)}
                                />
                                <button
                                    className="w-100 mr-10 block rounded-r bg-red-800 pl-4 pr-4"
                                    onClick={(e) => handleRemoveIncorrect(e, id)}
                                >
                        x
                                </button>
                            </div>
                        );
                    })}
                </div>

                <hr className="mt-4" />
            
            
                <div className="flex flex-row justify-between">
                    <Button
                        size="sm"
                        color="primary"
                        onPress={() => handlePrevious()}
                    >
                    Previous
                    </Button>

                    <Pagination
                        size="sm"
                        showShadow
                        total={questions.length}
                        page={currentTab}
                        onChange={setCurrentTab}
                    />

                    <Button
                        size="sm"
                        color="primary"
                        onPress={() => {
                            if (currentTab === questions.length) {
                                handleAdd();
                            } else {
                                handleNext();
                            }
                        }}
                    >
                        {(currentTab === questions.length) ? "Add": "Next"}
                    </Button>
                </div>
            </div>
            <button
                className="mt-10 w-full rounded border-slate-500 border-2 p-2 hover:border-white"
                // onSubmit={(e) => addQuiz(quizTitle, quizDescription, questions)}
                onClick={(e) => handleAddQuiz(e)}
            >
            Submit
            </button>
            {showError !== "" && <p>{showError}</p>}
        </form>
    );
}