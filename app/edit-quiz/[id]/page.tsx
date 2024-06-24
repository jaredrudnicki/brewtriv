"use client";
import QuizForm from "@/components/QuizForm";

export default function Page({ params: { id } }: { params: { id: string } }) {
  // @ts-ignore
  return <QuizForm id={id} edit={true} />;
}
