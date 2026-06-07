import MessageList from "./MessageList.tsx";
import ChatInput from "./ChatInput.tsx";
import type { Message } from "../../types/chat";

interface Props {
  messages: any[];
  onSend: (text: string) => void;
  onCreateBranch: (id: number) => void;
  branchParent: number | null;
  isLoading: boolean;

  conversationChildren:
    Record<number, Message[]>;

  onSwitchBranch:
    (messageId: number) => void;
}

export default function ChatLayout({
  messages,
  onSend,
  onCreateBranch,
  branchParent,
  isLoading,
  conversationChildren,
  onSwitchBranch,
}: Props) {
  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <MessageList
  messages={messages}
  onCreateBranch={onCreateBranch}
  isLoading={isLoading}
  conversationChildren={
    conversationChildren
  }
  onSwitchBranch={
    onSwitchBranch
  }
/>
<ChatInput
  onSend={onSend}
  branchParent={branchParent}
/>
       
    </div>
  );
}