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
    className="flex items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring" }}
  >
    <div className="flex-grow">
      <p className="font-bold text-white">{user.username}</p>
      <p className="text-sm text-gray-400">
        Level {user.level} - {user.rank}
      </p>
    </div>
    {onAction && (
      <button
        onClick={() => onAction(user)}
        disabled={actionText === "Sent"}
        className={`font-semibold py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-2 ${
          actionText === "Sent"
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : isFriend
            ? "bg-red-600 hover:bg-red-500"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {actionIcon} {actionText}
      </button>
    )}
  </motion.div>
);

const FriendsList = ({ friends, onChallenge }) => {
  if (friends.length === 0)
    return (
      <p className="text-gray-500 text-center mt-8">
        You haven't bound any souls... yet.
      </p>
    );
  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <UserCard
          key={friend._id}
          user={friend}
          onAction={onChallenge}
          actionText="Challenge"
          isFriend={true}
          actionIcon={<FaFistRaised />}
        />
      ))}
    </div>
  );
};

const DuelsList = ({ duels, currentUserId, onPlay }) => {
  if (duels.length === 0)
    return (
      <p className="text-gray-500 text-center mt-8">
        No active duels. Challenge a friend!
      </p>
    );

  return (
    <div className="space-y-3">
      {duels.map((duel) => {
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
              ? "Victory"
              : duel.winner === null
              ? "Draw"
              : "Defeat";
          statusColor =
            duel.winner === currentUserId
              ? "text-green-400"
              : duel.winner === null
              ? "text-yellow-400"
              : "text-red-400";
        } else if (isMyTurn) {
          statusText = "Your Turn!";
          statusColor = "text-blue-400 animate-pulse";
        } else {
          statusText = `Waiting for ${opponent.username}`;
          statusColor = "text-gray-500";
        }

        return (
          <motion.div
            key={duel._id}
            className="flex items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700"
          >
            <div className="flex-grow">
              <p className="font-bold text-white">
                Duel vs. {opponent.username}
              </p>
              <p className="text-sm text-gray-400">Subject: {duel.subject}</p>
              <p className={`text-sm font-bold ${statusColor}`}>{statusText}</p>
            </div>
            {isMyTurn && (
              <button
                onClick={() => onPlay(duel._id)}
                className="font-semibold py-2 px-4 rounded-md text-sm bg-green-600 hover:bg-green-500"
              >
                Play
              </button>
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
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for challengers by username..."
        className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <div className="space-y-3">
        {results.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onAction={handleSendRequest}
            actionText={sentRequests.includes(user._id) ? "Sent" : "Add Friend"}
            actionIcon={<FaUserPlus />}
          />
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
      <p className="text-gray-500 text-center mt-8">No new friend requests.</p>
    );

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <motion.div
          key={req._id}
          className="flex items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex-grow">
            <p className="font-bold text-white">{req.username}</p>
            <p className="text-sm text-gray-400">
              Level {req.level} - {req.rank}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(req._id)}
              className="font-semibold py-1 px-3 rounded-md text-sm bg-green-600 hover:bg-green-500"
            >
              Accept
            </button>
            <button
              onClick={() => handleDecline(req._id)}
              className="font-semibold py-1 px-3 rounded-md text-sm bg-red-600 hover:bg-red-500"
            >
              Decline
            </button>
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
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
        <header className="text-center mb-12">
          <h1
            className="text-5xl font-black uppercase text-white"
            style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.7)" }}
          >
            The Soul-Binding
          </h1>
          <p className="text-gray-400 mt-2">
            Forge alliances and challenge your rivals.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            &larr; Back to Dashboard
          </button>
        </header>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 max-w-4xl mx-auto">
          <div className="flex border-b border-gray-700 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 font-semibold py-3 px-4 transition-colors relative ${
                  activeTab === tab.id
                    ? "text-red-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon} {tab.label}
                {tab.count > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                    layoutId="underline"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
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
        </div>
      </div>
    </>
  );
};
export default SocialPage;
