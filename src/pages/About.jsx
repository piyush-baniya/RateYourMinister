import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 text-white">
          About RateYourMinister
        </h1>
        <p className="text-lg text-center text-gray-400 mb-12">
          A platform for civic engagement and government accountability.
        </p>

        <div className="space-y-8 text-left">
          <div>
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

          <div>
            <h2 className="text-2xl font-bold text-indigo-400 mb-3">
              How It Works
            </h2>
            <p className="text-gray-300 leading-relaxed">
              You can browse through the list of ministers, view their current
              average ratings, and see how many ratings have been submitted. To
              ensure fairness, each user (identified by their browser's local
              storage) can only rate a minister once.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-indigo-400 mb-3">
              Disclaimer
            </h2>
            <p className="text-gray-300 leading-relaxed bg-gray-900 p-4 rounded-md border-l-4 border-yellow-500">
              <span className="font-bold">Please Note:</span> This website is
              created for fun and educational purposes. The ratings and reviews
              on this platform are based on public opinion and do not represent
              official performance evaluations. It is intended to be a
              demonstration to encourage civic engagement in a playful manner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
