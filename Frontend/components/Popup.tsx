"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";

type PopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    college: string;
    batch: string;
    username: string;
  }) => void;
  user: {
    name: string;
    email: string;
    profilePicture: string;
    batch?: string;
    college?: string;
    username?: string;
  } | null;
};

export const Popup = ({ open, onClose, onSubmit, user }: PopupProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    college: user?.college || "",
    batch: user?.batch || "2026",
    username: user?.username || "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        college: user.college || "",
        batch: user.batch || "2026",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, college, batch, username } = formData;

    if (!name.trim() || !college.trim() || !username.trim()) {
      setError("All fields are required.");
      return;
    }

    setError("");

    try {
      await axios.post(
        "http://localhost:8080/updateprofile",
        { name, college, batch, username },
        { withCredentials: true }
      );

      onSubmit(formData);
      onClose();
      window.location.href = `/profile/${username}`;
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Username may already exist. Try a different one.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-[90%] max-w-md bg-gradient-to-br from-gray-950/90 to-purple-950/80 border border-purple-800/50 shadow-2xl rounded-2xl px-6 py-8 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
          >
            {/* Neon border glow */}
            <div className="absolute -inset-1 rounded-2xl border border-purple-600 blur-sm animate-pulse opacity-20 pointer-events-none" />

            <h2 className="text-center text-2xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Setup Your Profile
            </h2>

            <div className="space-y-4">
              {[
                { name: "name", label: "Full Name", placeholder: "Your full name" },
                { name: "username", label: "Username", placeholder: "Unique handle (e.g. xyz123)" },
                { name: "college", label: "College", placeholder: "Your college/institute" },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="text-sm font-medium text-purple-300 mb-1 block">
                    {label}
                  </label>
                  <Input
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="bg-gray-900 text-white border border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-purple-300 mb-1 block">
                  Passout Batch
                </label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-700/30 p-2 rounded-md">
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-light py-2 rounded-full hover:scale-105 transition-transform"
              >
                Save Profile
                <FiArrowRight className="text-xl" />
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border border-gray-600 text-white rounded-full hover:bg-gray-800 hover:text-white transition font-light"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
