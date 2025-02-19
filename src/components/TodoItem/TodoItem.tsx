import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  removeTodo,
  updateTodo,
  toggleCompleteTodo,
} from "../../slices/todoSlice";
import { Button } from "../ui/button";
import { CheckCheck, Edit, Save, Trash, XCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Priority } from "../../types";
import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { format, isValid, parseISO } from "date-fns";

const getPriorityBorder = (priority: Priority) => {
  switch (priority) {
    case "High":
      return "border-destructive";
    case "Medium":
      return "border-primary";
    case "Low":
      return "border-accent";
    default:
      return "border-muted";
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
  const [filter, setFilter] = useState("All");

  const dateAndTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate)
      ? format(parsedDate, "MMM d, yyyy • hh:mm a")
      : "Invalid date!";
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

  const getFilteredTodos = () => {
    switch (filter) {
      case "Completed":
        return todos.filter(todo => todo.completed);
      case "Pending":
        return todos.filter(todo => !todo.completed);
      case "All":
        return todos.filter(todo =>
          todo.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div>
      <div className="flex items-center justify-between">
        {["All", "Completed", "Pending"].map(status => (
          <label htmlFor="filter" key={status}>
            <input
              className="form-radio"
              id={`filter-${status}`}
              type="radio"
              name="filter"
              value={status}
              checked={filter === status}
              onChange={() => setFilter(status)}
            />
            <span>{status}</span>
          </label>
        ))}
      </div>
      <div className="space-y-4 mt-3 max-h-[400px] overflow-y-auto">
        {todos.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            <li className="bg-muted text-muted-foreground p-3 rounded-lg shadow-md text-center text-5xl">
              No todos yet, add one to see!
            </li>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <li
              key={todo.id}
              className={`flex items-center justify-between p-3 rounded-lg shadow-md border-l-4 ${getPriorityBorder(
                todo.priority
              )} transition-all duration-300 ease-in-out bg-card text-card-foreground hover:shadow-2xl`}
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
                <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditTodo(todo.id, todo.text, todo.priority)
                      }
                    >
                      <Edit size={16} />
                    </Button>
                  </DrawerTrigger>
                  {editingId === todo.id && (
                    <DrawerContent className="flex items-center justify-center bg-card text-card-foreground border border-border shadow-2xl rounded-xl">
                      <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                          <DrawerTitle className="text-2xl">
                            Update Todo
                          </DrawerTitle>
                          <h3>Edit your todo and priority.</h3>
                          <DrawerDescription className="">
                            <div className="grid grid-col">
                              <span className="text-xs mt-1">
                                Last added: {dateAndTime(todo.createdAt)}
                              </span>
                              {todo.updatedAt && (
                                <span className="text-xs mt-1">
                                  Last updated: {dateAndTime(todo.updatedAt)}
                                </span>
                              )}
                            </div>
                          </DrawerDescription>
                        </DrawerHeader>

                        <div>
                          <Input
                            type="text"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            className="w-full"
                          />

                          {/* Priority Selection */}
                          <Select
                            value={priority}
                            onValueChange={value =>
                              setPriority(value as Priority)
                            }
                          >
                            <SelectTrigger className="bg-background text-foreground">
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent className="bg-background text-foreground">
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <DrawerFooter className="flex gap-2">
                          <Button
                            className="bg-background text-foreground"
                            onClick={() => handleUpdateTodo(todo.id)}
                            variant="ghost"
                          >
                            <Save />
                            Save
                          </Button>
                          <Button
                            className="bg-background text-foreground"
                            onClick={() => setEditingId(null)}
                            variant="ghost"
                          >
                            <XCircle />
                            Cancel
                          </Button>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  )}
                </Drawer>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCompleteTodo(todo.id)}
                >
                  <CheckCheck size={16} />
                </Button>
                <Button
                  className="hover:bg-destructive"
                  variant="ghost"
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
    </div>
  );
};

export default TodoItem;
