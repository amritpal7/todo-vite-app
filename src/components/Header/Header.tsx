import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { addTodo } from "../../slices/todoSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Priority } from "../../types";

const Header = () => {
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<Priority>("None");

  const dispatch = useDispatch();

  const handleAddNewTodo = () => {
    if (!newTodo.trim()) return;
    dispatch(addTodo({ newTodo, priority }));
    setNewTodo("");
    setPriority("None");
  };

  return (
    <div className="p-4">
      {/* Input & Add Button */}
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          className="w-full bg-wine text-gray-100 dark:bg-gray-800 dark:text-gray-100 focus:border-b focus:border-indigo-500 focus:outline-hidden"
        />
        <Button
          onClick={handleAddNewTodo}
          className="flex items-center gap-2 hover:bg-wine dark:text-white text-dark"
          variant="ghost"
        >
          <Plus size={16} />
          Add
        </Button>
      </div>
    </div>
  );
};

export default Header;
