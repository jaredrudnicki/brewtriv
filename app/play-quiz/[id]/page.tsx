"use client";
import PlayQuiz from "@/components/PlayQuiz";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return <PlayQuiz id={id} />;
}
