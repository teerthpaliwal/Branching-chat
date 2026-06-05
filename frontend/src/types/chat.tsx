export interface Message {
  id: number;
  parent_id: number | null;

  role: "user" | "assistant";

  content: string;

  children_count?: number;
}