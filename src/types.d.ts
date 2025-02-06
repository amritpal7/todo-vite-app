export type Priority = "High" | "Medium" | "Low" | "None";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}
