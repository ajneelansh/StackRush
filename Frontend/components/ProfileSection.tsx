// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Edit } from "lucide-react";
// import { Heatmap } from "@/components/Heatmap";
// import { Header } from "@/components/Header";
// import { useUserStore } from "@/lib/stores/useUserStore"; // adjust path if needed

// export default function ProfileSection() {
//   const router = useRouter();
//   const profile = useUserStore((state) => state.profile);

//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string>("");

//   const [heatmapData] = useState<Record<string, number>>({});

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && file.size < 1024 * 1024 && file.type.startsWith("image/")) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//     } else {
//       alert("Please upload a valid image (PNG/JPG, max 1MB).");
//     }
//   };

//   return (
//     <div className="flex h-screen bg-black bg-gradient-to-b from-black to-purple-950 text-white overflow-hidden">
//       <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
//         <Header />
//         <main className="p-4 md:p-6 overflow-y-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-1">
//               <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
//                 <CardContent>
//                   <div className="flex flex-col items-center gap-4">
//                     <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500">
//                       {preview ? (
//                         <Image src={preview} alt="Profile Preview" fill  unoptimized priority className="object-cover" />
//                       ) : (
//                         <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center">
//                           <span className="text-4xl">👤</span>
//                         </div>
//                       )}
//                     </div>
//                     <label className="cursor-pointer">
//                       <div className="bg-purple-900/50 border border-purple-700 hover:bg-purple-800 text-sm px-4 py-2 rounded-md text-white text-center w-fit">
//                         Change Photo
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                           className="hidden"
//                         />
//                       </div>
//                     </label>
//                   </div>

//                   <div className="mt-8 space-y-4">
//                     <div>
//                       <h3 className="text-sm text-purple-300 mb-1">Name</h3>
//                       <p className="text-white">{profile.name}</p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm text-purple-300 mb-1">Email</h3>
//                       <p className="text-white">{profile.email}</p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm text-purple-300 mb-1">Location</h3>
//                       <p className="text-white">{profile.location}</p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm text-purple-300 mb-1">College</h3>
//                       <p className="text-white">{profile.college}</p>
//                     </div>
//                     <div>
//                       <h3 className="text-sm text-purple-300 mb-1">Passout Batch</h3>
//                       <p className="text-white">{profile.batch}</p>
//                     </div>

//                     <Button
//                       onClick={() => {
//                         router.push("/profile/edit");
//                       }}
//                       className="mt-4 w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
//                     >
//                       <Edit className="h-4 w-4 mr-2" />
//                       Edit Profile
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="lg:col-span-2 space-y-6">
//               <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
//                 <CardContent>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="text-center border border-purple-800 rounded-lg p-8">
//                       <p className="text-3xl font-bold text-cyan-400">0</p>
//                       <p className="text-md text-purple-300">Contests Attended</p>
//                     </div>
//                     <div className="text-center border border-purple-800 rounded-lg p-8">
//                       <p className="text-3xl font-bold text-cyan-400">0</p>
//                       <p className="text-md text-purple-300">Problems Solved</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
//                 <CardContent>
//                   <div className="w-full overflow-x-auto">
//                     <div className="min-w-[300px] rounded-lg border border-purple-800/30 bg-gradient-to-br from-gray-900/50 to-purple-950/30 p-4">
//                       <h2 className="text-white font-semibold text-sm mb-6">
//                         {Object.values(heatmapData).reduce((sum, count) => sum + count, 0)} submissions in the past year
//                       </h2>
//                       <Heatmap data={heatmapData} />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Heatmap } from "@/components/Heatmap";
import { Header } from "@/components/Header";
import { useUserStore } from "@/lib/stores/useUserStore"; // adjust path if needed

export default function ProfileSection() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [heatmapData] = useState<Record<string, number>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 1024 * 1024 && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image (PNG/JPG, max 1MB).");
    }
  };

  return (
    <div className="flex h-screen bg-black bg-gradient-to-b from-black to-purple-950 text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
        <Header />
        <main className="p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500">
                      {preview ? (
                        <Image src={preview} alt="Profile Preview" fill unoptimized priority className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center">
                          <span className="text-4xl">👤</span>
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <div className="bg-purple-900/50 border border-purple-700 hover:bg-purple-800 text-sm px-4 py-2 rounded-md text-white text-center w-fit">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-white text-sm px-4 ">
                      {profile.bio || "No bio added yet."}
                    </p>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">Name</h3>
                      <p className="text-white">{profile.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">Email</h3>
                      <p className="text-white">{profile.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">Location</h3>
                      <p className="text-white">{profile.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">College</h3>
                      <p className="text-white">{profile.college}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">Passout Batch</h3>
                      <p className="text-white">{profile.batch}</p>
                    </div>

                    <Button
                      onClick={() => {
                        router.push("/profile/edit");
                      }}
                      className="mt-4 w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center border border-purple-800 rounded-lg p-8">
                      <p className="text-3xl font-bold text-cyan-400">0</p>
                      <p className="text-md text-purple-300">Contests Attended</p>
                    </div>
                    <div className="text-center border border-purple-800 rounded-lg p-8">
                      <p className="text-3xl font-bold text-cyan-400">0</p>
                      <p className="text-md text-purple-300">Problems Solved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[300px] rounded-lg border border-purple-800/30 bg-gradient-to-br from-gray-900/50 to-purple-950/30 p-4">
                      <h2 className="text-white font-semibold text-sm mb-6">
                        {Object.values(heatmapData).reduce((sum, count) => sum + count, 0)} submissions in the past year
                      </h2>
                      <Heatmap data={heatmapData} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
