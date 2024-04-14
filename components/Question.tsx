"use client";
import { useState } from "react";

function checkSelected(selected, actual) {
  console.log(selected, actual);
  return true;
}

export default function Question({ question, options }) {
  const [selected, setSelected] = useState("");

  return (
    <div>
      <p> {question.question} </p>
      {options.map((o, id) => {
        return (
          <button
            key={`button-${o}-${id}`}
            onClick={() => {
              setSelected(o);
            }}
            className={o == selected ? "m-3 bg-blue-500" : "m-3"}
          >
            {" "}
            {o}{" "}
          </button>
        );
      })}
      <button onClick={() => console.log(selected === question.correct)}>
        {" "}
        Submit{" "}
      </button>
    </div>
  );
}
