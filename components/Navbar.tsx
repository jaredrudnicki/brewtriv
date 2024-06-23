"use client";
import { globe, award, sun, plus, profileIcon } from "@/utils/showIcons";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex w-full flex-col items-start rounded bg-gray-900">
      <div className="w-full">
        <Link
          href="/quizzes"
          className="mx-2 mt-4 flex flex-row whitespace-nowrap rounded md:hover:bg-gray-600 lg:text-lg"
        >
          <div className="rounded-xl p-3 hover:bg-gray-600">{globe()}</div>
          <p className="hidden py-3 pr-3 md:block">Quizzes</p>
        </Link>
      </div>
      <div className="w-full">
        <Link
          href="/daily"
          className="mx-2 mt-8 flex flex-row whitespace-nowrap rounded md:hover:bg-gray-600 lg:text-lg"
        >
          <div className="rounded-xl p-3 hover:bg-gray-600">{sun()}</div>
          <p className="hidden py-3 pr-3 md:block">Daily Q</p>
        </Link>
      </div>
      <div className="w-full">
        <Link
          href="/profile"
          className="mx-2 mt-8 flex flex-row whitespace-nowrap rounded md:hover:bg-gray-600 lg:text-lg"
        >
          <div className="rounded-xl p-3 hover:bg-gray-600">
            {profileIcon()}
          </div>
          <p className="hidden py-3 pr-3 md:block">Profile</p>
        </Link>
      </div>
      <div className="w-full">
        <Link
          href="/create-quiz"
          className="mx-2 mb-4 mt-8 flex flex-row items-center whitespace-nowrap lg:rounded lg:bg-blue-700 lg:text-lg lg:hover:bg-blue-600"
        >
          <div className="rounded-xl p-3 hover:bg-blue-600 lg:bg-inherit">
            {plus()}
          </div>
          <p className="hidden py-3 pr-3 lg:block">Add Quiz</p>
        </Link>
      </div>
    </div>
  );
}
