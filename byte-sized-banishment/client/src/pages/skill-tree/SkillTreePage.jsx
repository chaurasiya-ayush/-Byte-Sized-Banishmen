import React, { useState, useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomNode from "./components/CustomNode";

const SkillTreePage = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("JavaScript"); // Default subject
  const navigate = useNavigate();

  // The custom node types need to be memoized to prevent re-renders
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  useEffect(() => {
    const fetchSkillTree = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          `http://localhost:5000/api/skill-tree/${subject}`,
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
            style: { stroke: "#ff0000" },
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
    <div className="w-full h-screen bg-gray-900 text-white">
      <header className="absolute top-0 left-0 z-10 p-4 flex items-center space-x-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          &larr; Back to Dashboard
        </button>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg p-2"
        >
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Data Structures">Data Structures</option>
        </select>
      </header>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-2xl animate-pulse">Forging the Devil's Path...</p>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-900"
        >
          <Background color="#ff0000" gap={16} />
          <Controls />
        </ReactFlow>
      )}
    </div>
  );
};

export default SkillTreePage;
