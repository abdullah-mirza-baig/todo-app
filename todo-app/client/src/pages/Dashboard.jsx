import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getReq, postReq, putReq, deleteReq } from "../api/index.js";
import Navbar from "../components/Navbar.jsx";
import TodoList from "../features/todos/TodoList";
import {
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ConstructionOutlined } from "@mui/icons-material";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
      title: "",
      description: "",
      dueDate: "",
      tags: "",
      priority: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState("all");
    const [shareModalOpen, setShareModalOpen] = useState(false);
const [shareEmail, setShareEmail] = useState("");
const [taskToShare, setTaskToShare] = useState(null);

    const user = (localStorage.getItem("user"));

  const fetchTodos = async () => {
    try {
      const { data } = await getReq("/tasks");
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
  if (filter === "active") return !todo.completed;
  if (filter === "completed") return todo.completed;
  return true;
});

  const handleOpen = (todo = null) => {
    if (todo) {
      setFormData({
  title: todo.title,
  description: todo.description || "",
  dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : "",
  priority: todo.priority || "",
  tags: todo.tags?.join(", ") || "",
});
      setEditingId(todo._id);
    } else {
      setFormData({ title: "", dueDate: "", priority: "" });
      setEditingId(null);
    }
    setOpen(true);
  };


const handleShare = (todo) => {
  setTaskToShare(todo);
  setShareEmail("");
  setShareModalOpen(true);
};

const handleShareSubmit = async (e) => {
  e.preventDefault();
  try {
    await putReq(`/tasks/${taskToShare._id}/share`, { email: shareEmail });
    setShareModalOpen(false);
    toast.success('Task Share Sucessfully', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

  } catch (err) {
    console.error("Error sharing task:", err);
   console.log(err.response?.data?.error || "Failed to share task");
  }
};

  const handleClose = () => {
    setOpen(false);
    setFormData({ title: "", dueDate: "", priority: "" });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    title: formData.title,
    description: formData.description,
    dueDate: formData.dueDate,
    priority: formData.priority,
    tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
  };

  try {
    if (editingId) {
      await putReq(`/tasks/${editingId}`, payload);
    } else {
      await postReq("/tasks", payload);
    }
    fetchTodos();
    handleClose();
  } catch (err) {
    console.error("Error saving todo:", err);
  }
};


  const handleDelete = async (id) => {
    try {
      await deleteReq(`/tasks/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleToggleComplete = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;
    try {
      await putReq(`/tasks/${id}`, { completed: !todo.completed });
      fetchTodos();
    } catch (err) {
      console.error("Error toggling complete:", err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900">
     <div className="flex justify-center mb-6"  >
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-1 ">
      Welcome, <span className="font-semibold text-2xl">{user}</span>
    </p>
    </div>   
    <div className="flex justify-center gap-2 mb-6">
  {["all", "active", "completed"].map((f) => (
    <button
      key={f}
      onClick={() => setFilter(f)}
      className={`px-3 py-1 rounded-full text-sm ${
        filter === f
          ? "bg-indigo-600 text-white"
          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {f.charAt(0).toUpperCase() + f.slice(1)}
    </button>
  ))}
</div>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My To-Do List</h1>
          <Button variant="contained" color="primary" onClick={() => handleOpen()}>
            Add Task
          </Button>
        </div>

        <TodoList
  todos={filteredTodos}
  setTodos={setTodos}
  onToggleComplete={handleToggleComplete}
  onDelete={handleDelete}
  onEdit={handleOpen}
  onShare={handleShare}
/>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? "Edit Task" : "Add Task"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
  <div className="w-full sm:w-[400px] md:w-[500px] lg:w-[500px] space-y-4 mx-auto">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Due Date</label>
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Tags (comma separated)</label>
      <input
        type="text"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="e.g. urgent, backend"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">Priority</label>
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  </div>
</DialogContent>

<DialogActions className="px-6 py-4">
  <button
    onClick={handleClose}
    className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
  >
    Cancel
  </button>
  <button
    type="submit"
    className="bg-indigo-600 text-white font-medium py-2 px-4 rounded hover:bg-indigo-700"
  >
    {editingId ? "Update" : "Add"}
  </button>
</DialogActions>

        </form>
      </Dialog>
      <Dialog key={shareModalOpen ? "open" : "closed"} open={shareModalOpen} onClose={() => setShareModalOpen(false)}>
  <DialogTitle>Share Task</DialogTitle>
  <form onSubmit={handleShareSubmit}>
    <DialogContent className="space-y-4">
      <input
        type="email"
        placeholder="Enter email of user"
        className="w-full border rounded px-3 py-2"
        value={shareEmail}
        onChange={(e) => setShareEmail(e.target.value)}
        required
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setShareModalOpen(false)}>Cancel</Button>
      <Button type="submit" variant="contained" color="secondary">
        Share
      </Button>
    </DialogActions>
  </form>
</Dialog>

    </div>
    <ToastContainer />
    </>
  );
};

export default TodoPage;
