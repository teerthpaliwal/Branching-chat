import MessageList from "./MessageList.tsx";
import ChatInput from "./ChatInput.tsx";

interface Props {
  messages: any[];
  onSend: (text: string) => void;
  onCreateBranch: (id: number) => void;
}

export default function ChatLayout({
  messages,
  onSend,
  onCreateBranch,
}: Props) {
  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <MessageList
        messages={messages}
        onCreateBranch={onCreateBranch}
      />

      <ChatInput onSend={onSend} />
    </div>
  );
}