"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { chevronDown, showChevronVert } from "@/utils/showIcons";
import { useRouter } from "next/navigation";
import { createSession, getUser } from "@/utils/actions";
import { User } from "@supabase/supabase-js";
import { QuizData } from "@/utils/types";

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

export default function Quiz({ quiz={} as QuizData, disabled = false, user={} as User | null }) {
    const { push } = useRouter();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (user !== undefined && !disabled) {
            setIsOwner(user?.id === quiz.user_id);
        }
    }, []);

    const [showD, setShowD] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const playTogether = async () => {
        const user = await getUser();
        if (user) {
            const sessionid = await createSession(quiz.id);
            push(`/session/${sessionid}`);
        } else {
            push('/login');
        }
    };

    const onPlayMode = async(key: any) => {
        if(key==="solo") {
            if(disabled) {
                push('/login');
            } else {
                push(`/play-quiz/${quiz.id}`);
            }
        } else if (key === "challenge") {
            await playTogether()
        }
    }

    return (
        <div className="mb-4 w-full rounded bg-gray-50 p-5 bg-gray-700 text-white">
            <h1 className="mb-8 text-xl">{quiz.title}</h1>
            {showD && <p className="mb-2">{quiz.description}</p>}
            <div className="flex w-full flex-row justify-between">
                <div>
                    <Dropdown className="bg-blue-500">
                        <DropdownTrigger>
                            <Button 
                            color="primary"
                            size="sm"
                            >
                            Play
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Play Dropdown Action" 
                            onAction={async(key) => await onPlayMode(key)}
                        >
                            <DropdownItem key="challenge">Challenge Mode</DropdownItem>
                            <DropdownItem key="solo">Solo Mode</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    {!disabled && isOwner && (
                        <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onClick={() => push(`/edit-quiz/${quiz.id}`)}
                        >
                            Edit
                        </Button>
                    )}
                </div>
                {quiz.description !== "" && (
                    <button className="icon-red" onClick={() => setShowD(!showD)}>
                        {showChevronVert(!showD)}
                    </button>
                )}
            </div>
        </div>
    );
}
