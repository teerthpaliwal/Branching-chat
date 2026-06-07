import BranchIndicator from "./BranchIndicator";
import ReactMarkdown from "react-markdown";

interface Props {
  message: any;
  onCreateBranch: (id: number) => void;
}

export default function MessageBubble({
  message,
  onCreateBranch,
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

        {message.children_count > 1 && (
          <BranchIndicator />
        )}
      </div>
    </div>
  );
}