import { Routes, Route } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { AnimatePresence } from "framer-motion";
import DashboardLayout from './layout/DashboardLayout';
import SharedTasks from './pages/SharedTasks';
import Tasks from './pages/Tasks';
import Dashboard from './pages/Dashboard';


const App = () => {

  return (
    <div className=" bg-gradient-to-br from-[#d5cdf4] to-[#ffffff] ">
     <AnimatePresence mode="wait">
      <Routes >
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="shared" element={<SharedTasks />} />
      </Route>
      </Routes>
    </AnimatePresence>
    </div>
  )
}

export default App