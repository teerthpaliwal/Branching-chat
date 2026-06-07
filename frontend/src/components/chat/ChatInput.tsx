import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  branchParent: number | null;
}

export default function ChatInput({
  onSend,
  branchParent,
}: Props) {

  const [text, setText] =
    useState("");

  const handleSubmit = () => {

    if (!text.trim()) return;

    onSend(text);

    setText("");
  };

  return (
    <div
    className="
    border-t
    border-zinc-800
        p-4
        bg-zinc-950
        "
        >
      <div className="max-w-4xl mx-auto">
        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          rows={1}
          placeholder="Message..."
          className="
          flex-1
          rounded-3xl
          bg-zinc-900
          text-white
          px-5
          py-4
          resize-none
          outline-none
          border
          border-zinc-700
          "
          />

          {branchParent !== null && (
        <div
        className="
        mb-3
        text-sm
        text-pink-400
        "
        >
        🌿 Creating branch from
        message #{branchParent}
        </div>
        )}

        <button
          onClick={handleSubmit}
          className="
            h-12
            px-6
            rounded-2xl
            bg-pink-600
            hover:bg-pink-500
            text-white
            font-medium
          "
        >
          send
        </button>
      </div>
    </div>
  );
}