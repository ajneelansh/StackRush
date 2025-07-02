"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { Header } from "@/components/Header";
import { useUserStore } from "@/lib/stores/useUserStore";
import axios from "axios";

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, setProfile } = useUserStore();

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    profilePicture: "",
    location: "",
    college: "",
    batch: "2026",
    bio:""
  });

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/getuser", { withCredentials: true });
        setEditData(res.data || {});
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setProfile(editData);
    alert("Profile updated!");
    router.push("/profile");

    try {
      await axios.post(
        "http://localhost:8080/updateprofile",
        {
          name: editData.name,
          college: editData.college,
          batch: editData.batch,
          location: editData.location,
        },
        { withCredentials: true }
      );
      setProfile(editData);
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Something went wrong.");
    }

  };

  return (
    <div className="flex h-screen bg-black bg-gradient-to-b from-black to-purple-950 text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
        <Header />
        <main className="p-4 md:p-6 overflow-y-auto">
          <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-300 flex justify-between items-center">
                Edit Profile
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/profile")}
                  className="text-purple-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-purple-300 mb-1">Full Name</label>
                    <Input
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="bg-gray-900/50 border-purple-800/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-300 mb-1">Email</label>
                    <Input
                      name="email"
                      value={editData.email}
                      disabled
                      className="bg-gray-900/30 border-purple-800/50 text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-purple-300 mb-1">Location</label>
                    <Input
                      name="location"
                      value={editData.location}
                      onChange={handleChange}
                      className="bg-gray-900/50 border-purple-800/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-300 mb-1">College</label>
                    <Input
                      name="college"
                      value={editData.college}
                      onChange={handleChange}
                      className="bg-gray-900/50 border-purple-800/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-300 mb-1">Passout Batch</label>
                    <select
                      name="batch"
                      value={editData.batch}
                      onChange={handleChange}
                      className="bg-gray-900/50 border-purple-800/50 text-white rounded-md px-3 py-2 w-full"
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                </div>

                {/* BIO SECTION */}
                <div>
                  <label className="block text-sm text-purple-300 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={editData.bio || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about yourself(interests, experiences)..."
                    className="w-full rounded-md bg-gray-900/50 border border-purple-800/50 text-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/profile")}
                    className="flex-1 border-purple-700 text-purple-300 hover:bg-purple-900/30"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
