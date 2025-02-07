export type Priority = "High" | "Medium" | "Low" | "None";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt?: string;
}

export interface TodoHistory {
  action: string;
  timeStamp: string;
  todo: Todo;
  previousTodo?: Todo; // Used for updates to track changes
}
