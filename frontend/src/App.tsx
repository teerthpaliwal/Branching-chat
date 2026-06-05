import { useEffect, useState } from "react";

type Message = {
  id: number;
  parent_id: number | null;
  role: string;
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedMessage, setSelectedMessage] =
  useState<Message | null>(null);

  const [conversationChildren, setConversationChildren] =
  useState<Record<number, Message[]>>({});

const [children, setChildren] =
  useState<Message[]>([]);

  const [newMessage, setNewMessage] =
  useState("");

  const [path, setPath] =
  useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const loadConversationChildren =
  async (conversationPath: Message[]) => {

    const childrenMap:
      Record<number, Message[]> = {};

    for (const message of conversationPath) {

      const response = await fetch(
        `http://localhost:8000/messages/${message.id}/children`
      );

      const children =
        await response.json();

      childrenMap[message.id] = children;
    }

    setConversationChildren(childrenMap);
};

  const fetchMessages = async () => {
    const response = await fetch(
      "http://localhost:8000/messages"
    );

    const data = await response.json();

    setMessages(data);
  };

  const selectMessage = async (id: number) => {
  const messageResponse = await fetch(
    `http://localhost:8000/messages/${id}`
  );

  const messageData =
    await messageResponse.json();

  setSelectedMessage(messageData);

  const childrenResponse = await fetch(
    `http://localhost:8000/messages/${id}/children`
  );

  const childrenData =
    await childrenResponse.json();

  setChildren(childrenData);

  const pathResponse = await fetch(
  `http://localhost:8000/messages/${id}/path`
);

const pathData =
  await pathResponse.json();

setPath(pathData);

await loadConversationChildren(pathData);
};

const createChildMessage = async () => {

  if (!selectedMessage) return;

  if (!newMessage.trim()) return;

  await fetch(
    "http://localhost:8000/messages",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        parent_id: selectedMessage.id,
        role: "user",
        content: newMessage,
      }),
    }
  );

  setNewMessage("");

  await selectMessage(
    selectedMessage.id
  );

  await fetchMessages();
};

  return (
    <div>
      <h1>Branching Chat</h1>

      <h2>Stored Messages</h2>

      {path.length > 0 && (
  <div
    style={{
      border: "2px solid green",
      padding: "10px",
      marginBottom: "20px",
    }}
  >
    <h2>Current Conversation</h2>

    {path.map((message) => (
      <div
        key={message.id}
        style={{
          marginBottom: "20px",
        }}
      >
        <p>
          <strong>[{message.id}]</strong>
        </p>

        <p>{message.content}</p>

        {conversationChildren[message.id]?.length > 0 && (
          <div
            style={{
              marginLeft: "20px",
            }}
          >
            <strong>Branches:</strong>

            {conversationChildren[message.id].map(
              (child) => (
                <button
                  key={child.id}
                  onClick={() =>
                    selectMessage(child.id)
                  }
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  {child.id}
                </button>
              )
            )}
          </div>
        )}
      </div>
    ))}
  </div>
)}

      {selectedMessage && (
  <div
    style={{
      border: "2px solid blue",
      padding: "10px",
      marginBottom: "20px",
    }}
  >
    <h2>Selected Message</h2>

    <p>
      <strong>ID:</strong>
      {" "}
      {selectedMessage.id}
    </p>

    <p>
      <strong>Content:</strong>
      {" "}
      {selectedMessage.content}
    </p>

    <h3>Children</h3>

    <div>
  <input
    value={newMessage}
    onChange={(e) =>
      setNewMessage(e.target.value)
    }
    placeholder="Create branch..."
  />

  <button
    onClick={createChildMessage}
  >
    Add Child
  </button>
</div>

    {children.map((child) => (
      <button
        key={child.id}
        onClick={() =>
          selectMessage(child.id)
        }
        style={{
          marginRight: "10px",
        }}
      >
        {child.id}
      </button>
    ))}
  </div>
)}

      {messages.map((message) => (
        <div
          key={message.id}
          onClick={() =>
            selectMessage(message.id)
          }
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <p>
            <strong>ID:</strong> {message.id}
          </p>

          <p>
            <strong>Parent:</strong>{" "}
            {String(message.parent_id)}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {message.role}
          </p>

          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;