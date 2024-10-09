"use client"
import { useState } from "react";
import { lock } from "@/utils/showIcons";
import {Button, useDisclosure} from "@nextui-org/react";
import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter
} from "@nextui-org/modal";
import BecomePro from "@/app/become-pro/page";
import fetchQuiz from '@/fetchers/fetchQuiz';

export default function CreateAIGenState({quizTitle, quizDescription, isPremiumUser, setQuestions, setCurrentTab}) {

    console.log(quizTitle, quizDescription)
    const [magicLoading, setMagicLoading] = useState(false);

    const handleMagic = async(e) => {
        e.preventDefault();
        setMagicLoading(true);
		const response = await fetchQuiz(quizTitle, quizDescription);
		const newQuestions = [];
		response.questions.map((q) => {
			newQuestions.push({
				question: q.question,
				correct: q.correct,
				incorrect: [...q.incorrect]
			})
		})
		setQuestions(newQuestions);
		setCurrentTab(newQuestions.length);
        setMagicLoading(false);
	}

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            {isPremiumUser ? (
                <>
                <button
                    onClick={async(e) => {
                        await handleMagic(e);
                    }}
                    className="txt-lg me-4 mt-2 rounded bg-gradient-to-br from-cyan-500 to-blue-500 px-4 py-2 hover:from-cyan-400 hover:to-blue-400 focus:from-cyan-500 focus:to-blue-500"
                >
                    magic 
                </button>
                {magicLoading && (
                    <p>loading</p>
                )}
                </>
            ):(
                <>
                    <Button
                        onPress={onOpen}
                        className="flex gap-2 txt-lg me-4 mt-2 rounded bg-gradient-to-br from-cyan-500 to-blue-500 px-4 py-2 hover:from-cyan-400 hover:to-blue-400 focus:from-cyan-500 focus:to-blue-500 disabled:from-slate-900 disabled:to-slate-900 disabled:text-slate-400 text-white"
                    >
                        generate questions {lock()}
                    </Button>
                    <Modal isOpen={isOpen} onOpenChange={(onOpenChange)} backdrop={"blur"}>
                        <ModalContent className="bg-slate-900 text-white">
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Pro Plan</ModalHeader>
                                    <ModalBody>
                                        <BecomePro quizTitle={quizTitle} quizDescription={quizDescription} redirectUrl={"create-quiz"}/>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
  
            )}
        </>
    );
}