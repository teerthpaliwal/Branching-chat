// MessageList.tsx

import MessageBubble from "./MessageBubble.tsx";

interface Props {
  messages: any[];
}

export default function MessageList({
  messages,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </div>
  );
}

