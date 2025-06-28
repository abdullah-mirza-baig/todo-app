import React, { useState } from "react";
import { postReq } from "../../api/index.js";
import { useNavigate, Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { motion } from "framer-motion";


const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await postReq("/auth/register", { name, email, password });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", data._id);
        localStorage.setItem("user", response.data.name);
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d5cdf4] to-[#ffffff] px-4 py-10 sm:py-0">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row">

        {/* Left - Image & Login Prompt */}
        <div className="md:w-1/2 w-full bg-[#d9d2f2] flex flex-col justify-center items-center px-8 py-8 text-center">
          <img
            src="./images/register-img.svg"
            alt="Register"
            className="w-[80%] max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-auto mb-4 sm:mb-6"
          />
          <h3 className="text-xl sm:text-[22px] font-semibold text-[#9980FA] mb-1">Already registered?</h3>
          <p className="text-gray-600 mb-2">Login to access your dashboard and manage your tasks.</p>
          <Link to="/" className="text-[#9980FA] hover:underline font-semibold py-2">
            Login Now →
          </Link>
        </div>

        {/* Right - Register Form */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-[#9980FA] text-center">Register</h2>

          {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9980FA]"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9980FA]"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9980FA]"
              />
              <div className="absolute top-[38px] right-3">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} size="small">
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#9980FA] hover:bg-[#876fe8] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default Register;
