"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";

type PopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; college: string; batch: string }) => void;
  user: { name: string, email: string, profilePicture: string, batch?: string, college?:string } | null;
};

export const Popup = ({ open, onClose, onSubmit, user }: PopupProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    college: user?.college || "",
    batch: user?.batch || "2026",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        college: user.college || "",
        batch: user.batch || "2026",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  const { name, college, batch } = formData;

  if (!name.trim() || !college.trim()) {
    setError("Name and College cannot be empty.");
    return;
  }

  setError("");

  try {
    await axios.post(
      "http://localhost:8080/updateprofile",
      { name, college, batch },
      { withCredentials: true }
    );
    onClose(); 
  } catch (error) {
    console.error("Failed to update profile:", error);
    setError("Failed to update profile. Try again.");
  }
};

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900/90 to-purple-950/90 p-6 rounded-2xl w-[90%] max-w-md shadow-2xl border border-purple-700"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h2 className="text-xl font-semibold text-purple-200 mb-4 text-center">Complete Your Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-purple-300">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 bg-gray-800 text-white border-purple-600"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300">College</label>
                <Input
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="mt-1 bg-gray-800 text-white border-purple-600"
                />
              </div>
              <div>
                <label className="text-sm text-purple-300">Passout Batch</label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-md bg-gray-800 text-white border-purple-600 px-3 py-2"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-400 hover:to-cyan-500"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-purple-700 text-purple-300 hover:bg-purple-900/30"
                onClick={onClose}
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
