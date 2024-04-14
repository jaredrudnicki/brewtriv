"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");

  const baseQuestion = {
    question: "",
    correct: "",
    incorrect: ["", "", "", ""],
  };
  const [questions, setQuestions] = useState([baseQuestion]);
  const [currentTab, setCurrentTab] = useState(0);

  const [incorrectOptionHover, setIncorrectOptionHover] = useState(false);

  const addQuiz = async (e, quizTitle, quizDescription, questions) => {
    e.preventDefault();
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("quizzes").insert([
      {
        title: quizTitle,
        description: quizDescription,
        questions: questions,
        user_id: user?.id,
      },
    ]);
  };

  const handlePrevious = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };
  const handleNext = () => {
    if (currentTab < questions.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handleAdd = () => {
    setQuestions([...questions, baseQuestion]);
    setCurrentTab(currentTab + 1);
  };

  const handleIncorrect = (e, index) => {
    let value = e.target.value;
    let newarr = [...questions];
    newarr[currentTab].incorrect[index] = value;
    setQuestions([...newarr]);
  };

  const handleInput = (e, field) => {
    let value = e.target.value;
    let newarr = [...questions];
    console.log(e.target.value);
    if (field === "question") {
      newarr[currentTab].question = value;
    } else if (field === "correct") {
      newarr[currentTab].correct = value;
    }

    setQuestions([...newarr]);
  };

  const handleAddIncorrect = () => {
    let newarr = [...questions];
    newarr[currentTab].incorrect = [...questions[currentTab].incorrect, ""];
    setQuestions([...newarr]);
  };

  const handleRemoveIncorrect = (e, id) => {
    console.log(id);
    let newarr = [...questions];
    let incorrect = newarr[currentTab].incorrect;
    incorrect.splice(id, 1);
    newarr[currentTab].incorrect = incorrect;
    setQuestions([...newarr]);
  };

  return (
    <div className="container mx-auto">
      <form>
        <div>
          <label htmlFor="quiz-title">Quiz Title</label>
          <input
            type="text"
            id="quiz-title"
            className="mb-4 mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="History Quiz"
            required
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />

          <label htmlFor="quiz-decription">Quiz Description</label>
          <textarea
            id="quiz-description"
            rows={4}
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="This is a quiz about history"
            onChange={(e) => setQuizDescription(e.target.value)}
            value={quizDescription}
          />
        </div>

        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />

        <div className="row">
          <label htmlFor="correct">{`Question ${currentTab + 1}`}</label>
          <input
            id="question"
            type="text"
            className="mb-4 mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Enter question here"
            value={questions[currentTab].question}
            onChange={(e) => handleInput(e, "question")}
            required
          />
          <label htmlFor="correct"> Correct</label>
          <input
            id="correct"
            type="text"
            className="mb-4 mt-2 block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Correct answer"
            value={questions[currentTab].correct}
            onChange={(e) => handleInput(e, "correct")}
            required
          />
        </div>
        <label htmlFor="incorrect-options"> Incorrect</label>
        <button
          onClick={() => handleAddIncorrect()}
          onMouseOver={() => setIncorrectOptionHover(true)}
          onMouseLeave={() => setIncorrectOptionHover(false)}
          className="mb-2 ml-4 rounded-md border-2 border-inherit pl-2 pr-2"
        >
          {incorrectOptionHover ? `+ add incorrect option` : `+`}
        </button>
        <div className="flex flex-row flex-wrap" id="incorrect-options">
          {questions[currentTab].incorrect.map((incorrectOption, id) => {
            return (
              <div className="mb-4 flex" key={`incorrect-${id}`}>
                <input
                  id={`incorrect-${id}`}
                  type="text"
                  className="block rounded-l border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
        <div className="mt-10 flex flex-row justify-between">
          <button
            onClick={() => handleAdd()}
            className="col-1 mt-1 block justify-end rounded-md bg-blue-500 pl-5 pr-5 disabled:bg-slate-500 disabled:text-slate-600"
          >
            add question
          </button>
          <div className="flex flex-row">
            <button
              onClick={() => handlePrevious()}
              disabled={currentTab === 0}
              className="mt-1 block rounded-md bg-blue-500 pl-5 pr-5 disabled:bg-slate-500 disabled:text-slate-600"
            >{`< prev`}</button>
            <button
              onClick={() => handleNext()}
              disabled={currentTab === questions.length - 1}
              className="mt-1 block rounded-md bg-blue-500 pl-5 pr-5 disabled:bg-slate-500 disabled:text-slate-600"
            >
              {`next >`}
            </button>
          </div>
        </div>

        <button
          type="submit"
          // onSubmit={(e) => addQuiz(quizTitle, quizDescription, questions)}
          onClick={(e) => addQuiz(e, quizTitle, quizDescription, questions)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
