import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  removeTodo,
  editTodo,
  toggleCompleteTodo,
} from "../../slices/todoSlice";
import { Button } from "../ui/button";
import { CheckCheck, Edit, Trash, Check, X, Info } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

const TodoItem = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const searchQuery = useSelector(
    (state: RootState) => state.todos.searchQuery
  );
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleRemoveTodo = (id: string) => {
    dispatch(removeTodo(id));
  };

  const handleEditTodo = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleUpdateTodo = (id: string) => {
    if (!editText.trim()) return;
    dispatch(editTodo({ id, updatedTodo: editText }));
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
                <div className="flex gap-1 ml-2">
                  <Button className="hover:bg-wine">
                    <Info />
                  </Button>
                  <Button
                    className="hover:bg-wine"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditTodo(todo.id, todo.text)}
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
