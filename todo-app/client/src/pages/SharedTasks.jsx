import React, { useEffect, useState } from "react";
import { Button, Chip, Paper } from "@mui/material";
import { getReq, putReq } from "../api";
import { useNavigate } from "react-router-dom";

const priorityColor = { low: "success", medium: "warning", high: "error" };

const SharedTasks = () => {

   const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
    }, []);
  

  const [sharedTasks, setSharedTasks] = useState([]);
  // const userEmail = localStorage.getItem("user");
  const userId = localStorage.getItem("userId");

  
const fetchShared = async () => {
  const { data } = await getReq("/tasks");
  const shared = data?.filter(task =>
    task?.sharedWith?.includes(userId) && !task?.acceptedBy?.includes(userId)
  );
  console.log(shared, "share tasks");
  setSharedTasks(shared);
};

  useEffect(() => { fetchShared(); }, []);

  const handleAccept = async task => {
    await putReq(`/tasks/${task._id}/accept`);
    fetchShared();
  };
  const handleReject = task => {
    // simply remove from your UI; you could also call a backend reject endpoint
    setSharedTasks(prev => prev.filter(t => t._id !== task._id));
  };

return (
  <div className="px-4 py-6">
    <h1 className="text-2xl font-bold text-[#9980FA] mb-6">Shared Tasks</h1>
    {sharedTasks.length === 0 ? (
      <p className="text-gray-600">No shared tasks available.</p>
    ) : (
      sharedTasks.map(task => (
        <Paper
          key={task._id}
          elevation={3}
          className="p-4 mb-4 rounded-2xl border border-[#e0ddf7] shadow-md"
          sx={{ borderRadius: '0.75rem' }}
        >
          <div className="flex justify-between items-start mb-2  ">
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <Chip label={task.priority} color={priorityColor[task.priority]} size="small" />
          </div>
          <p className="text-gray-600 mb-1">{task.description}</p>
          <p className="text-sm mb-3">
            Shared by: <strong className="text-[#9980FA]">{task.user.name}</strong>
          </p>
          <div className="flex gap-2">
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleAccept(task)}
              className="text-white"
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleReject(task)}
            >
              Reject
            </Button>
          </div>
        </Paper>
      ))
    )}
  </div>
);

};

export default SharedTasks;
