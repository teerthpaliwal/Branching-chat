// WorkspacePage.tsx

import ChatLayout from "../components/chat/ChatLayout.tsx";

export default function WorkspacePage() {
  const messages: any[] = [];

  const handleSend = async (
    text: string
  ) => {
    console.log(text);
  };

  return (
    <ChatLayout
      messages={messages}
      onSend={handleSend}
    />
  );
}