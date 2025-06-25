"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCoins } from "@/components/ui/UserCoins"
import { Gift, Edit, Save, X } from "lucide-react"
import Link from "next/link"
import logoImage from "../assets/logo-nav.png"
import {Heatmap} from "@/components/Heatmap"

export default function ProfileSection() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "Aditi Agrawal",
    email: "agrawaladiti125@gmail.com",
    location: "India, Uttar Pradesh, Hathras",
    college: "Indian Institute of Technology",
    profilePicture: "",
  })
  const [editData, setEditData] = useState({ ...formData })
  const [isEditing, setIsEditing] = useState(false)
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({})


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size < 1024 * 1024 && file.type.startsWith("image/")) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    } else {
      alert("Please upload a valid image (PNG/JPG, max 1MB).")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormData(editData)
    setIsEditing(false)
    alert("Profile updated successfully!")
  }


  return (
    <div className="flex h-screen bg-black bg-gradient-to-b from-black to-purple-950 text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
        <header className="sticky top-0 z-10 flex min-h-22 items-center gap-2 md:gap-4 border-b border-purple-900/50 backdrop-blur-sm px-4 md:px-6">
          <div className="w-full flex items-center gap-2 md:gap-4 justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative">
              <Image
                src={logoImage}
                alt="Logo"
                className="w-45 mt-2 hover:brightness-110 transition-all"
                width={180}
                height={40}
              />
            </div>
            </div>
            <div className="flex items-center gap-2 pr-2">
              <Link href="/rewardsstore" className="text-purple-400 hover:text-white transition-transform hover:scale-105">
                <Gift className="h-6 w-6" />
              </Link>
              <UserCoins/>
              {preview ? (
                <Link href="/profile">
                  <Image
                    src={preview}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border border-purple-500 hover:scale-105 transition-transform object-cover cursor-pointer"
                  />
                </Link>
              ) : (
                <Link href="/profile">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center border border-purple-500 hover:scale-105 transition-transform cursor-pointer">
                    <span className="text-white font-medium text-sm">
                      {formData.name?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-purple-300">
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500">
                      {preview ? (
                        <Image
                          src={preview}
                          alt="Profile Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center">
                          <span className="text-4xl">👤</span>
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <Button 
                        variant="outline" 
                        className="bg-purple-900/50 border-purple-700 hover:bg-purple-800 text-sm"
                      >
                        Change Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </Button>
                    </label>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">Name</h3>
                      <p className="text-white">{formData.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">Email</h3>
                      <p className="text-white">{formData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">Location</h3>
                      <p className="text-white">{formData.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-purple-300 mb-1">College</h3>
                      <p className="text-white">{formData.college}</p>
                    </div>
                    <Button 
                      onClick={() => {
                        setEditData(formData)
                        setIsEditing(true)
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
              {isEditing ? (
                <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-purple-300 flex justify-between items-center">
                      Edit Profile
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditing(false)}
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
                            type="email"
                            value={editData.email}
                            disabled
                            className="bg-gray-900/30 border-purple-800/50 text-gray-400 cursor-not-allowed"
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
                          <label className="block text-sm text-purple-300 mb-1">College/University</label>
                          <Input
                            name="college"
                            value={editData.college}
                            onChange={handleChange}
                            className="bg-gray-900/50 border-purple-800/50 text-white"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex gap-2">
                        <Button 
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 border-purple-700 text-purple-300 hover:bg-purple-900/30"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-purple-300">
                        Activity Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center border border-purple-800 rounded-lg p-4">
                          <p className="text-xl font-bold text-cyan-400">0</p>
                          <p className="text-sm text-purple-300">Contests Attended</p>
                        </div>
                        <div className="text-center border border-purple-800 rounded-lg p-4">
                          <p className="text-xl font-bold text-cyan-400">0</p>
                          <p className="text-sm text-purple-300">Problems Solved</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-gradient-to-br from-gray-900/80 to-purple-950/60">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-purple-300">
                        
                      </CardTitle>
                    </CardHeader>
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
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}