import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import MinisterCard from "./MinisterCard";
import Spinner from "./Spinner";
import WelcomePopup from "./WelcomePopup";

const Home = ({ session }) => {
  const [ministers, setMinisters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRatings, setUserRatings] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [sortBy, setSortBy] = useState("count_desc");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12; // Number of items to fetch per page

  const fetchMinisters = useCallback(async () => {
    if (!hasMore && page !== 0) return; // Don't fetch if no more data, unless it's a reset
    setLoading(true);

    // Fetch user ratings if logged in
    if (session) {
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("ratings")
        .select("minister_id, rating")
        .eq("user_id", session.user.id);

      if (ratingsError) {
        console.error("Error fetching user ratings:", ratingsError);
      } else {
        const ratingsMap = ratingsData.reduce((acc, rating) => {
          acc[rating.minister_id] = rating.rating;
          return acc;
        }, {});
        setUserRatings(ratingsMap);
      }
    }

    let query = supabase
      .from("ministers_with_ratings")
      .select("*", { count: "exact" });

    // Apply search filter
    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,party.ilike.%${searchTerm}%`
      );
    }

    // Apply sorting
    const [orderBy, orderDirection] = sortBy.split("_");
    const isAscending = orderDirection === "asc";
    let sortColumn = "name";
    if (orderBy === "rating") {
      sortColumn = "average_rating";
    } else if (orderBy === "count") {
      sortColumn = "rating_count";
    }

    query = query.order(sortColumn, {
      ascending: isAscending,
    });

    // Apply pagination
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching ministers:", error);
    } else {
      // If it's the first page, replace the data. Otherwise, append it.
      setMinisters((prev) => (page === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE && count > (page + 1) * PAGE_SIZE);
    }
    setLoading(false);
  }, [searchTerm, sortBy, page, hasMore, session]);

  // Effect to fetch data when filters or page change
  useEffect(() => {
    fetchMinisters();
  }, [searchTerm, sortBy, page, session]);

  // Effect to reset and fetch when search/sort changes
  useEffect(() => {
    setMinisters([]);
    setPage(0);
    setUserRatings({});
    setHasMore(true);
  }, [searchTerm, sortBy]);

  // Effect to decide whether to show the popup
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenWelcomePopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("hasSeenWelcomePopup", "true");
  };

  // Callback for when a rating is successful
  const handleRatingSuccess = (update) => {
    // Update the specific minister's card without a full refetch
    setMinisters((prevMinisters) =>
      prevMinisters.map((minister) => {
        if (minister.id === update.ministerId) {
          return {
            ...minister,
            average_rating: update.newAverage,
            rating_count: update.newCount,
          };
        }
        return minister;
      })
    );
    setUserRatings((prev) => ({
      ...prev,
      [update.ministerId]: update.userRating,
    }));
  };

  // Infinite scroll observer
  const observer = React.useRef();
  const lastMinisterElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="container mx-auto px-4">
      {showPopup && <WelcomePopup onClose={handleClosePopup} />}
      <div className="text-center py-8 md:py-16 mb-8 md:mb-12 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-gray-900/80 rounded-xl shadow-2xl border border-white/10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-3 tracking-tight">
          Rate Nepal's Ministers
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-2">
          Your voice matters. Rate the performance of our leaders.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-4 z-10 bg-gray-900/70 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or party..."
            className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-auto bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="count_desc">Sort by Most Rated</option>
          <option value="rating_desc">Sort by Highest Rated</option>
          <option value="rating_asc">Sort by Lowest Rated</option>
          <option value="name_asc">Sort by Name (A-Z)</option>
          <option value="name_desc">Sort by Name (Z-A)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {ministers.map((minister, index) => {
          // Attach the ref to the last element for infinite scroll
          if (ministers.length === index + 1) {
            return (
              <div ref={lastMinisterElementRef} key={minister.id}>
                <MinisterCard
                  minister={minister}
                  session={session}
                  userRating={userRatings[minister.id]}
                  onRatingSuccess={handleRatingSuccess}
                />
              </div>
            );
          } else {
            return (
              <MinisterCard
                key={minister.id}
                minister={minister}
                session={session}
                userRating={userRatings[minister.id]}
                onRatingSuccess={handleRatingSuccess}
              />
            );
          }
        })}
      </div>

      {loading && <Spinner />}
      {!loading && ministers.length === 0 && (
        <p className="text-center text-gray-400 mt-8">
          No ministers found. Try adjusting your search.
        </p>
      )}
    </div>
  );
};

export default Home;
