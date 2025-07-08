"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner" 
import { motion, AnimatePresence } from "framer-motion"


export default function RedeemModal({
  open,
  onClose,
  onSubmit,
  rewardName
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: { fullName: string; email: string; contact: string }) => void
  rewardName: string
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contact: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = () => {
    onSubmit(form)
    toast.success("Order Placed")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        className="bg-gradient-to-br from-gray-900/90 to-purple-950/90 border border-purple-700 p-6 rounded-2xl w-[90%] max-w-md shadow-2xl"
      >
        <h2 className="text-xl font-semibold text-purple-200 mb-4 text-center">
          Redeem: <span className="text-cyan-300">{rewardName}</span>
        </h2>

        <div className="space-y-3">
          <Input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="bg-gray-800 text-white border-purple-600 placeholder:text-purple-300"
          />
          <Input
            name="email"
            placeholder="Email ID"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-800 text-white border-purple-600 placeholder:text-purple-300"
          />
          <Input
            name="contact"
            placeholder="Contact No"
            value={form.contact}
            onChange={handleChange}
            className="bg-gray-800 text-white border-purple-600 placeholder:text-purple-300"
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            className="border-purple-700 text-purple-300 hover:bg-purple-900/30"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-400 hover:to-cyan-500"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  )
}
