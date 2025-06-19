// TodoList.js
import React from "react";
import TodoItem from "./TodoItem";
import { DndContext, closestCenter} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";

const TodoList = ({ todos, setTodos, onToggleComplete, onDelete, onEdit, onShare }) => {


  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t._id === active.id);
      const newIndex = todos.findIndex((t) => t._id === over.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos); // Update order locally
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map((todo) => todo._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          <AnimatePresence>
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300">No tasks found.</p>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
                onShare={onShare}
              />
            ))
          )}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TodoList;
