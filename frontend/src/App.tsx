import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const getMessage = async () => {
    const response = await fetch(
      "http://localhost:8000/api/hello"
    );

    const data = await response.json();

    setMessage(data.message);
  };

  return (
    <div>
      <h1>Branching Chat</h1>

      <button onClick={getMessage}>
        Test Backend
      </button>

      <p>{message}</p>
    </div>
  );
}

export default App;