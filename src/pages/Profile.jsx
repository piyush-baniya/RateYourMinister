import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Spinner from "./Spinner";
import StarRating from "./StarRating";

const Profile = ({ session }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
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
        console.error("Error fetching user ratings:", error);
      } else {
        setRatings(data);
      }
      setLoading(false);
    };

    fetchUserRatings();
  }, [session, navigate]);

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">
        Your Rating History
      </h1>
      <div className="space-y-4">
        {ratings.length > 0 ? (
          ratings.map((rating, index) => (
            <div
              key={index}
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
              <div className="text-right">
                <StarRating rating={rating.rating} />
                <span className="text-lg font-bold text-yellow-400">
                  {rating.rating.toFixed(1)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">You haven't rated any ministers yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
