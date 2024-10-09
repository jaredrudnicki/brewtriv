"use client";
import { useEffect, useState } from "react";
import { addQuiz, getQuiz, editQuiz, decryptQuestions } from "@/utils/actions";
import {Button} from "@nextui-org/react";

import { Question } from "@/utils/types";
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from 'next/navigation';

import CreateQuestionsState from "@/components/quizCreation/CreateQuestionsState";
import CreateTitleQuizDescState from "@/components/quizCreation/CreateTitleDescState";
import CreateAIGenState from "@/components/quizCreation/CreateAIGenState";

import { Spinner } from "@nextui-org/spinner";
import RegularLayout from "@/app/regular-layout";

export default function QuizForm({ id = undefined, edit = false, isPremiumUser=false }) {
	const searchParams = useSearchParams();
	const [currentState, setCurrentState] = useState(0);
	const [direction, setDiection] = useState(0);

	const [isLoading, setIsLoading] = useState(true);
	const [quizTitle, setQuizTitle] = useState("");
	const [quizDescription, setQuizDescription] = useState("");
	const [showDescription, setShowDescription] = useState(true);
	const [showQuizTitle, setShowQuizTitle] = useState(true);
	const [showError, setShowError] = useState("");

	const [currentTab, setCurrentTab] = useState(1);

	const baseQuestion = {
		question: "",
		correct: "",
		incorrect: ["", "", ""],
	};
	const [questions, setQuestions] = useState<Array<Question>>([baseQuestion]);

	useEffect(() => {
		//if edit-quiz
		if (id != undefined) {
			(async () => {
				const quiz = await getQuiz(id);
				setQuestions(decryptQuestions(quiz.quiz));
				setQuizDescription(quiz.description);
				setQuizTitle(quiz.title);
			})();
		} else {
      const title = searchParams?.get('quizTitle')
      if(title) setQuizTitle(title);
      const description = searchParams?.get('quizDescription')
      if(description) setQuizDescription(description);
    }
		setIsLoading(false);
	}, []);


	const handlePrevious = () => {
		if (currentTab > 1) {
			setCurrentTab(currentTab - 1);
		}
	};
	const handleNext = () => {
		if (currentTab < questions.length) {
			setCurrentTab(currentTab + 1);
		}
	};

	const handleAdd = () => {
		console.log(currentTab, questions.length)
		setQuestions([...questions, baseQuestion]);
		setCurrentTab(currentTab + 1);
	};

	const handleIncorrect = (e: any, index: number) => {
		const value = e.target.value;
		const newarr = [...questions];
		newarr[currentTab-1].incorrect[index] = value;
		setQuestions([...newarr]);
	};

	const handleInput = (e: any, field: string) => {
		const value = e.target.value;
		const newarr = [...questions];
		if (field === "question") {
			newarr[currentTab-1].question = value;
		} else if (field === "correct") {
			newarr[currentTab-1].correct = value;
		}

		setQuestions([...newarr]);
	};
  
	const handleAddIncorrect = () => {
		const newarr = [...questions];
		newarr[currentTab-1].incorrect = [...questions[currentTab-1].incorrect, ""];
		setQuestions([...newarr]);
	};

	const handleRemoveIncorrect = (e: any, id: number) => {
    e.preventDefault();
		const newarr = [...questions];
		const incorrect = newarr[currentTab-1].incorrect;
		incorrect.splice(id, 1);
		newarr[currentTab-1].incorrect = incorrect;
		setQuestions([...newarr]);
	};

	const handleDeleteQuestion = (e: any) => {
		e.preventDefault();
		const newarr = [...questions];
		if (newarr.length === 1) {
			setQuestions([baseQuestion]);
		} else {
			setCurrentTab(currentTab-1);
			const spliced = questions.filter((q, index) => {
				return index !== currentTab-1
			});
			setQuestions(spliced);
		}
	};

	const handleAddQuiz = (e: any) => {
		e.preventDefault();
		let error = false;
		if (quizTitle === "") {
			error = true;
		}
		questions.forEach((question) => {
			if (question.question === "" || question.correct === "" || question.incorrect.includes("")) {
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


  // animation needs
  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 50: -50,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? 50 : -50,
      opacity: 0,
    })
  }
  

  const formSteps = [
    { question: "Enter Quiz Details",
      component: <CreateTitleQuizDescState 
      quizTitle={quizTitle}
      setQuizTitle={setQuizTitle}
      quizDescription={quizDescription}
      setQuizDescription={setQuizDescription}
      showQuizTitle={showQuizTitle}
      setShowQuizTitle={setShowQuizTitle}
      showDescription={showDescription}
      setShowDescription={setShowDescription}
    />
    },
    {
      question: "Generate Questions with AI",
      component: <CreateAIGenState 
        quizTitle={quizTitle}
        quizDescription={quizDescription}
        isPremiumUser={isPremiumUser}
        setQuestions={setQuestions}
        setCurrentTab={setCurrentTab}
      />
    },
    {
      question: "Edit Questions",
      component: <CreateQuestionsState 
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      questions={questions}
      showError={showError}
      handlePrevious={handlePrevious}
      handleNext={handleNext}
      handleAdd={handleAdd}
      handleIncorrect={handleIncorrect}
      handleInput={handleInput}
      handleAddIncorrect={handleAddIncorrect}
      handleRemoveIncorrect={handleRemoveIncorrect}
      handleDeleteQuestion={handleDeleteQuestion}
      handleAddQuiz={handleAddQuiz}
    />
    }
  ]

	return (
		<RegularLayout>
			{!isLoading ? (
				<div className="jcontainer h-full">
          <form className="my-auto">
            <div className="my-auto">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentState}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl mb-4">{formSteps[currentState].question}</h1>
                  {formSteps[currentState].component}
                </motion.div>
              </AnimatePresence>
              </div>
            <div className="pt-4 flex flex-row justify-between">
              <Button
                  size="sm"
                  color="primary"
                  variant="bordered"
                  isDisabled={currentState === 0}
                  onPress={() => {
                    setDiection(-1)
                    if(currentState > 0 && id === undefined) {
                      setCurrentState(currentState-1)
                    } else if (currentState > 0) {
						setCurrentState(0)
					}
                  }}
              >
                prev
              </Button>
              <Button
                size="sm"
                color="primary"
                variant="bordered"
                isDisabled={currentState === 2}
                onPress={() => {
                  setDiection(1)
                  if(currentState < 2 && id === undefined) {
                    setCurrentState(currentState+1)
                  } else if (currentState < 2) {
					setCurrentState(2)
				  }
                }}
              >
                next
              </Button>
            </div>
          </form>
				</div>
			): (
				<Spinner />
			)}
		</RegularLayout>
	);
}
