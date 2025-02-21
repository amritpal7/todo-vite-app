import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { resetHistory, fetchHistory } from "../../slices/todoSlice";
import { Button } from "../ui/button";
import { History, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { format, parseISO } from "date-fns";

const HistoryModal = () => {
  const history = useSelector((state: RootState) => state.todos.history);
  const dispatch = useAppDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchHistory());
    console.log(fetchHistory());
  }, [dispatch]);

  const handleResetHistory = () => {
    dispatch(resetHistory());
    setConfirmOpen(false);
  };

  return (
    <div>
      {/* Main History Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-background text-foreground rounded-full"
            size="sm"
            variant="ghost"
          >
            <History />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card text-card-foreground border border-border shadow-lg rounded-lg p-4">
          {/* Trash Button (Opens Confirmation Dialog) */}
          <div className="flex items-center gap-1">
            <Button
              className="bg-card text-foreground hover:bg-destructive hover:text-destructive-foreground shadow-md transition duration-200 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              disabled={history.length === 0}
            >
              <Trash2 size={18} />
              Reset
            </Button>
          </div>

          {/* Header */}
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold tracking-wide">
              📜 Todo History
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              View all changes made to your todos.
            </DialogDescription>
          </DialogHeader>

          {/* History List - Most Recent First */}
          <div className="max-h-72 overflow-y-auto space-y-3 mt-3 px-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {history.length === 0 ? (
              <p className="text-center italic">No history available.</p>
            ) : (
              history
                .slice()
                .reverse()
                .map(entry => (
                  <div
                    key={`${entry.todo_id} - ${entry.timeStamp}`}
                    className="p-4 rounded-md bg-muted text-card-foreground shadow-md"
                  >
                    <p className="text-sm">
                      <span className="font-bold">
                        {entry.action.toUpperCase()}
                      </span>{" "}
                      -{" "}
                      <span className="text-muted-foreground text-[12px]">
                        {format(parseISO(entry.timeStamp), "PPpp")}
                      </span>
                    </p>
                    <p className="bold">
                      Todo:{" "}
                      <span className="text-accent text-sm">
                        {entry.new_text !== null
                          ? entry.new_text
                          : entry.previous_text}
                      </span>
                    </p>

                    {entry.new_text &&
                      entry.new_text !== entry.previous_text && (
                        <>
                          <p className="text-sm text-muted-foreground">
                            <strong>Now:</strong> {entry.new_text}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span>Before:</span> {entry.previous_text}
                          </p>
                        </>
                      )}
                    {entry.new_priority &&
                      entry.new_priority !== entry.previous_priority && (
                        <p className="text-sm text-destructive">
                          Priority changed from{" "}
                          <strong>{entry.previous_priority}</strong> to{" "}
                          <strong>{entry.new_priority}</strong>
                        </p>
                      )}
                  </div>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-background text-foreground border border-gray-700 backdrop-blur-md shadow-2xl rounded-xl w-[350px] p-5">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-semibold">
              ⚠ Confirm Reset
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground">
              Are you sure you want to reset the entire history? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              className="bg-card text-card-foreground transition duration-200 shadow-md"
              onClick={() => setConfirmOpen(false)}
            >
              <XCircle size={16} className="mr-2" />
              Cancel
            </Button>
            <Button
              className="bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground transition duration-200 shadow-md"
              onClick={handleResetHistory}
            >
              <Trash2 size={16} className="mr-2" />
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryModal;
