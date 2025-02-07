import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { resetHistory } from "../../slices/todoSlice";
import { Button } from "../ui/button";
import { History, Trash2, XCircle } from "lucide-react";
import { useState } from "react";

const HistoryModal = () => {
  const history = useSelector((state: RootState) => state.todos.history);
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleResetHistory = () => {
    dispatch(resetHistory());
    setConfirmOpen(false);
  };

  return (
    <>
      {/* Main History Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="hover:bg-wine transition-transform duration-200 active:scale-95"
            variant="ghost"
            size="icon"
          >
            <History size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="dark:bg-gray-900 dark:text-white border border-gray-700 backdrop-blur-md shadow-2xl rounded-xl w-[420px] p-5">
          {/* Trash Button (Opens Confirmation Dialog) */}
          <Button
            className="top-3 right-3 hover:bg-red-600 transition duration-200 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            variant="destructive"
            size="icon"
            onClick={() => setConfirmOpen(true)}
            disabled={history.length === 0}
          >
            <Trash2 size={18} />
          </Button>

          {/* Header */}
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold tracking-wide text-gray-100">
              📜 Todo History
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              View all changes made to your todos.
            </DialogDescription>
          </DialogHeader>

          {/* History List - Most Recent First */}
          <div className="max-h-72 overflow-y-auto space-y-3 mt-3 px-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {history.length === 0 ? (
              <p className="text-center text-gray-400 italic">
                No history available.
              </p>
            ) : (
              history
                .slice()
                .reverse()
                .map((entry, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-900/80 rounded-lg shadow-md border border-gray-700 hover:shadow-lg transition duration-200"
                  >
                    <p className="text-sm">
                      <span className="font-bold text-yellow-400">
                        {entry.action}
                      </span>{" "}
                      - <span className="text-gray-500">{entry.timeStamp}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong className="text-gray-400">Todo:</strong>{" "}
                      {entry.todo.text}
                    </p>
                    {entry.previousTodo && (
                      <>
                        <p className="text-sm text-gray-400">
                          <span className="text-red-400">Before:</span>{" "}
                          {entry.previousTodo.text}
                        </p>
                        {entry.previousTodo.priority !==
                          entry.todo.priority && (
                          <p className="text-sm text-blue-400">
                            Priority changed from{" "}
                            <strong>{entry.previousTodo.priority}</strong> to{" "}
                            <strong>{entry.todo.priority}</strong>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="dark:bg-gray-900 dark:text-white border border-gray-700 backdrop-blur-md shadow-2xl rounded-xl w-[350px] p-5">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-semibold text-red-400">
              ⚠ Confirm Reset
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Are you sure you want to reset the entire history? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              className="bg-gray-900 hover:bg-gray-500 transition duration-200"
              onClick={() => setConfirmOpen(false)}
            >
              <XCircle size={16} className="mr-2" />
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-500 transition duration-200"
              onClick={handleResetHistory}
            >
              <Trash2 size={16} className="mr-2" />
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoryModal;
