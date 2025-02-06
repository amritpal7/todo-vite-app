import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  removeTodo,
  updateTodo,
  toggleCompleteTodo,
} from "../../slices/todoSlice";
import { Button } from "../ui/button";
import { CheckCheck, Edit, Trash, Check, X, Info } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Priority } from "../../types";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";

const getPriorityBorder = (priority: Priority) => {
  switch (priority) {
    case "High":
      return "border-red-500";
    case "Medium":
      return "border-indigo-500";
    case "Low":
      return "border-yellow-500";
    default:
      return "border-gray-100";
  }
};

const TodoItem = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const searchQuery = useSelector(
    (state: RootState) => state.todos.searchQuery
  );
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [priority, setPriority] = useState<Priority>("None");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateAndTime = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy • hh:mm a");
  };

  const handleRemoveTodo = (id: string) => {
    dispatch(removeTodo(id));
  };

  const handleEditTodo = (
    id: string,
    text: string,
    currentPriority: Priority
  ) => {
    setEditingId(id);
    setEditText(text);
    setPriority(currentPriority);
    setIsModalOpen(true);
  };

  const handleUpdateTodo = (id: string) => {
    if (!editText.trim() || !editingId) return;
    dispatch(updateTodo({ id, updatedTodo: editText, priority }));
    // setEditingId(null);
    setIsModalOpen(false);
  };

  const handleCompleteTodo = (id: string) => {
    dispatch(toggleCompleteTodo(id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 mt-3 cursor-pointer max-h-[500px] overflow-y-auto">
      {todos.length === 0 ? (
        <li className="bg-gray-800 text-gray-900 p-3 rounded-lg shadow-md bg-gray">
          No todos yet, add one to see!
        </li>
      ) : (
        filteredTodos.map(todo => (
          <li
            key={todo.id}
            className={`flex items-center justify-between bg-gray-800 dark:text-white text-dark p-3 rounded-lg shadow-md border-l-2 ${getPriorityBorder(
              todo.priority
            )} transition-all duration-300 ease-in-out hover:shadow-2xl`}
          >
            <span
              className={`flex-1 ml-1 ${
                todo.completed
                  ? "line-through decoration-wavy decoration-wine text-red-400"
                  : ""
              }`}
            >
              {todo.text}
            </span>
            <div className="flex gap-1 ml-2">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="hover:bg-wine"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleEditTodo(todo.id, todo.text, todo.priority)
                    }
                  >
                    <Edit size={16} />
                  </Button>
                </DialogTrigger>
                {editingId === todo.id && (
                  <DialogContent className="bg-gray-800 bg-opacity-100 text-white shadow-lg outline-none">
                    <DialogHeader>
                      <DialogTitle>Update Todo</DialogTitle>
                      <DialogDescription className="flex justify-between items-center">
                        <h3>Edit your todo and priority.</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Added on: {dateAndTime(todo.createdAt)}
                        </p>
                      </DialogDescription>
                    </DialogHeader>

                    <Input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="dark:bg-gray-700 text-gray-100 w-full"
                    />

                    {/* Priority Selection */}
                    <Select
                      value={priority}
                      onValueChange={value => setPriority(value as Priority)}
                    >
                      <SelectTrigger className="dark:bg-gray-700 text-white">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark text-white">
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>

                    <DialogFooter>
                      <Button
                        className="hover:bg-wine"
                        onClick={() => handleUpdateTodo(todo.id)}
                      >
                        Save
                      </Button>
                      <Button
                        className="hover:bg-gray-600"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
              <Button
                className="hover:bg-wine"
                variant="ghost"
                size="icon"
                onClick={() => handleCompleteTodo(todo.id)}
              >
                <CheckCheck size={16} />
              </Button>
              <Button
                className="hover:bg-red-500"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveTodo(todo.id)}
              >
                <Trash size={16} />
              </Button>
            </div>
          </li>
        ))
      )}
    </div>
  );
};

export default TodoItem;
