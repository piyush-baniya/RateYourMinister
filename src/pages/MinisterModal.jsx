// src/components/MinisterModal.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import UploadImage from "./ImageUpload"; // Cloudinary image uploader component

export default function MinisterModal({
  isOpen,
  onClose,
  onSave,
  minister = {},
}) {
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [position, setPosition] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (minister) {
      setName(minister.name || "");
      setParty(minister.party || "");
      setPosition(minister.position || "");
      setPhotoUrl(minister.photo_url || "");
    }
  }, [minister]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (minister.id) {
        const { error } = await supabase
          .from("ministers")
          .update({ name, party, position, photo_url: photoUrl })
          .eq("id", minister.id);
        if (error) throw error;
        toast.success("Minister updated successfully!");
      } else {
        const { error } = await supabase
          .from("ministers")
          .insert([{ name, party, position, photo_url: photoUrl }]);
        if (error) throw error;
        toast.success("Minister added successfully!");
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">
          {minister.id ? "Edit Minister" : "Add Minister"}
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <input
          type="text"
          placeholder="Party"
          value={party}
          onChange={(e) => setParty(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
        <textarea
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          required
        />

        <div className="flex items-center gap-2">
          <UploadImage onUpload={(url) => setPhotoUrl(url)} />
          {photoUrl && (
            <img
              src={photoUrl}
              alt="preview"
              className="w-16 h-16 rounded object-cover"
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 px-3 py-1 rounded hover:bg-amber-600"
          >
            {loading
              ? minister.id
                ? "Updating..."
                : "Adding..."
              : minister.id
              ? "Update"
              : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
