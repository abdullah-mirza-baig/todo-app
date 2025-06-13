import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { FaGripVertical } from "react-icons/fa";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit, Share  } from "@mui/icons-material";

const TodoItem = ({
  todo,
  onToggleComplete,
  onDelete,
  onEdit,
  onShare,
}) => {

     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: todo._id,
    });

    const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
     <div
      ref={setNodeRef}
      {...attributes}
    //   {...listeners}
      style={style}
      className="flex items-center justify-between bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 rounded-md shadow-sm"
    >
      <div className="flex items-center gap-3">
         <div {...listeners} className="cursor-grab">
          <FaGripVertical size={16} />
        </div>
        <Checkbox
          checked={todo.completed}
           onChange={(e) => {
    e.stopPropagation(); // ✨ Prevent drag event
    onToggleComplete(todo._id);
  }}
          color="primary"
        />
        <div className="flex flex-col">
          <span className={`font-medium text-gray-800 dark:text-white ${todo.completed ? "line-through" : ""}`}>
            {todo.title}
          </span>
          {todo.description && (
    <span className="text-sm text-gray-600 dark:text-gray-300">
      {todo.description}
    </span>
  )}
          {todo.dueDate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
          {todo.priority && (
            <span className="text-xs mt-1 px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 w-fit">
              Priority: {todo.priority}
            </span>
          )}
          {todo.tags?.length > 0 && (
  <div className="flex gap-2 mt-1 flex-wrap">
    {todo.tags.map((tag, index) => (
      <span
        key={index}
        className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded"
      >
        #{tag}
      </span>
    ))}
  </div>
)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <IconButton onClick={() => onEdit(todo)} size="small" color="primary">
          <Edit fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onDelete(todo._id)} size="small" color="error">
          <Delete fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onShare(todo)} size="small" color="secondary">
  <Share fontSize="small" />
</IconButton>
      </div>
    </div>
  );
};

export default TodoItem;
