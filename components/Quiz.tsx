"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { showChevronVert } from "@/utils/showIcons";
import { useRouter } from "next/navigation";
import { createSession, getUser } from "@/utils/actions";

export default function Quiz({ quiz, disabled = false, user }) {
  const { push } = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (user !== undefined && !disabled) {
      setIsOwner(user.id === quiz.user_id);
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
      push('/login')
    }
  };

  return (
    <div className="mb-4 w-full rounded bg-gray-50 p-5 dark:bg-gray-700">
      <h1 className="mb-8 text-xl">{quiz.title}</h1>
      {showD && <p className="mb-2">{quiz.description}</p>}
      <div className="flex w-full flex-row justify-between">
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="txt-lg me-4 rounded bg-gradient-to-br from-cyan-500 to-blue-500 px-4 py-2 hover:from-cyan-400 hover:to-blue-400 focus:from-cyan-500 focus:to-blue-500"
          >
            Play
          </button>
          {isOpen && (
            <div className="absolute mt-2 w-44 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <ul
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <li>
                  <a
                    href={disabled ? "/login" : `/play-quiz/${quiz.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    //onClick={closeDropdown}
                  >
                    Play Solo
                  </a>
                </li>
                <li>
                  <a
                    //href={disabled ? "/login" : `/session/${quiz.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => playTogether()}
                  >
                    Play Together
                  </a>
                </li>
              </ul>
            </div>
          )}

          {!disabled && isOwner && (
            <Link
              href={`/edit-quiz/${quiz.id}`}
              className="me-4 rounded bg-gray-900 px-4 py-2 hover:bg-gray-800 focus:bg-gray-900"
            >
              Edit
            </Link>
          )}
        </div>
        <button className="icon-red" onClick={() => setShowD(!showD)}>
          {showChevronVert(!showD)}
        </button>
      </div>
    </div>
  );
}
