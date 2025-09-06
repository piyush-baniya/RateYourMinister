import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import RatingModal from "./RatingModal";
import StarRating from "./StarRating";
import EditableStarRating from "./EditableStarRating";

const MinisterCard = ({ minister, session, onRatingSuccess, userRating }) => {
  const [hasRated, setHasRated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isRated = false;
    // Logged-in user's rating takes precedence
    if (session && userRating) {
      isRated = true;
    } else if (!session) {
      // Fallback for anonymous ratings
      const ratedMinisters =
        JSON.parse(localStorage.getItem("ratedMinisters")) || [];
      if (ratedMinisters.includes(minister.id)) {
        isRated = true;
      }
    }
    setHasRated(isRated);
  }, [minister.id, session, userRating, isEditing]);

  const handleRatingSuccess = () => {
    setHasRated(true);
    onRatingSuccess();
    setIsModalOpen(false);
  };

  const handleUpdateRating = async (newRating) => {
    if (!session) {
      toast.error("You must be logged in to update your rating.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase
      .from("ratings")
      .update({ rating: newRating })
      .eq("user_id", session.user.id)
      .eq("minister_id", minister.id);

    if (error) {
      toast.error("Failed to update rating.");
      console.error("Error updating rating:", error);
    } else {
      toast.success("Rating updated successfully!");
      // Trigger a full refresh to get new average ratings
      onRatingSuccess();
    }
    setIsEditing(false);
    setIsSubmitting(false);
  };

  const getRatingBarColor = (rating) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 2.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col border border-transparent hover:border-indigo-500 group">
        <div className="relative">
          <img
            src={minister.photo_url || "https://via.placeholder.com/400x300"}
            alt={minister.name}
            className="w-full h-60 sm:h-64 object-cover group-hover:opacity-90 transition-opacity"
          />
          {minister.average_rating >= 4 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
              Highly Rated
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-1.5">
            <div
              className={`h-full rounded-r-full transition-all duration-500 ${getRatingBarColor(
                minister.average_rating
              )}`}
              style={{ width: `${(minister.average_rating / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 tracking-tight">
            {minister.name}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-3">
            {minister.position}
          </p>
          <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-gray-300 self-start">
            {minister.party}
          </span>
          <div className="mt-auto">
            <div className="flex items-center justify-between pt-4">
              <div>
                <StarRating rating={minister.average_rating} />
                <div className="text-yellow-400 font-bold text-base sm:text-lg mt-1">
                  Avg: {minister.average_rating.toFixed(1)} (
                  {minister.rating_count})
                </div>
              </div>
              {session && userRating ? ( // User is logged in and has rated
                isEditing ? ( // User is in edit mode
                  <div className="flex flex-col items-end space-y-1">
                    <EditableStarRating
                      rating={userRating}
                      onRate={handleUpdateRating}
                      disabled={isSubmitting}
                    />
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-gray-400 hover:text-white"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // User is in view mode, show only the edit icon with a tooltip
                  <div className="relative flex items-center">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-400 hover:text-white transition-colors rounded-full peer"
                      aria-label="Edit rating"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path
                          fillRule="evenodd"
                          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="absolute bottom-full left-1/12 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Edit your rating
                    </div>
                  </div>
                )
              ) : (
                // User is anonymous or has not rated
                <button
                  onClick={() =>
                    hasRated
                      ? toast.error("You have already rated this minister.")
                      : setIsModalOpen(true)
                  }
                  disabled={hasRated}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {hasRated ? "Rated" : "Rate"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <RatingModal
          minister={minister}
          session={session}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleRatingSuccess}
        />
      )}
    </>
  );
};

export default MinisterCard;
