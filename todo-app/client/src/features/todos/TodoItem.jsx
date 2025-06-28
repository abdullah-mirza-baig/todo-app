import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical } from "react-icons/fa";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, IconButton, Checkbox
} from "@mui/material";
import { Delete, Edit, Share } from "@mui/icons-material";
import { motion } from "framer-motion";

const TodoItem = ({ todo, onToggleComplete, onDelete, onEdit, onShare }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isOwner = todo.user?.name === localStorage.getItem("user");

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      
      style={style}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white shadow-sm border border-[#e0ddf7] rounded-xl px-4 py-4 flex justify-between items-start gap-3"
    >
      <div className="flex gap-3 items-start">
        <div className="pt-3 text-[#9980FA] cursor-grab" {...listeners}>
          <FaGripVertical />
        </div>

        <Checkbox
          checked={todo.completed}
          onChange={(e) => {
            e.stopPropagation();
            onToggleComplete(todo._id);
          }}
          sx={{ color: "#9980FA", '&.Mui-checked': { color: "#9980FA" } }}
        />

        <div>
          <p className={`text-lg font-medium ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
            {todo.title}
          </p>

          {todo.description && (
            <p className="text-sm text-gray-500 mt-0.5">{todo.description}</p>
          )}

          <div className="mt-1 space-y-1 text-sm text-gray-500">
            {todo.dueDate && (
              <p>📅 Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
            )}
            {todo.priority && (
              <span className="inline-block text-xs px-2 py-0.5 rounded bg-[#ebe8fd] text-[#6a5ecb] font-medium">
                Priority: {todo.priority}
              </span>
            )}
            {todo.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {todo.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-[#f0effa] text-[#5e54b6] px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {todo.file && (
              <a
                href={`http://localhost:5000/${todo.file.replace(/\\/g, '/')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#6155cc] underline block"
              >
                📎 View Attachment
              </a>
            )}

            {!isOwner && todo.user?.name && (
              <p className="text-xs italic text-gray-500">Shared by: <span className="text-black text-bold font-medium">{todo.user.name}</span></p>
            )}
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="flex gap-1 mt-1">
          <IconButton size="small" onClick={() => onEdit(todo)} sx={{ color: "#9980FA" }}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setConfirmOpen(true)} sx={{ color: "#EF4444" }}>
            <Delete fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onShare(todo)} sx={{ color: "#6B7280" }}>
            <Share fontSize="small" />
          </IconButton>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this task?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              setDeleteLoading(true);
              await onDelete(todo._id);
              setDeleteLoading(false);
              setConfirmOpen(false);
            }}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default TodoItem;
