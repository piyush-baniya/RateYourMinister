import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MinisterDetail from "./pages/MinisterDetail";
import History from "./pages/History";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Or a loading spinner for the whole app
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar session={session} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home session={session} />} />
          <Route path="/history" element={<History session={session} />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin session={session} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/minister/:ministerId" element={<MinisterDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
