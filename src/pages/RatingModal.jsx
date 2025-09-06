import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

const RatingModal = ({ minister, session, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }
    setLoading(true);
    const { error } = await supabase.rpc("rate_minister", {
      p_minister_id: minister.id,
      p_rating: rating,
      p_user_id: session?.user?.id || null,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Thank you for your rating!");
      if (!session) {
        const ratedMinisters =
          JSON.parse(localStorage.getItem("ratedMinisters")) || [];
        localStorage.setItem(
          "ratedMinisters",
          JSON.stringify([...ratedMinisters, minister.id])
        );
      }
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold mb-4">Rate {minister.name}</h2>

        <div className="flex justify-center sm:justify-between gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-amber-500 px-4 py-2 rounded hover:bg-amber-600 text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
