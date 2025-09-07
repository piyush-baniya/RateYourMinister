import React from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

const WelcomePopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-4 text-center border border-gray-700 transform transition-all animate-slide-in-bottom">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500/20 mb-4 border border-indigo-500/30">
          <ShieldCheckIcon
            className="h-8 w-8 text-indigo-400"
            aria-hidden="true"
          />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-white tracking-tight">
          Your Opinion Matters
        </h2>
        <p className="text-gray-400 mb-8">
          Your thoughtful rating contributes to a fair and balanced
          representation of our leaders' performance.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;
