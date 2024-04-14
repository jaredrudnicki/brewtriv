import Link from "next/link";

export default function Quiz({ quiz }) {
  console.log(quiz);

  return (
    <div>
      <p>{quiz.title}</p>
      <Link href={`/quiz/${quiz.id}`}> Play </Link>
      <button> Edit </button>
    </div>
  );
}
