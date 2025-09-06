// src/pages/Admin.jsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import MinisterModal from "./MinisterModal";

const Admin = ({ session }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ministers, setMinisters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMinister, setSelectedMinister] = useState(null);

  const checkAdminStatus = useCallback(async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) throw error;
      setIsAdmin(data);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const fetchMinisters = useCallback(async () => {
    const { data, error } = await supabase
      .from("ministers")
      .select("*")
      .order("name");
    if (error) {
      toast.error("Failed to fetch ministers.");
    } else {
      setMinisters(data);
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();
  }, [session, checkAdminStatus]);

  useEffect(() => {
    if (isAdmin) fetchMinisters();
  }, [isAdmin, fetchMinisters]);

  const handleAddMinister = () => {
    setSelectedMinister(null); // Add mode
    setIsModalOpen(true);
  };

  const handleEditMinister = (minister) => {
    setSelectedMinister(minister); // Edit mode
    setIsModalOpen(true);
  };

  const handleDeleteMinister = async (ministerId) => {
    const { error } = await supabase
      .from("ministers")
      .delete()
      .match({ id: ministerId });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Minister deleted successfully!");
      fetchMinisters();
    }
  };

  const handleSaveMinister = () => {
    fetchMinisters();
    setIsModalOpen(false);
  };

  if (loading) return <Spinner />;

  if (!isAdmin)
    return <div className="text-center text-red-500">Access Denied.</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleAddMinister}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          Add Minister
        </button>
      </div>

      <MinisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMinister}
        minister={selectedMinister || {}}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Ministers</h2>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Party</th>
                <th className="text-left py-3 px-4">Position</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ministers.map((minister) => (
                <tr key={minister.id} className="border-b border-gray-700">
                  <td className="py-3 px-4">{minister.name}</td>
                  <td className="py-3 px-4">{minister.party}</td>
                  <td className="py-3 px-4">{minister.position}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEditMinister(minister)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 mb-2 sm:mb-0"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMinister(minister.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
