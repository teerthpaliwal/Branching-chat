// MessageBubble.tsx

import BranchIndicator from "./BranchIndicator";

interface Props {
  message: any;
}

export default function MessageBubble({
  message,
}: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`mb-6 flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[75%]
          rounded-3xl
          px-4
          py-3
          whitespace-pre-wrap
          shadow-sm

          ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-zinc-100"
          }
        `}
      >
        {message.content}

        {message.children_count > 1 && (
          <BranchIndicator />
        )}
      </div>
    </div>
  );
}