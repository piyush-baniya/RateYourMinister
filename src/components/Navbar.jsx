import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Navbar = ({ session }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(false); // Close menu on logout
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="text-2xl font-bold text-white">
            <Link to="/">RateYourMinister</Link>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white md:hidden">
              <Link to="/">RateYourMinister</Link>
            </div>
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-200 hover:text-white focus:outline-none focus:text-white"
                aria-label="toggle menu"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Menu items */}
          <div
            className={`${
              isOpen ? "flex" : "hidden"
            } flex-col mt-2 space-y-2 md:flex md:flex-row md:mt-0 md:space-y-0 md:space-x-2`}
          >
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            {session && (
              <Link
                to="/history"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                History
              </Link>
            )}
            <div className="flex flex-col md:flex-row md:items-center md:ml-4">
              {session ? (
                <>
                  <span className="text-white px-3 py-2">
                    {session.user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 mt-2 md:mt-0 md:ml-4"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 mt-2 md:mt-0 md:ml-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
