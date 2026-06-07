import { useEffect, useState } from "react";

import ChatLayout from "../components/chat/ChatLayout";

import { getLatestPath } from "../services/api";

import { sendMessage } from "../services/api";

import { type Message } from "../types/chat";

import { getPath } from "../services/api";

export default function WorkspacePage() {

  
  const [path, setPath] =
    useState<Message[]>([]);

  const [conversationChildren,
  setConversationChildren] =
  useState<Record<number, Message[]>>({});

  const [branchParent, setBranchParent] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] =
  useState(false);

  useEffect(() => {
    loadConversation();
  }, []);

  const loadConversation =
    async () => {

      const data =
        await getLatestPath();

      setPath(data);

      await loadConversationChildren(data);
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

      setIsLoading(true);

      await sendMessage(
        parentId,
        text
      );

      const updated =
        await getLatestPath();

      setPath(updated);

      await loadConversationChildren(updated);

      setIsLoading(false);

      setBranchParent(null);
    };

    const switchBranch =
  async (messageId: number) => {

    const path =
      await getPath(messageId);

    setPath(path);

    await loadConversationChildren(path);

  };

  const loadConversationChildren =
  async (
    conversationPath: Message[]
  ) => {

    const childrenMap:
      Record<number, Message[]> = {};

    for (
      const message
      of conversationPath
    ) {

      const response =
        await fetch(
          `http://localhost:8000/messages/${message.id}/children`
        );

      const children =
        await response.json();

      childrenMap[
        message.id
      ] = children;
    }

    setConversationChildren(
      childrenMap
    );
};

  return (
    <ChatLayout
      messages={path}
      onSend={handleSend}
      onCreateBranch={handleCreateBranch}
      branchParent={branchParent}
      isLoading={isLoading}
      onSwitchBranch={switchBranch}
      conversationChildren={conversationChildren}
    />
  );
}