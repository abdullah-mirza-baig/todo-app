import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getReq, postReq, putReq, deleteReq } from "../api/index.js";
// import Navbar from "../components/Navbar.jsx";
import TodoList from "../features/todos/TodoList.jsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Tasks = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);


  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    tags: "",
    priority: "",
    file: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [taskToShare, setTaskToShare] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = localStorage.getItem("user");

  // const fetchTodos = async () => {
  //   try {
  //     const { data } = await getReq("/tasks");
  //     setTodos(data);
  //   } catch (err) {
  //     console.error("Failed to fetch todos:", err);
  //   }
  // };

const fetchTodos = async () => {
  try {
    const { data } = await getReq("/tasks");
    const userId = localStorage.getItem("userId");

    const filtered = data?.filter(task =>
      task?.user?._id === userId ||
      (task?.sharedWith.includes(userId) && task.acceptedBy?.includes(userId))
    );

    setTodos(filtered);
  } catch (err) {
    console.error("Failed to fetch todos:", err);
  }
};


  useEffect(() => {
    fetchTodos();
  }, []);

  const userId = localStorage.getItem("userId");

  const filteredTodos = todos.filter((todo) => {
  const isMyOwnTask = todo?.user?._id === userId;
  const isAcceptedShared = todo?.acceptedBy?.includes(userId);
  
  if (filter === "active") return (isMyOwnTask || isAcceptedShared) && !todo.completed;
  if (filter === "completed") return (isMyOwnTask || isAcceptedShared) && todo.completed;
  
  return isMyOwnTask || isAcceptedShared;
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
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        tags: "",
        priority: "",
        file: null,
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      tags: "",
      priority: "",
      file: null,
    });
    setEditingId(null);
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
      toast.success("Task shared successfully");
    } catch (err) {
      console.error("Error sharing task:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("dueDate", formData.dueDate);
      form.append("priority", formData.priority);
      form.append("tags", formData.tags);
      if (formData.file) {
        form.append("file", formData.file);
      }

      if (editingId) {
        await putReq(`/tasks/${editingId}`, form);
      } else {
        await postReq("/tasks", form);
      }

      fetchTodos();
      handleClose();
    } catch (err) {
      console.error("Error saving todo:", err);
    } finally {
      setLoading(false);
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
      <div className="min-h-screen px-4 py-8 bg-[#f2f0fc]">
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">
            Welcome, <span className="font-semibold text-2xl text-[#9980FA]">{user}</span>
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-[#9980FA] text-white"
                  : "bg-white border border-[#9980FA] text-[#9980FA]"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#9980FA]">My To-Do List</h1>
            <button
              onClick={() => handleOpen()}
              className="bg-[#9980FA] hover:bg-[#876fe8] text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Add Task
            </button>
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

        {/* Add/Edit Task Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle className="text-[#9980FA] font-bold text-xl px-6 pt-6">
            {editingId ? "Edit Task" : "Add Task"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent className="space-y-4 px-6 pb-0">
              {[
                { label: "Title", name: "title", type: "text" },
                { label: "Description", name: "description", type: "textarea" },
                { label: "Due Date", name: "dueDate", type: "date" },
                { label: "Tags (comma separated)", name: "tags", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {type === "textarea" ? (
                    <textarea
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9980FA]"
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9980FA]"
                      required={name === "title"}
                    />
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9980FA]"
                >
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attach File (Optional)</label>
                <input
                  type="file"
                  name="attachment"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      file: e.target.files[0],
                    }))
                  }
                  className="w-full"
                />
              </div>
            </DialogContent>

            <DialogActions className="px-6 pb-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#9980FA] text-white px-4 py-2 rounded hover:bg-[#876fe8]"
              >
                {editingId
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                  ? "Adding..."
                  : "Add"}
              </button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={shareModalOpen} onClose={() => setShareModalOpen(false)}>
          <DialogTitle className="text-[#9980FA] font-bold px-6 pt-6">Share Task</DialogTitle>
          <form onSubmit={handleShareSubmit}>
            <DialogContent className="px-6">
              <input
                type="email"
                placeholder="Enter email of user"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9980FA]"
                required
              />
            </DialogContent>
            <DialogActions className="px-6 pb-4">
              <button
                onClick={() => setShareModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#9980FA] text-white px-4 py-2 rounded hover:bg-[#876fe8]"
              >
                Share
              </button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
      <ToastContainer />
    </>
  );
};

export default Tasks;
