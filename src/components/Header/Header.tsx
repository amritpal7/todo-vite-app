import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { addTodo } from "../../slices/todoSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const Header = () => {
  const [newTodo, setNewTodo] = useState("");
  const dispatch = useDispatch();

  const handleAddNewTodo = () => {
    if (!newTodo.trim()) return;
    dispatch(addTodo(newTodo));
    setNewTodo("");
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
          className="w-full bg-dark text-gray-100 dark:bg-gray-800 dark:text-gray-100 border-none border-b-2 border-gray-100"
        />
        <Button
          onClick={handleAddNewTodo}
          className="flex items-center gap-2 hover:bg-wine"
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
