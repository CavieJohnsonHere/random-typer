"use client";

import { useRef, useState } from "react";

export default function Share({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [key, setKey] = useState("greetings!");
  const [message, setMessage] = useState("");
  const error = useRef<HTMLDivElement | null>(null);

  const onShareClicked = async () => {
    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: key,
        data: value,
      }),
    });
  };

  const onGetClicked = async () => {
    const res = await fetch(`/api/share?key=${key}`);
    if (res.ok) setValue(JSON.parse(await res.text()).data);
    else {
      setMessage(JSON.parse(await res.text()).error);
      setTimeout(() => {
        if (error && error.current) error.current.style.opacity = `0`;
      }, 1800);

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div className="p-2">
      {message && (
        <div
          className="absolute bottom-5 end-5 bg-red-900/40 backdrop-blur-md rounded-4xl w-fit h-12 p-2 px-4 leading-8 transition-opacity duration-[200ms]"
          ref={error}
        >
          {message}
        </div>
      )}
      <button
        className="bg-gray-700 hover:bg-gray-800 transition rounded h-12 me-1 text-white/80 cursor-pointer p-2"
        onClick={onShareClicked}
      >
        Share your text.
      </button>

      <button
        className="bg-gray-700 hover:bg-gray-800 transition rounded h-12 mx-1 text-white/80 cursor-pointer p-2"
        onClick={onGetClicked}
      >
        Get other people&apos;s text.
      </button>

      <div className="mt-2">
        <span> Put the key here: </span>
        <input
          className="bg-amber-50/50 focus:bg-amber-100/60 transition text-white p-1 rounded ms-2"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
    </div>
  );
}
