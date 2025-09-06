// src/components/UploadImage.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function UploadImage({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        toast.success("Image uploaded successfully!");
        onUpload(data.secure_url); // send URL back to parent
      } else {
        toast.error("Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while uploading image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer">
        {uploading ? "Uploading..." : "Upload Photo"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
