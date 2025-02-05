import Header from "../Header/Header";
import TodoItem from "../TodoItem/TodoItem";

const TodosList = () => {
  return (
    <div className="w-full">
      <Header />
      <ul className="">
        <TodoItem />
      </ul>
    </div>
  );
};

export default TodosList;
