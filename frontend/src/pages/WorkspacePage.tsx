import { useEffect, useState } from "react";

import ChatLayout from "../components/chat/ChatLayout";

import { getLatestPath } from "../services/api";
import { sendMessage } from "../services/api";

import { type Message } from "../types/chat";

export default function WorkspacePage() {

  const [path, setPath] =
    useState<Message[]>([]);

  const [branchParent, setBranchParent] =
    useState<number | null>(null);

  useEffect(() => {
    loadConversation();
  }, []);

  const loadConversation =
    async () => {

      const data =
        await getLatestPath();

      setPath(data);
    };

  const handleCreateBranch =
    (messageId: number) => {

      setBranchParent(messageId);
    };

  const handleSend =
    async (text: string) => {

      let parentId = null;

      if (branchParent !== null) {

        parentId = branchParent;

      } else if (path.length > 0) {

        parentId =
          path[path.length - 1].id;
      }

      await sendMessage(
        parentId,
        text
      );

      const updated =
        await getLatestPath();

      setPath(updated);

      setBranchParent(null);
    };

  return (
    <ChatLayout
      messages={path}
      onSend={handleSend}
      onCreateBranch={handleCreateBranch}
      branchParent={branchParent}
    />
  );
}