// components/Heatmap.tsx
"use client"

import React from "react"
import { eachDayOfInterval, format, subDays } from "date-fns"

const getColor = (count: number) => {
  if (count === 0) return "bg-gray-800 border-gray-700"
  if (count < 3) return "bg-cyan-900 border-cyan-700"
  if (count < 6) return "bg-cyan-700 border-cyan-500"
  if (count < 10) return "bg-purple-700 border-purple-500"
  return "bg-purple-500 border-purple-400"
}

interface HeatmapProps {
  data?: Record<string, number>
}

export const Heatmap: React.FC<HeatmapProps> = ({ data = {} }) => {
  const endDate = new Date()
  const startDate = subDays(endDate, 365)

  const dates = eachDayOfInterval({ start: startDate, end: endDate })

  const columns: Date[][] = []
  for (let i = 0; i < dates.length; i += 7) {
    columns.push(dates.slice(i, i + 7))
  }

  const monthLabels: { index: number; label: string }[] = []
  let lastMonth = ""
  columns.forEach((week, i) => {
    const firstDay = week[0]
    const currentMonth = format(firstDay, "MMM")
    if (currentMonth !== lastMonth) {
      monthLabels.push({ index: i, label: currentMonth })
      lastMonth = currentMonth
    }
  })

  return (
    <div className="overflow-x-auto mb-8">
      <h2 className="text-white font-semibold text-sm mb-2">Submissions in the past year</h2>
      <div className="flex flex-col gap-1">
        <div className="relative flex">
          {monthLabels.map(({ index, label }) => (
            <div
              key={label + index}
              style={{ marginLeft: index * 18 }}
              className="absolute text-xs text-purple-400"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex gap-[4px] mt-5">
          {columns.map((week, i) => (
            <div key={i} className="flex flex-col gap-[4px]">
              {week.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd")
                const count = data[dateKey] || 0
                return (
                  <div
                    key={dateKey}
                    className={`w-4 h-4 border ${getColor(count)} rounded-none`}
                    title={`${dateKey}: ${count} submissions`}
                  ></div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}