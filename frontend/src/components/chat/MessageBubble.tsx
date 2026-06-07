import type { Message } from "../../types/chat";
import BranchIndicator from "./BranchIndicator";
import ReactMarkdown from "react-markdown";

interface Props {
  message: any;
  onCreateBranch: (id: number) => void;

  children: Message[];

  onSwitchBranch:
    (messageId: number) => void;
}

export default function MessageBubble({
  message,
  onCreateBranch,
  onSwitchBranch,
  children,
}: Props) {

  const isUser =
    message.role === "user";

  return (
    <div
      className={`flex mb-6 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
  onContextMenu={(e) => {
    e.preventDefault();

    const shouldBranch =
      window.confirm(
        "Create branch here?"
      );

    if (shouldBranch) {
      onCreateBranch(message.id);
    }
  }}
  className={`
    max-w-fit
    px-5
    py-4
    rounded-3xl
    shadow

    ${
      isUser
        ? "bg-blue-600 text-white"
        : "bg-zinc-800 text-zinc-100"
    }
  `}
>
        <ReactMarkdown>
          {message.content}
        </ReactMarkdown>

        {children.length >= 1 && (

  <div className="mt-3">

    {children.map(
      (child) => (

        <button
          key={child.id}
          onClick={() =>
            onSwitchBranch(
              child.id
            )
          }
          className="
            mr-2
            text-xs
            bg-zinc-700
            px-2
            py-1
            rounded
          "
        >
          Branch {child.id}
        </button>

      )
    )}

  </div>

)}

        {message.children_count > 0 && (
          <BranchIndicator />
        )}
      </div>
    </div>
  );
}