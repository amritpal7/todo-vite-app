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
          className="h-10 w-full border-b-2 border-background focus:outline-none"
        />
        <Button
          onClick={handleAddNewTodo}
          className="bg-background text-foreground"
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
