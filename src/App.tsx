import Navbar from "./components/Navbar/Navbar";
import TodosList from "./components/TodoList/TodoList";

import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen dark:bg-dark text-white">
        <Navbar />
        <main className="max-w-3xl mx-auto p-4">
          <TodosList />
        </main>

        <footer className="dark:text-white text-dark">
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-md">
            {/* Fixed position, centered */}
            <p className="flex items-center justify-center">
              <label className="mr-4">Priorities: </label>
              {"   "}
              <span className="mr-4 flex items-center border-l-4 border-red-500">
                High
              </span>
              <span className="mr-4 flex items-center border-l-4 border-indigo-500">
                Medium
              </span>
              <span className="mr-4 flex items-center border-l-4 border-yellow-500">
                Low
              </span>
              <span className="flex items-center border-l-4 border-gray-100">
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
