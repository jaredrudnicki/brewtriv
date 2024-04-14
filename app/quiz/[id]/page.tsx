import { createClient } from "@/utils/supabase/server";
import Question from "@/components/Question";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  let questions = await supabase
    .from("quizzes")
    .select("questions")
    .eq("id", id)
    .then((response) => (response?.data ? response.data[0].questions : {}));
  if (questions) {
    return (
      <div>
        {questions.map((q, id) => {
          let options = shuffleArray([q.correct, ...q.incorrect]);
          return <Question key={`quiz-${id}`} question={q} options={options} />;
        })}
      </div>
    );
  }
}
