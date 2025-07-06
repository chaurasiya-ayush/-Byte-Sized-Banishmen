import React from "react";

const GauntletCard = ({ session, onStartGauntlet }) => {
  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center shadow-lg flex flex-col justify-center items-center h-full">
      {session.active ? (
        <>
          <h2 className="text-3xl font-bold mb-2">Continue Your Battle</h2>
          <p className="text-gray-400 mb-4">
            The Devil awaits your return to{" "}
            <span className="font-bold text-red-500">{session.topic}</span>.
          </p>
          <p className="text-lg mb-6">
            You are on <span className="font-bold">{session.progress}</span>.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-lg text-lg transition-all transform hover:scale-105">
            Re-enter the Fray
          </button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-2">A New Challenge Awaits</h2>
          <p className="text-gray-400 mb-6">
            "Think you have what it takes? Choose your poison."
          </p>
          {/* The onClick handler is now wired up correctly */}
          <button
            onClick={onStartGauntlet}
            className="bg-white hover:bg-red-500 text-gray-900 hover:text-white font-bold py-3 px-10 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Begin a New Gauntlet
          </button>
        </>
      )}
    </div>
  );
};

export default GauntletCard;
