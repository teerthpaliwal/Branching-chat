import MessageList from "./MessageList.tsx";
import ChatInput from "./ChatInput.tsx";

interface Props {
  messages: any[];
  onSend: (text: string) => void;
  onCreateBranch: (id: number) => void;
  branchParent: number | null;
  isLoading: boolean;
}

export default function ChatLayout({
  messages,
  onSend,
  onCreateBranch,
  branchParent,
  isLoading,
}: Props) {
  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <MessageList
        messages={messages}
        onCreateBranch={onCreateBranch}
        isLoading={isLoading}
      />
<ChatInput
  onSend={onSend}
  branchParent={branchParent}
/>
       
    </div>
  );
}