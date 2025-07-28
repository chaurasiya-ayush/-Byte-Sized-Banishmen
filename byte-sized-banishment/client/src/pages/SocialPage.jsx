import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaUserPlus, FaUsers, FaBell, FaFistRaised } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ChallengeModal from "../components/ChallengeModal";
import { useAuth } from "../context/AuthContext";

// --- Child Components for the Social Page ---

const UserCard = ({ user, onAction, actionText, isFriend, actionIcon }) => (
  <motion.div
    className="flex items-center bg-gradient-to-r from-gray-900/80 to-red-900/40 p-4 rounded-xl border-2 border-gray-600 hover:border-orange-500/50 shadow-lg"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    <div className="flex-grow">
      <p
        className="font-bold text-orange-200 text-lg"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        👤 {user.username}
      </p>
      <p
        className="text-sm text-orange-300"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        🔥 Level {user.level} - {user.rank || "Apprentice"}
      </p>
    </div>
    {onAction && (
      <motion.button
        onClick={() => onAction(user)}
        disabled={actionText === "Sent"}
        className={`font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 shadow-md ${
          actionText === "Sent"
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : isFriend
            ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
            : "bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-black font-bold"
        }`}
        style={{ fontFamily: "Rajdhani, sans-serif" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {actionIcon} {actionText}
      </motion.button>
    )}
  </motion.div>
);

const FriendsList = ({ friends, onChallenge }) => {
  if (friends.length === 0)
    return (
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p
          className="text-orange-400 text-lg"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          👹 You haven't bound any souls... yet. 👹
        </p>
        <p className="text-red-300 text-sm mt-2">
          Find some challengers to forge unholy alliances!
        </p>
      </motion.div>
    );
  return (
    <div className="space-y-4">
      {friends.map((friend, index) => (
        <motion.div
          key={friend._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <UserCard
            user={friend}
            onAction={onChallenge}
            actionText="Challenge"
            isFriend={true}
            actionIcon={<FaFistRaised />}
          />
        </motion.div>
      ))}
    </div>
  );
};

const DuelsList = ({ duels, currentUserId, onPlay }) => {
  if (duels.length === 0)
    return (
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p
          className="text-orange-400 text-lg"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          ⚔️ No active duels. Challenge a friend! ⚔️
        </p>
        <p className="text-red-300 text-sm mt-2">
          The arena awaits your battles...
        </p>
      </motion.div>
    );

  return (
    <div className="space-y-4">
      {duels.map((duel, index) => {
        const isMyTurn =
          (duel.challenger._id === currentUserId &&
            duel.status === "pending_challenger") ||
          (duel.opponent._id === currentUserId &&
            duel.status === "pending_opponent");
        const opponent =
          duel.challenger._id === currentUserId
            ? duel.opponent
            : duel.challenger;

        let statusText, statusColor;
        if (duel.status === "complete") {
          statusText =
            duel.winner === currentUserId
              ? "🏆 Victory"
              : duel.winner === null
              ? "⚖️ Draw"
              : "💀 Defeat";
          statusColor =
            duel.winner === currentUserId
              ? "text-yellow-400"
              : duel.winner === null
              ? "text-orange-400"
              : "text-red-400";
        } else if (isMyTurn) {
          statusText = "🔥 Your Turn!";
          statusColor = "text-orange-400 animate-pulse";
        } else {
          statusText = `⏳ Waiting for ${opponent.username}`;
          statusColor = "text-gray-400";
        }

        return (
          <motion.div
            key={duel._id}
            className="flex items-center bg-gradient-to-r from-gray-900/80 to-red-900/40 p-5 rounded-xl border-2 border-gray-600 hover:border-orange-500/50 shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="flex-grow">
              <p
                className="font-bold text-orange-200 text-lg"
                style={{ fontFamily: "Rajdhani, sans-serif" }}
              >
                ⚔️ Duel vs. {opponent.username}
              </p>
              <p
                className="text-sm text-orange-300"
                style={{ fontFamily: "Rajdhani, sans-serif" }}
              >
                📚 Subject: {duel.subject}
              </p>
              <p
                className={`text-sm font-bold ${statusColor}`}
                style={{ fontFamily: "Rajdhani, sans-serif" }}
              >
                {statusText}
              </p>
            </div>
            {isMyTurn && (
              <motion.button
                onClick={() => onPlay(duel._id)}
                className="font-bold py-3 px-6 rounded-lg text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                style={{ fontFamily: "Rajdhani, sans-serif" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎮 Play
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

const FindPlayers = ({ token }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    if (query.trim().length > 2) {
      const search = async () => {
        try {
          console.log("Searching for users with query:", query);
          const { data } = await axios.get(
            `http://localhost:5000/api/friends/search?q=${query}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Search results:", data);
          setResults(data);
        } catch (error) {
          console.error("Search error:", error.response?.data || error.message);
          setResults([]);
        }
      };
      const timeoutId = setTimeout(search, 500); // Debounce search
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query, token]);

  const handleSendRequest = async (user) => {
    try {
      console.log(
        "Sending friend request to:",
        user.username,
        "with ID:",
        user._id
      );
      const response = await axios.post(
        `http://localhost:5000/api/friends/request/${user._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Friend request response:", response.data);
      setSentRequests([...sentRequests, user._id]);
    } catch (error) {
      console.error(
        "Error sending friend request:",
        error.response?.data || error.message
      );
      // You can add a toast notification here if needed
    }
  };

  return (
    <div>
      <motion.input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Search for challengers by username..."
        className="w-full p-4 bg-gradient-to-r from-gray-900 to-red-900/50 border-2 border-gray-700 focus:border-orange-500 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white placeholder-orange-300 transition-all duration-300"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      />
      <div className="space-y-4">
        {results.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <UserCard
              user={user}
              onAction={handleSendRequest}
              actionText={
                sentRequests.includes(user._id) ? "Sent" : "Add Friend"
              }
              actionIcon={<FaUserPlus />}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const FriendRequests = ({ requests, token, onUpdate }) => {
  const handleAccept = async (userId) => {
    await axios.post(
      `http://localhost:5000/api/friends/accept/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onUpdate();
  };
  const handleDecline = async (userId) => {
    await axios.post(
      `http://localhost:5000/api/friends/decline/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onUpdate();
  };

  if (requests.length === 0)
    return (
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p
          className="text-orange-400 text-lg"
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          📭 No new friend requests.
        </p>
        <p className="text-red-300 text-sm mt-2">
          Your reputation precedes you...
        </p>
      </motion.div>
    );

  return (
    <div className="space-y-4">
      {requests.map((req, index) => (
        <motion.div
          key={req._id}
          className="flex items-center bg-gradient-to-r from-gray-900/80 to-orange-900/40 p-5 rounded-xl border-2 border-orange-600/50 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex-grow">
            <p
              className="font-bold text-orange-200 text-lg"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              👤 {req.username}
            </p>
            <p
              className="text-sm text-orange-300"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              🔥 Level {req.level} - {req.rank || "Apprentice"}
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => handleAccept(req._id)}
              className="font-bold py-2 px-4 rounded-lg text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✅ Accept
            </motion.button>
            <motion.button
              onClick={() => handleDecline(req._id)}
              className="font-bold py-2 px-4 rounded-lg text-sm bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-md"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ❌ Decline
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const SocialPage = () => {
  const [activeTab, setActiveTab] = useState("duels");
  const [data, setData] = useState({ friends: [], requests: [], duels: [] });
  const [loading, setLoading] = useState(true);
  const [isChallengeModalOpen, setChallengeModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const { currentUser } = useAuth();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsRes, duelsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/friends/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/duels/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setData({
        friends: friendsRes.data.friends,
        requests: friendsRes.data.requests,
        duels: duelsRes.data.duels,
      });
    } catch (error) {
      console.error("Failed to fetch social data", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChallengeClick = (friend) => {
    setSelectedFriend(friend);
    setChallengeModalOpen(true);
  };

  const handlePlayDuel = (duelId) => {
    navigate(`/duel/${duelId}`);
  };

  const tabs = [
    { id: "duels", label: "Duels", icon: <FaFistRaised /> },
    { id: "friends", label: "Friends", icon: <FaUsers /> },
    {
      id: "requests",
      label: "Requests",
      icon: <FaBell />,
      count: data.requests.length,
    },
    { id: "find", label: "Find Players", icon: <FaUserPlus /> },
  ];

  return (
    <>
      <ChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setChallengeModalOpen(false)}
        friend={selectedFriend}
        token={token}
      />
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-orange-950 text-white p-4 sm:p-8">
        <header className="text-center mb-12">
          <motion.h1
            className="text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400"
            style={{
              fontFamily: "Orbitron, monospace",
              textShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🔥 The Soul-Binding 🔥
          </motion.h1>
          <motion.p
            className="text-orange-200 mt-4 text-lg"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Forge unholy alliances and challenge your rivals in the fires of
            coding hell 😈
          </motion.p>
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg border border-red-500 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Dashboard
          </motion.button>
        </header>
        <motion.div
          className="bg-gradient-to-br from-gray-900/90 to-red-900/50 backdrop-blur-sm border-2 border-orange-600/30 rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex border-b-2 border-orange-600/50 mb-6">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 font-bold py-4 px-6 transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? "text-orange-400"
                    : "text-gray-400 hover:text-orange-300"
                }`}
                style={{ fontFamily: "Rajdhani, sans-serif" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon} {tab.label}
                {tab.count > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {tab.count}
                  </motion.span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                    layoutId="underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "duels" && (
                <DuelsList
                  duels={data.duels}
                  currentUserId={currentUser.id}
                  onPlay={handlePlayDuel}
                />
              )}
              {activeTab === "friends" && (
                <FriendsList
                  friends={data.friends}
                  onChallenge={handleChallengeClick}
                />
              )}
              {activeTab === "requests" && (
                <FriendRequests
                  requests={data.requests}
                  token={token}
                  onUpdate={fetchData}
                />
              )}
              {activeTab === "find" && <FindPlayers token={token} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};
export default SocialPage;
