import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { addTodo } from "../../slices/todoSlice";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { Priority } from "../../types";

const todoSchema = z.object({
  newTodo: z.string().nonempty("Todo cannot be empty"),
  priority: z.enum(["None", "Low", "Medium", "High"]),
});
const Header = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<{ newTodo: string; priority: Priority }>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      newTodo: "",
      priority: "None",
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const dispatch = useDispatch();

  const handleTodoSubmit = (data: { newTodo: string; priority: Priority }) => {
    dispatch(addTodo({ newTodo: data.newTodo, priority: data.priority }));
    form.reset();
  };

  return (
    <div className="p-4">
      {/* Input & Add Button */}
      <Form {...form}>
        <form
          className="flex gap-2 mb-4"
          onSubmit={form.handleSubmit(handleTodoSubmit)}
        >
          <FormField
            name="newTodo"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    ref={inputRef}
                    placeholder="Add a new todo..."
                    className="h-10 w-full border-0 border-b-2 border-border focus:border-b-accent focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-background text-foreground"
            variant="ghost"
          >
            <Plus size={16} />
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Header;
