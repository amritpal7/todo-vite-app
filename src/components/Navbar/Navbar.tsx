import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, LayoutList } from "lucide-react";
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
    <nav className="bg-wine text-gray-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center gap-2">
        <LayoutList />
        <h1 className="text-xl font-bold">Todo App</h1>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="text-gray-400" />
          <Input
            onChange={e => handleSearchTodoInput(e)}
            type="text"
            placeholder="Search todos..."
            className="w-full md:w-64 text-white bg-dark border-none"
          />
        </div>

        <Button variant="ghost">
          <HistoryModal />
          <ModeToggle />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
