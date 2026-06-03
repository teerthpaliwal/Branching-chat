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

const [children, setChildren] =
  useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

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
};

  return (
    <div>
      <h1>Branching Chat</h1>

      <h2>Stored Messages</h2>

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