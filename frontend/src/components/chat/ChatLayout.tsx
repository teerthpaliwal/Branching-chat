// ChatLayout.tsx

import MessageList from "./MessageList.tsx";
import ChatInput from "./ChatInput.tsx";

interface Props {
  messages: any[];
  onSend: (text: string) => void;
}

export default function ChatLayout({
  messages,
  onSend,
}: Props) {
  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <MessageList messages={messages} />

      <ChatInput onSend={onSend} />
    </div>
  );
}