export async function getLatestPath() {
  const response =
    await fetch(
      "http://localhost:8000/latest-path"
    );

  return response.json();
}

export async function sendMessage(
  parentId: number | null,
  content: string
) {
  const response =
    await fetch(
      "http://localhost:8000/messages",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          parent_id: parentId,
          role: "user",
          content,
        }),
      }
    );

  return response.json();
}

export async function getPath(
  messageId: number
) {
  const response =
    await fetch(
      `http://localhost:8000/messages/${messageId}/path`
    );

  return response.json();
}