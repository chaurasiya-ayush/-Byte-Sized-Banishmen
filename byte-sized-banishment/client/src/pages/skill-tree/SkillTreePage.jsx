import React, { useState, useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaFire,
  FaBullseye,
  FaSearch,
  FaBolt,
  FaStarOfLife,
} from "react-icons/fa";
import { GiDevilMask } from "react-icons/gi";
import CustomNode from "./components/CustomNode";

const SkillTreePage = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [subject, setSubject] = useState(""); // Will be set dynamically
  const navigate = useNavigate();

  // The custom node types need to be memoized to prevent re-renders
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Fetch available subjects from backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No authentication token found.");
          navigate("/");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log(
          "Fetching subjects from:",
          "http://localhost:5000/api/gauntlet/subjects"
        );

        const { data } = await axios.get(
          "http://localhost:5000/api/gauntlet/subjects",
          config
        );

        console.log("Subjects response:", data);

        if (data.success && data.subjects && data.subjects.length > 0) {
          setAvailableSubjects(data.subjects);
          // Set the first subject as default if no subject is selected
          if (!subject) {
            setSubject(data.subjects[0]);
          }
        } else {
          console.error("No subjects in response:", data);
          toast.error("No subjects available.");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        console.error("Response data:", error.response?.data);
        toast.error(
          `Failed to load subjects: ${
            error.response?.data?.message || error.message
          }`
        );
        navigate("/dashboard");
      }
    };

    fetchSubjects();
  }, [navigate, subject]);

  useEffect(() => {
    if (!subject) return; // Don't fetch skill tree until we have a subject

    const fetchSkillTree = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          `http://localhost:5000/api/skill-tree/${encodeURIComponent(subject)}`,
          config
        );

        if (data.success) {
          // Transform the backend data into the format React Flow expects
          const flowNodes = data.tree.nodes.map((node, index) => ({
            id: node.id,
            type: "custom",
            data: {
              name: node.name,
              status: node.status,
              progress: node.progress,
            },
            position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 200 },
          }));

          const flowEdges = data.tree.edges.map((edge, index) => ({
            id: `e${index}`,
            source: edge.from,
            target: edge.to,
            animated: true,
            style: {
              stroke: "#f97316",
              strokeWidth: 2,
              filter: "drop-shadow(0 0 5px rgba(249, 115, 22, 0.5))",
            },
            markerEnd: {
              type: "arrowclosed",
              color: "#f97316",
            },
          }));

          setNodes(flowNodes);
          setEdges(flowEdges);
        } else {
          toast.error(data.message || "Failed to load skill tree.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillTree();
  }, [subject, navigate]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-red-950 to-orange-950 text-white flex flex-col">
      <motion.header
        className="relative z-10 p-6 flex flex-wrap items-center gap-4 bg-gradient-to-r from-black/90 to-red-950/90 backdrop-blur-sm border-b border-orange-600/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg border border-red-500 transition-all duration-300 shadow-lg"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Back to Dashboard
        </motion.button>

        <div className="flex flex-col">
          <label
            className="text-orange-300 text-xs mb-1 font-bold flex items-center gap-1"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            <FaStarOfLife className="text-orange-400" />
            Choose Your Path:
          </label>
          <motion.select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-gradient-to-r from-gray-900 to-red-900/50 border border-orange-600/50 rounded-lg p-2 text-orange-200 font-bold min-w-[180px] focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
            disabled={availableSubjects.length === 0}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {availableSubjects.length === 0 ? (
              <option value="">🔄 Loading...</option>
            ) : (
              availableSubjects.map((subjectName) => (
                <option
                  key={subjectName}
                  value={subjectName}
                  className="bg-gray-900"
                >
                  <FaBullseye className="inline mr-1" />
                  {subjectName}
                </option>
              ))
            )}
          </motion.select>
        </div>

        {/* Title */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h1
            className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 flex items-center justify-center lg:justify-start gap-2"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            <FaFire className="text-orange-400" />
            Devil's Skill Tree
            <FaFire className="text-orange-400" />
          </h1>
          <p
            className="text-orange-300 text-xs lg:text-sm mt-1 flex items-center justify-center lg:justify-start gap-1"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            Master the dark arts of coding... one skill at a time
            <GiDevilMask className="text-red-400" />
          </p>
        </motion.div>
      </motion.header>

      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <motion.div
            className="text-4xl mb-6 text-orange-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaBolt />
          </motion.div>
          <p
            className="text-2xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-bold flex items-center gap-2"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            {availableSubjects.length === 0 ? (
              <>
                <FaSearch className="text-orange-400" />
                Loading available subjects...
              </>
            ) : (
              <>
                <FaStarOfLife className="text-orange-400" />
                Forging the Devil's Path...
              </>
            )}
          </p>
          <div className="mt-4 flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-red-500 rounded-full"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-transparent"
              style={{
                background: "transparent",
                height: "100%",
                width: "100%",
              }}
            >
              <Background
                color="#f97316"
                gap={20}
                size={1}
                style={{
                  opacity: 0.3,
                }}
              />
              <Controls
                className="!bg-gray-900/80 !border-orange-600/50 !text-orange-300"
                style={{
                  background: "rgba(17, 24, 39, 0.8)",
                  border: "1px solid rgba(249, 115, 22, 0.5)",
                  borderRadius: "8px",
                }}
              />
            </ReactFlow>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SkillTreePage;
