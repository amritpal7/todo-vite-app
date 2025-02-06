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
import {} from "@radix-ui/react-dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";

const TodoItem = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const searchQuery = useSelector(
    (state: RootState) => state.todos.searchQuery
  );
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [priority, setPriority] = useState<Priority>("None");

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
  };

  const handleUpdateTodo = (id: string) => {
    if (!editText.trim()) return;
    dispatch(updateTodo({ id, updatedTodo: editText, priority }));
    setEditingId(null);
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
            className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-lg shadow-md border-l-2 border-gray-100 transition-all duration-300 ease-in-out hover:shadow-2xl"
          >
            {editingId === todo.id ? (
              <div className="flex items-center gap-2 w-full">
                <Input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className="dark:bg-gray-700 text-gray-100 w-full"
                />
                <Button
                  className="hover:bg-wine"
                  variant="ghost"
                  onClick={() => handleUpdateTodo(todo.id)}
                >
                  <Check size={16} />
                </Button>
                <Button
                  className="hover:bg-wine"
                  onClick={() => setEditingId(null)}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 ml-1 ${
                    todo.completed
                      ? "line-through decoration-wavy decoration-wine text-red-400"
                      : ""
                  }`}
                >
                  {todo.text}
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="hover:bg-wine">
                      <Info />
                    </Button>
                  </DialogTrigger>
                  <DialogHeader>
                    <DialogTitle>Todo Info</DialogTitle>
                    <DialogDescription>
                      Make changes to your todo here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogContent>
                    <Input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="dark:bg-gray-700 text-gray-100 w-full"
                    />
                    <Select
                      value={priority}
                      // onValueChange={setPriority}
                    >
                      <SelectTrigger>Priority: {priority}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        <X size={16} />
                      </Button>
                      <Button onClick={() => handleUpdateTodo(todo.id)}>
                        <CheckCheck size={16} /> Save
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveTodo(todo.id)}
                      >
                        <Trash size={16} /> Delete
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleCompleteTodo(todo.id)}
                      >
                        {todo.completed ? "Mark Incomplete" : "Mark Complete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="flex gap-1 ml-2">
                  <Button
                    className="hover:bg-wine"
                    variant="ghost"
                    size="icon"
                    // onClick={() => handleEditTodo(todo.id, todo.text)}
                  >
                    <Edit size={16} />
                  </Button>
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
              </>
            )}
          </li>
        ))
      )}
    </div>
  );
};

export default TodoItem;
