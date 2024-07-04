"use client";
import { useEffect, useState } from "react";
import { addQuiz, getQuiz, editQuiz } from "@/utils/actions";
import { showEye, trash } from "@/utils/showIcons";

export default function QuizForm({ id = undefined, edit = false }) {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [showDescription, setShowDescription] = useState(true);
  const [showQuizTitle, setShowQuizTitle] = useState(true);
  const [showError, setShowError] = useState("");

  const baseQuestion = {
    question: "",
    correct: "",
    incorrect: ["", "", ""],
  };
  const [questions, setQuestions] = useState([baseQuestion]);
  const [currentTab, setCurrentTab] = useState(0);
  const [incorrectOptionHover, setIncorrectOptionHover] = useState(false);

  useEffect(() => {
    if (id != undefined) {
      (async () => {
        const quiz = await getQuiz(id);
        setQuestions(quiz.questions);
        setQuizDescription(quiz.description);
        setQuizTitle(quiz.title);
      })();
    }
  }, []);

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

  const handleIncorrect = (e: any, index: number) => {
    let value = e.target.value;
    let newarr = [...questions];
    newarr[currentTab].incorrect[index] = value;
    setQuestions([...newarr]);
  };

  const handleInput = (e: any, field: string) => {
    let value = e.target.value;
    let newarr = [...questions];
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

  const handleRemoveIncorrect = (e: any, id: any) => {
    let newarr = [...questions];
    let incorrect = newarr[currentTab].incorrect;
    incorrect.splice(id, 1);
    newarr[currentTab].incorrect = incorrect;
    setQuestions([...newarr]);
  };

  const handleDeleteQuestion = () => {
    let newarr = [...questions];
    if (newarr.length == 1) {
      setQuestions([baseQuestion]);
    } else {
      newarr.splice(currentTab, 1);
      setCurrentTab(currentTab - 1);
      setQuestions([...newarr]);
    }
  };

  const handleAddQuiz = (e: any) => {
    e.preventDefault();
    let error = false;
    if (quizTitle === "") {
      error = true;
    }
    questions.forEach((question) => {
      if (
        question.question === "" ||
        question.correct === "" ||
        question.incorrect.includes("")
      ) {
        error = true;
      }
    });

    if (!error) {
      if (edit) {
        // @ts-ignore
        editQuiz(id, quizTitle, quizDescription, questions);
        setShowError("edit success!");
      } else {
        addQuiz(quizTitle, quizDescription, questions);
        setShowError("add success!");
      }
    } else {
      setShowError(
        "Either missing quiz title, or questions have blank question or answers",
      );
    }
  };

  return (
    <div className="jcontainer">
      <form>
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

        <hr className="my-8 h-px border-0 bg-gray-200 bg-gray-700" />

        <div className="rounded-md bg-gray-800 p-4">
          <div className="flex w-full flex-row justify-between">
            <div className="align-middle">
              <label
                htmlFor="correct"
                className="mr-2 align-top text-xl"
              >{`Question ${currentTab + 1}`}</label>
              {currentTab > 0 && (
                <button onClick={() => handleDeleteQuestion()}>
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
            value={questions[currentTab].question}
            onChange={(e) => handleInput(e, "question")}
            required
          />
          <label htmlFor="correct"> Correct</label>
          <input
            id="correct"
            type="text"
            className="mb-4 mt-2 block rounded border-2 border-green-900 bg-gray-50 p-2 text-sm placeholder-gray-400 bg-gray-700"
            placeholder="Correct answer"
            value={questions[currentTab].correct}
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
            {questions[currentTab].incorrect.map((incorrectOption, id) => {
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
            <button
              onClick={() => handlePrevious()}
              disabled={currentTab === 0}
              className="mt-1 block rounded-md bg-blue-500 pl-5 pr-5 disabled:bg-slate-500 disabled:text-slate-600"
            >{`< prev`}</button>

            <div>
              {questions.map((question, i) => {
                if (
                  (currentTab - i <= 2 && currentTab - i >= 0) ||
                  (currentTab - i >= -1 && currentTab - i <= 0)
                ) {
                  let style = "rounded bg-gray-500 w-6 m-2 text-xs";
                  if (currentTab === i) {
                    style = "rounded bg-blue-500 w-6 m-2 text-xs";
                  }
                  return (
                    <button className={style} onClick={() => setCurrentTab(i)}>
                      {i + 1}
                    </button>
                  );
                } else if (i === questions.length - 1) {
                  return (
                    <>
                      ...
                      <button
                        className="m-2 w-6 rounded bg-gray-500 text-xs"
                        onClick={() => setCurrentTab(i)}
                      >
                        {i + 1}
                      </button>
                    </>
                  );
                }
              })}
            </div>

            {currentTab === questions.length - 1 ? (
              <button
                onClick={() => handleAdd()}
                className="col-1 mt-1 block justify-end rounded-md bg-blue-500 pl-5 pr-5 disabled:bg-slate-500 disabled:text-slate-600"
              >
                add question
              </button>
            ) : (
              <button
                onClick={() => handleNext()}
                disabled={currentTab === questions.length - 1}
                className="mt-1 block rounded-md bg-blue-500 pl-5 pr-5 disabled:bg-slate-500 disabled:text-slate-600"
              >
                {`next >`}
              </button>
            )}
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
    </div>
  );
}
