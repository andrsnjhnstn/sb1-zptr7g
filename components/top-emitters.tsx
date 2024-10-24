"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Product A",
    total: 1200,
  },
  {
    name: "Product B",
    total: 900,
  },
  {
    name: "Product C",
    total: 700,
  },
  {
    name: "Product D",
    total: 500,
  },
  {
    name: "Product E",
    total: 300,
  },
]

export function TopEmitters() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}kg`}
        />
        <Bar
          dataKey="total"
          fill="#ADFA1D"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}