export type Priority = "High" | "Medium" | "Low" | "None";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  created_at: string;
  updatedAt?: string;
}

export interface TodoHistory {
  todo_id: string;
  action: string;
  timeStamp: string;
  created_at: string;
  previous_text?: string; // Used for updates to track changes
  previous_priority?: Priority;
  new_text?: string;
  new_priority?: Priority;
}
