import { useSelector } from "react-redux";
import Navbar from "./components/Navbar/Navbar";
import TodosList from "./components/TodoList/TodoList";

import { ThemeProvider } from "./components/theme-provider";
import { RootState } from "./store";

function App() {
  const todos = useSelector((state: RootState) => state.todos.todos);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto p-4">
          <TodosList />
        </main>

        <footer className="">
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-md">
            {/* Footer: Todo Count */}

            {/* Fixed position, centered */}
            <p className="flex items-center justify-center">
              <span className="mr-4 py-2 px-2 text-center shadow-md border-b border-border">
                {`${todos.length} todo item${todos.length === 1 ? "" : "s"}`}
              </span>
              <label className="mr-4">Priorities: </label>
              {"   "}
              <span className="mr-4 flex items-center border-l-4 border-destructive">
                High
              </span>
              <span className="mr-4 flex items-center border-l-4 border-primary">
                Medium
              </span>
              <span className="mr-4 flex items-center border-l-4 border-accent">
                Low
              </span>
              <span className="mr-4 flex items-center border-l-4 border-muted">
                None
              </span>
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
