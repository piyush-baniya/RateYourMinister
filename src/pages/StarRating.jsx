import React from "react";

const Star = ({ filled, half }) => {
  const starPath =
    "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z";

  if (half) {
    return (
      <svg
        className="w-5 h-5 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d={starPath} clipPath="url(#half)" />
        <path
          d={starPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <defs>
          <clipPath id="half">
            <rect x="0" y="0" width="10" height="20" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-600"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d={starPath} />
    </svg>
  );
};

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} filled />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<Star key={i} half />);
    } else {
      stars.push(<Star key={i} />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};

export default StarRating;
