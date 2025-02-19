import { Input } from "../ui/input";
import { Search, ListTodo } from "lucide-react";
import ModeToggle from "../mode-toggle";
import React from "react";
import { setSearchQuery } from "../../slices/todoSlice";
import { useDispatch } from "react-redux";
import HistoryModal from "../HistoryModal/HistoryModal";

const Navbar = () => {
  const dispatch = useDispatch();

  const handleSearchTodoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
    // console.log(e.target.value);
  };
  return (
    <nav className="bg-background text-foreground p-2 flex flex-col md:flex-row items-center justify-between gap-2 shadow-xl">
      <div className="flex items-center gap-2">
        <ListTodo />
        <h1 className="text-xl font-bold">Todo App</h1>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="bg-background text-foreground" />
          <Input
            onChange={e => handleSearchTodoInput(e)}
            type="text"
            placeholder="Search todos..."
            className="h-10 p-2 bg-background text-foreground w-full md:w-64 border-0 border-b-2 border-border focus:border-b-accent focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center justify-center gap-1">
          <HistoryModal />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
