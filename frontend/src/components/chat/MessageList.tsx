import MessageBubble from "./MessageBubble.tsx";
import { useEffect, useRef } from "react";
import type { Message }
from "../../types/chat";

interface Props {
  messages: any[];
  onCreateBranch: (id: number) => void;
  isLoading: boolean;

  conversationChildren:
    Record<number, Message[]>;

  onSwitchBranch:
    (messageId: number) => void;
}

export default function MessageList({
  messages,
  onCreateBranch,
  isLoading,
  conversationChildren,
  onSwitchBranch,
}: Props) {

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {messages.map((message) => (
          <MessageBubble
  key={message.id}
  message={message}
  onCreateBranch={onCreateBranch}
  children={
    conversationChildren[
      message.id
    ] || []
  }
  onSwitchBranch={
    onSwitchBranch
  }
/>
        ))}

        <div ref={bottomRef} />

        {isLoading && (
  <div
    className="
      text-zinc-500
      italic
      py-4
    "
  >
    GPT is thinking...
  </div>
)}

      </div>
    </div>
  );
}