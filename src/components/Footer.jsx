import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-center p-4 mt-8">
      <p className="text-gray-400">
        &copy; {new Date().getFullYear()} RateYourMinister. Made For Fun.
      </p>
    </footer>
  );
};

export default Footer;
