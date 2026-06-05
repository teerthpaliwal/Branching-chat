// ChatInput.tsx

import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
}

export default function ChatInput({
  onSend,
}: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="border-t border-zinc-800 p-4">
      <div className="max-w-4xl mx-auto flex gap-2">
        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          rows={1}
          placeholder="Message..."
          className="
            flex-1
            rounded-xl
            bg-zinc-900
            text-white
            px-4
            py-3
            resize-none
            outline-none
          "
        />

        <button
          onClick={handleSubmit}
          className="
            px-5
            rounded-xl
            bg-blue-600
            text-white
          "
        >
          Send
        </button>
      </div>
    </div>
  );
}