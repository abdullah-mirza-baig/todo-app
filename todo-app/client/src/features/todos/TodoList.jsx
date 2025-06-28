import React, { useState } from "react";
import TodoItem from "./TodoItem";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";

const TodoList = ({ todos, setTodos, onToggleComplete, onDelete, onEdit, onShare }) => {
  const [activeId, setActiveId] = useState(null);

  const activeTodo = todos.find((todo) => todo._id === activeId);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((t) => t._id === active.id);
      const newIndex = todos.findIndex((t) => t._id === over.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={todos.map((todo) => todo._id)}
        strategy={verticalListSortingStrategy}
      >
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

      {/* Smooth floating drag preview */}
      <DragOverlay>
        {activeTodo ? (
          <div className="bg-white border border-[#9980FA] shadow-lg rounded-lg p-4 w-[90%] mx-auto">
            <p className="font-medium">{activeTodo.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TodoList;
