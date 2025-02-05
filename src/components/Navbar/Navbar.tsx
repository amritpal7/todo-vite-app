import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, LayoutList } from "lucide-react";
import ModeToggle from "../mode-toggle";

const Navbar = () => {
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
            type="text"
            placeholder="Search todos..."
            className="w-full md:w-64 text-white bg-dark border-none"
          />
        </div>

        <Button variant="ghost">
          <ModeToggle />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
