import React from "react";
import logo from "../assets/logo.png";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-200 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-700/50">
        <div className="text-center mb-12">
          <img
            src={logo}
            alt="RateYourMinister Logo"
            className="mx-auto h-24 w-auto mb-6 drop-shadow-lg"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            About RateYourMinister
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            A platform for civic engagement and government accountability.
          </p>
        </div>

        <div className="space-y-10 text-left">
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-indigo-400 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Our mission is to foster a more transparent and accountable
              government by providing a platform for citizens to voice their
              opinions on the performance of public officials. We believe that
              constructive feedback and public discourse are essential for a
              healthy and responsive democracy.
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-indigo-400 mb-3">
              How It Works
            </h2>
            <p className="text-gray-300 leading-relaxed">
              You can browse through the list of ministers, view their current
              average ratings, and see how many ratings have been submitted. To
              ensure fairness, anonymous users (identified by their browser's
              local storage) can only rate a minister once. Logged-in users can
              update their ratings at any time.
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-indigo-400 mb-3">
              Disclaimer
            </h2>
            <p className="text-gray-300 leading-relaxed bg-gray-900 p-4 rounded-md border-l-4 border-yellow-500">
              <span className="font-bold">Please Note:</span> This website is a
              portfolio project created for fun and educational purposes. The
              ratings and reviews on this platform are based on public opinion
              and do not represent official performance evaluations. It is
              intended to be a demonstration of web development skills and to
              encourage civic engagement in a playful manner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
