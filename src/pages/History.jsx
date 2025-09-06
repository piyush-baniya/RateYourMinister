import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import StarRating from "./StarRating";
import EditableStarRating from "./EditableStarRating";

const History = ({ session }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchUserRatings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("ratings")
        .select(
          `
          id,
          rating,
          created_at,
          ministers_with_ratings (
            name,
            photo_url,
            position
          )
        `
        )
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Could not fetch your rating history.");
      } else {
        setRatings(data);
      }
      setLoading(false);
    };

    fetchUserRatings();
  }, [session, navigate]);

  const handleUpdateRating = async (ratingId, newRating) => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from("ratings")
      .update({ rating: newRating })
      .eq("id", ratingId);

    if (error) {
      toast.error("Failed to update rating.");
    } else {
      toast.success("Rating updated successfully!");
      setRatings((prevRatings) =>
        prevRatings.map((r) =>
          r.id === ratingId ? { ...r, rating: newRating } : r
        )
      );
      setEditingRatingId(null);
    }
    setIsSubmitting(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">
        Your Rating History
      </h1>
      <div className="space-y-4">
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <div
              key={rating.id}
              className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4"
            >
              <img
                src={
                  rating.ministers_with_ratings.photo_url ||
                  "https://via.placeholder.com/100"
                }
                alt={rating.ministers_with_ratings.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-bold">
                  {rating.ministers_with_ratings.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {rating.ministers_with_ratings.position}
                </p>
                <p className="text-xs text-gray-500">
                  Rated on: {new Date(rating.created_at).toLocaleDateString()}
                </p>
              </div>
              {editingRatingId === rating.id ? (
                <div className="flex flex-col items-end space-y-2">
                  {/* Make stars slightly larger to match old style */}
                  <div className="[&_svg]:w-6 [&_svg]:h-6">
                    <EditableStarRating
                      rating={rating.rating}
                      onRate={(newRating) =>
                        handleUpdateRating(rating.id, newRating)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    onClick={() => setEditingRatingId(null)}
                    className="text-xs text-gray-400 hover:text-white"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <StarRating rating={rating.rating} />
                    <span className="text-lg font-bold text-yellow-400">
                      {rating.rating.toFixed(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingRatingId(rating.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">You haven't rated any ministers yet.</p>
        )}
      </div>
    </div>
  );
};

export default History;
