// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Save, X } from "lucide-react";
// import { Header } from "@/components/Header";
// import { useUserStore } from "@/lib/stores/useUserStore";
// import axios from "axios";

// interface EditPageProps {
//   params: {
//     username: string;
//   };
// }

// export default function EditProfilePage({ params }: EditPageProps) {
//   const router = useRouter();
//   const { profile, setProfile } = useUserStore();

//   const [editData, setEditData] = useState({
//     username: "",
//     name: "",
//     email: "",
//     profilePicture: "",
//     location: "",
//     college: "",
//     batch: "2026",
//     bio: ""
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/getuser", {
//           withCredentials: true,
//         });
//         setEditData(res.data || {});
//       } catch (err) {
//         console.error("Failed to fetch user profile:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     setEditData(profile);
//   }, [profile]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await axios.post(
//         "http://localhost:8080/updateprofile",
//         {
//           username: editData.username,
//           name: editData.name,
//           college: editData.college,
//           batch: editData.batch,
//           location: editData.location,
//           bio: editData.bio,
//         },
//         { withCredentials: true }
//       );

//       setProfile(editData);
//       alert("Profile updated!");

//       // ✅ Redirect to updated username profile page
//       router.push(`/profile/${editData.username}`);
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//       alert("Something went wrong.");
//     }
//   };

//   return (
//     <div className="flex h-screen bg-black bg-gradient-to-b from-black to-purple-950 text-white overflow-hidden">
//       <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
//         <Header />
//         <main className="p-4 md:p-6 overflow-y-auto">
//           <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
//             <CardHeader>
//               <CardTitle className="text-lg font-semibold text-purple-300 flex justify-between items-center">
//                 Edit Profile
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => router.push(`/profile/${params.username}`)}
//                   className="text-purple-300 hover:text-white"
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm text-purple-300 mb-1">Username</label>
//                     <Input
//                       name="username"
//                       value={editData.username}
//                       onChange={handleChange}
//                       className="bg-gray-900/50 border-purple-800/50 text-white"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-purple-300 mb-1">Full Name</label>
//                     <Input
//                       name="name"
//                       value={editData.name}
//                       onChange={handleChange}
//                       className="bg-gray-900/50 border-purple-800/50 text-white"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-purple-300 mb-1">Email</label>
//                     <Input
//                       name="email"
//                       value={editData.email}
//                       disabled
//                       className="bg-gray-900/30 border-purple-800/50 text-gray-400"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm text-purple-300 mb-1">Location</label>
//                     <Input
//                       name="location"
//                       value={editData.location}
//                       onChange={handleChange}
//                       className="bg-gray-900/50 border-purple-800/50 text-white"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-purple-300 mb-1">College</label>
//                     <Input
//                       name="college"
//                       value={editData.college}
//                       onChange={handleChange}
//                       className="bg-gray-900/50 border-purple-800/50 text-white"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-purple-300 mb-1">Passout Batch</label>
//                     <select
//                       name="batch"
//                       value={editData.batch}
//                       onChange={handleChange}
//                       className="bg-gray-900/50 border-purple-800/50 text-white rounded-md px-3 py-2 w-full"
//                     >
//                       <option value="2026">2026</option>
//                       <option value="2027">2027</option>
//                       <option value="2028">2028</option>
//                       <option value="2029">2029</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm text-purple-300 mb-1">Bio</label>
//                   <textarea
//                     name="bio"
//                     value={editData.bio || ""}
//                     onChange={handleChange}
//                     rows={4}
//                     placeholder="Tell us about yourself..."
//                     className="w-full rounded-md bg-gray-900/50 border border-purple-800/50 text-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
//                   />
//                 </div>

//                 <div className="pt-4 flex gap-2">
//                   <Button
//                     type="submit"
//                     className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
//                   >
//                     <Save className="h-4 w-4 mr-2" />
//                     Save
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => router.push(`/profile/${params.username}`)}
//                     className="flex-1 border-purple-700 text-purple-300 hover:bg-purple-900/30"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useUserStore } from "@/lib/stores/useUserStore";
import { Save, UploadCloud, X } from "lucide-react";
import axios from "axios";

interface EditPageProps {
  params: {
    username: string;
  };
}

export default function EditProfilePage({ params }: EditPageProps) {
  const router = useRouter();
  const { profile, setProfile } = useUserStore();
  const [editData, setEditData] = useState({
    username: "",
    name: "",
    email: "",
    profilePicture: "",
    location: "",
    college: "",
    batch: "2026",
    bio: ""
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/getuser", {
          withCredentials: true,
        });
        setEditData(res.data || {});
        if (res.data?.profilePicture) setPreview(res.data.profilePicture);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 1024 * 1024 && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Invalid image. Max size: 1MB, formats: PNG/JPG.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", editData.username);
      formData.append("name", editData.name);
      formData.append("college", editData.college);
      formData.append("batch", editData.batch);
      formData.append("location", editData.location);
      formData.append("bio", editData.bio);
      if (image) formData.append("profilePicture", image);

      const res = await axios.post(
        "http://localhost:8080/updateprofile",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile(res.data);
      router.push(`/profile/${editData.username}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
        <Header />
        <main className="p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section: Profile Image + Bio */}
            <div className="lg:col-span-1">
              <div className="relative p-6 rounded-xl border border-white/10 backdrop-blur-lg bg-white/5 hover:shadow-lg transition duration-300">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Profile Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-800/30 to-cyan-900/30 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer">
                    <div className="bg-purple-900/50 border border-purple-700 hover:bg-purple-800 text-sm px-4 py-2 rounded-md text-white text-center w-fit flex items-center gap-2">
                      <UploadCloud className="h-4 w-4" />
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </label>

                  <p className="text-lg font-semibold text-purple-300">@{editData.username}</p>

                  {/* Bio */}
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                        Bio
                      </div>
                    </div>
                    <textarea
                      name="bio"
                      value={editData.bio || ""}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full rounded-md bg-gray-900/50 border border-purple-800/50 text-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Username" name="username" value={editData.username} onChange={handleChange} />
                  <FormInput label="Full Name" name="name" value={editData.name} onChange={handleChange} />
                  <FormInput label="Email" name="email" value={editData.email} disabled />
                  <FormInput label="Location" name="location" value={editData.location} onChange={handleChange} />
                  <FormInput label="College" name="college" value={editData.college} onChange={handleChange} />
                  <div>
                    <label className="block text-sm text-purple-300 mb-1">Passout Batch</label>
                    <select
                      name="batch"
                      value={editData.batch}
                      onChange={handleChange}
                      className="w-full rounded-md bg-gray-900/50 border border-purple-800/50 text-white px-3 py-2"
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-600 hover:to-purple-800"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/profile/${params.username}`)}
                    className="flex-1 border-purple-700 text-purple-300 hover:bg-purple-900/30"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable input
const FormInput = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm text-purple-300 mb-1">{label}</label>
    <Input
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`bg-gray-900/50 border-purple-800/50 text-white ${
        disabled ? "text-gray-400" : ""
      }`}
    />
  </div>
);
