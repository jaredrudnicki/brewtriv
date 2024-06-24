"use client";
import {
  deleteSession,
  getUser,
  getSession,
  sessionUpdateState,
  shuffleArray,
  updateSessionsUserData,
  decryptQuestions,
  updateProfileTogetherWins,
} from "@/utils/actions";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel, User } from "@supabase/supabase-js";
import RegularLayout from "@/app/regular-layout";
import { check, xMark, clipboard } from "@/utils/showIcons";
import { useEffect, useState, useRef } from "react";
import { Question, UserData } from "@/utils/types";
import { useRouter } from "next/navigation";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { push } = useRouter();
  const supabase = createClient();
  const channel = useRef<RealtimeChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionsData, setQuestionsData] = useState([{} as Question]);
  const [usersData, setUsersData] = useState([{} as UserData]);
  const [gameState, setGameState] = useState("NOT_STARTED");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizId, setQuizId] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>({} as User);
  const [selected, setSelected] = useState("");
  const [guessState, setGuessState] = useState("guessing");
  const [options, setOptionsData] = useState([]);
  const [guessesPerRound, setGuessesPerRound] = useState(0);
  const [canStart, setCanStart] = useState(false);
  const [startTime, setStartTime] = useState(new Date().getTime());

  supabase
    .channel(id)
    .on("broadcast", { event: "incorrect-guess" }, (payload) => {
      if (
        payload.payload.guesses_per_round ===
          payload.payload.usersData.length &&
        isOwner
      ) {
        nextQuestion();
      } else {
        setGuessesPerRound(payload.payload.guesses_per_round);
      }
    });

  supabase
    .channel(id)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "play_together",
        filter: `id=eq.${id}`,
      },
      (payload) => {
        console.log("Change received!", payload);
        if (payload.new.state === "NOT_STARTED") {
          setUsersData(payload.new.users);
          checkCanStart(payload.new.users);
        } else if (payload.new.state === "PLAYING") {
          setStartTime(new Date().getTime());
          setGuessState("guessing");
          setSelected("");
          setGameState(payload.new.state);
          setCurrentQuestion(payload.new.current_question);
          setOptions(questionsData, payload.new.current_question);
        } else if (payload.new.state === "WAITING") {
          setGameState(payload.new.state);
          setUsersData(payload.new.users);
          setGuessesPerRound(payload.new.guesses_per_round);
        } else {
          setGameState(payload.new.state);
          setUsersData(payload.new.users);
          checkWinner();

          console.log("DELETING", currentQuestion, questionsData.length - 1);
          if (channel.current) {
            supabase.removeChannel(channel.current);
          }
          deleteSession(id);
        }
      },
    )
    .subscribe();

  const setOptions = (questions: Array<Question>, index: number) => {
    setOptionsData(
      // @ts-ignore
      shuffleArray([...questions[index].incorrect, questions[index].correct]),
    );
  };

  useEffect(() => {
    (async () => {
      const session = await getSession(id);
      const user = await getUser();
      setCurrentUser(user);

      if(user === null) {
        return push("/login");
      }

      const isOwnerData = user.id === session.owner;
      setIsOwner(isOwnerData);

      setUsersData(session.users);
      checkCanStart(session.users);
      setQuizId(session.quiz);
      setCurrentQuestion(session.current_question);
      setGameState(session.state);
      setQuestionsData(decryptQuestions(session.questions_data));
      setOptions(decryptQuestions(session.questions_data), 0);
      setLoading(false);
    })();

    //set realtime channel...
    if (!channel.current) {
      channel.current = supabase.channel(id, {
        config: {
          broadcast: {
            self: true,
          },
        },
      });
    }
  }, []);

  // continue or start game, set state to PLAYING
  const continueGame = () => {
    if (gameState === "NOT_STARTED") {
      sessionUpdateState(id, currentQuestion, "PLAYING", usersData);
    } else {
      sessionUpdateState(id, currentQuestion + 1, "PLAYING", usersData);
    }
  };

  // go to WAITING state, update current_question and users data in table
  const nextQuestion = (updatedUsersData = usersData) => {
    if (currentQuestion === questionsData.length - 1) {
      sessionUpdateState(id, currentQuestion, "FINISHED", updatedUsersData);
    } else {
      sessionUpdateState(id, currentQuestion, "WAITING", updatedUsersData);
    }
  };

  const checkCorrect = () => {
    if (selected === questionsData[currentQuestion].correct) {
      const endTime = new Date().getTime();
      let points = -1 * ((endTime - startTime) / 4000) + 10;
      if (points < 1) {
        points = 1;
      }

      let tempUsersData = usersData.map((item) =>
        item.email === currentUser?.email
          ? { ...item, score: item.score + points }
          : item,
      );

      tempUsersData = tempUsersData.sort((a, b) =>
        a.score > b.score ? -1 : 1,
      );
      nextQuestion(tempUsersData);
    } else {
      setGuessState("incorrect");

      supabase.channel(id).send({
        type: "broadcast",
        event: "incorrect-guess",
        payload: {
          guesses_per_round: guessesPerRound + 1,
          usersData: usersData,
        },
      });
    }
  };

  const isUserInSession = () => {
    var foundIndex = usersData.findIndex(
      (item) => item.userid == currentUser?.id,
    );
    return foundIndex !== -1;
  };

  const joinSession = () => {
    //TODO: restrict number of people joined
    let tempUsersData = [
      ...usersData,
      {
        userid: currentUser?.id,
        email: currentUser?.email,
        ready: false,
        score: 0,
      },
    ];
    updateSessionsUserData(id, tempUsersData as UserData[]);
  };

  const readyUp = () => {
    let tempUsersData = usersData.map((item) =>
      item.userid === currentUser?.id ? { ...item, ready: true } : item,
    );
    updateSessionsUserData(id, tempUsersData);
  };

  const removeUser = (user: UserData) => {
    let tempUsersData = usersData.filter((item) => item.email !== user.email);
    updateSessionsUserData(id, tempUsersData);
  };

  const checkCanStart = (users: UserData[]) => {
    let isAllowedStart = true;
    users.map((user) => {
      if (!user.ready) {
        isAllowedStart = false;
      }
    });
    setCanStart(isAllowedStart);
  };

  const checkWinner = () => {
    // should already be sorted
    // usersData.sort((a, b) => (a.score > b.score) ? 1 : -1);
    const winner = usersData[0];
    if (winner.userid === currentUser?.id) {
      updateProfileTogetherWins(winner.userid);
    }
  };

  const getButtonStyle = (option: string) => {
    if (option === selected) {
      if (guessState === "correct") {
        return "w-full p-2 border-2 bg-green-500 my-1 rounded";
      } else if (guessState === "incorrect") {
        return "w-full p-2 border-2 bg-red-500 my-1 rounded";
      }
      return "w-full p-2 border-2 bg-blue-900 my-1 rounded";
    }
    return "w-full p-2 border-2 bg-gray-900 my-1 rounded disabled:bg-slate-900 disabled:text-slate-600 hover:border-blue-900";
  };

  if (loading) {
    return <p>spinner</p>;
  } else {
    return (
      <RegularLayout>
        {gameState === "NOT_STARTED" && (
          <div className="grid md:grid-cols-2">
            {/* User Menu */}
            <div>
              <label>Players</label>
              {usersData.map((user) => {
                return (
                  <div className="my-1 flex flex-row">
                    <p className="mr-4 py-2">{user.email}</p>
                    <div className="mx-4 py-2">
                      {user.ready ? check("green") : xMark("red")}
                    </div>
                    {!user.ready && user.email === currentUser?.email && (
                      <button
                        className="rounded bg-green-500 p-2"
                        onClick={() => readyUp()}
                      >
                        {" "}
                        ready up{" "}
                      </button>
                    )}
                    {isOwner && user.email !== currentUser?.email && (
                      <button
                        className="rounded border-2 border-white px-2 hover:bg-gray-800"
                        onClick={() => removeUser(user)}
                      >
                        kick
                      </button>
                    )}
                  </div>
                );
              })}
              {!isUserInSession() && (
                <button
                  className="rounded bg-blue-500 p-2"
                  onClick={() => joinSession()}
                >
                  {" "}
                  JOIN{" "}
                </button>
              )}
              {isOwner && (
                <button
                  //TODO: add disabled
                  disabled={!canStart}
                  className="txt-lg me-4 rounded bg-gradient-to-br from-cyan-500 to-blue-500 px-4 py-2 hover:from-cyan-400 hover:to-blue-400 focus:from-cyan-500 focus:to-blue-500 disabled:bg-slate-900 disabled:bg-none disabled:text-slate-600"
                  onClick={() => continueGame()}
                >
                  Start Game
                </button>
              )}
            </div>

            {/* Copy Link */}
            <div className="mt-8 md:mt-0">
              <label>Game Link</label>
              <div className="flex w-full flex-row">
                <input
                  type="text"
                  className="jinput truncate"
                  value={`${process.env.url}/session/${id}`}
                  readOnly={true}
                />
                <button
                  className="rounded bg-blue-900 px-2 hover:bg-blue-800 disabled:bg-slate-900 disabled:text-slate-600"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.url}/session/${id}`,
                    );
                  }}
                >
                  {clipboard()}
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === "PLAYING" && (
          <div className="flex flex-col">
            {questionsData[currentQuestion].question}
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              {options.map((option, id) => {
                return (
                  <button
                    key={`button-${option}-${id}`}
                    disabled={guessState != "guessing"}
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
              disabled={selected === "" || guessState != "guessing"}
              className="w-full rounded bg-blue-500 px-5 py-2 disabled:bg-slate-900 disabled:text-slate-600"
              onClick={() => checkCorrect()}
            >
              Submit
            </button>
          </div>
        )}

        {/* WAITING or FINISHED STATE */}
        {(gameState === "WAITING" || gameState === "FINISHED") && (
          <div>
            {gameState === "FINISHED"
              ? "Game Over"
              : `${currentQuestion + 1}/${questionsData.length}`}
            <table className="w-full table-auto text-left">
              <thead className="border-2">
                <tr>
                  <th className="p-2">User</th>
                  <th className="p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user) => {
                  return (
                    <tr className="border-2 odd:bg-gray-800 even:bg-gray-900">
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {gameState === "WAITING" && isOwner && (
              <button
                onClick={() => continueGame()}
                className="txt-lg me-4 mt-4 rounded bg-gradient-to-br from-cyan-500 to-blue-500 px-4 py-2 hover:from-cyan-400 hover:to-blue-400 focus:from-cyan-500 focus:to-blue-500"
              >
                Next Question
              </button>
            )}
          </div>
        )}
      </RegularLayout>
    );
  }
}
