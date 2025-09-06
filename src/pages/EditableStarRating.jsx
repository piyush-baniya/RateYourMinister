import React, { useState } from "react";

const EditableStarRating = ({ rating, onRate, disabled }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={disabled}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              (hoverRating || rating) >= star
                ? "text-yellow-400"
                : "text-gray-600"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default EditableStarRating;
