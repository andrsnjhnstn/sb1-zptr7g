"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#ADFA1D", "#7FB616", "#527710", "#2C3F09", "#141F05"]

export function MaterialsChart({ data }) {
  const getMaterialsData = () => {
    const materials = new Map()

    data.product.parts.forEach(part => {
      if (part.materials) {
        part.materials.forEach(material => {
          const existing = materials.get(material.material) || 0
          materials.set(material.material, existing + material.percentage)
        })
      } else if (part.material) {
        const existing = materials.get(part.material) || 0
        materials.set(part.material, existing + 100)
      }
    })

    return Array.from(materials.entries()).map(([name, value]) => ({
      name,
      value
    }))
  }

  const chartData = getMaterialsData()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}