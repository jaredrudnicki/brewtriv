import { createClient } from "@/utils/supabase/server";
import Quiz from "@/components/Quiz";

async function addQuiz(supabase, uuid) {
  const { error } = await supabase.from("quizzes").insert({
    user_id: uuid,
    title: "Dog Quiz",
    description: "quiz about dogs",
    questions: [],
  });
}

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);
  // const { data: quizzes } = await supabase
  //   .from("quizzes")
  //   .select("questions")
  //   .eq("id", 1);
  const { data: quizzes } = await supabase.from("quizzes").select();

  //if quizzes is empty and user is signed...show error message
  //if user is signed out, prompt to log in
  //otherwise, show list of quizzes (start/edit?/delete? each quiz, which passes in the questions)
  return (
    <div>
      {quizzes?.map((quiz) => {
        return <Quiz quiz={quiz} />;
      })}

      <button onClick={addQuiz(supabase, user?.id)}>ADD</button>
    </div>
  );
  //return <pre>{JSON.stringify(quizzes, null, 2)}</pre>;
}
