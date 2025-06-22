"use client"

import React from "react"
import {
  eachDayOfInterval,
  format,
  subDays,
} from "date-fns"

interface HeatmapProps {
  data?: Record<string, number>
}

const getColor = (count: number) => {
    if (count === 0) return "bg-gray-1000 border-gray-800"
    if (count < 3) return "bg-gradient-to-br from-green-300 to-green-100 border-green-200"
    if (count < 6) return "bg-gradient-to-br from-green-600 to-green-400 border-green-500"
    return "bg-gradient-to-br from-green-900 to-green-700 border-green-800"
  }
  

export const Heatmap: React.FC<HeatmapProps> = ({ data = {} }) => {
  const today = new Date()
  const startDate = subDays(today, 365)
  const allDates = eachDayOfInterval({ start: startDate, end: today })

  // Group by month
  const months: { label: string; days: Date[] }[] = []
  let currentMonth = ""
  let currentDays: Date[] = []

  allDates.forEach((day, i) => {
    const monthLabel = format(day, "MMMM")
    if (monthLabel !== currentMonth) {
      if (currentDays.length > 0) {
        months.push({ label: currentMonth, days: currentDays })
      }
      currentMonth = monthLabel
      currentDays = [day]
    } else {
      currentDays.push(day)
    }

    if (i === allDates.length - 1) {
      months.push({ label: currentMonth, days: currentDays })
    }
  })

  return (
    <div className="overflow-x-auto mb-8 pb-4">

      <div className="flex items-end gap-2">
        {months.map((month, i) => {
          const first28 = month.days.slice(0, 28)
          const overflow = month.days.slice(28)

          // 28 days → 4 columns × 7 rows
          const columns: Date[][] = [[], [], [], []]
          for (let j = 0; j < first28.length; j++) {
            columns[j % 4].push(first28[j])
          }

          // Add overflow as a 5th column (only if exists)
          if (overflow.length > 0) {
            columns.push(overflow)
          }

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              {/* Month Grid */}
              <div className="flex gap-[2px]">
                {columns.map((col, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-[2px]">
                    {col.map((date) => {
                      const dateKey = format(date, "yyyy-MM-dd")
                      const count = data[dateKey] || 0
                      return (
                        <div
                          key={dateKey}
                          className={`w-4 h-4 border ${getColor(count)}`}
                          title={`${dateKey}: ${count} submissions`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Month label */}
              <div className="text-xs text-purple-400 mt-1">{month.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

