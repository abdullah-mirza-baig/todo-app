import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReq } from "../api";
import { Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const cardStyle = "rounded-xl shadow-md p-6 bg-white border border-[#e0ddf7] w-full";

const Dashboard = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  const [summary, setSummary] = useState({
    createdTasks: 0,
    sharedTasks: 0,
    acceptedTasks: 0
  });

  const fetchSummary = async () => {
    const { data } = await getReq("/tasks/summary");
    setSummary(data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const chartData = [
    { name: "Created", value: summary.createdTasks },
    { name: "Shared", value: summary.sharedTasks },
    { name: "Accepted", value: summary.acceptedTasks },
  ];

  return (
    <div className="min-h-screen bg-[#f2f0fc] px-6 py-10">
      <h1 className="text-3xl font-bold text-[#9980FA] mb-10 text-center">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className={cardStyle}>
          <Typography variant="h6" className="text-[#9980FA] mb-2">Created Tasks</Typography>
          <Typography variant="h4" className="font-bold">{summary.createdTasks}</Typography>
        </div>

        <div className={cardStyle}>
          <Typography variant="h6" className="text-[#9980FA] mb-2">Shared Tasks (Pending)</Typography>
          <Typography variant="h4" className="font-bold">{summary.sharedTasks}</Typography>
        </div>

        <div className={cardStyle}>
          <Typography variant="h6" className="text-[#9980FA] mb-2">Accepted Shared Tasks</Typography>
          <Typography variant="h4" className="font-bold">{summary.acceptedTasks}</Typography>
        </div>
      </div>

      <div className={cardStyle}>
        <Typography variant="h6" className="text-[#9980FA] mb-4">Tasks Summary Chart</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#9980FA" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
