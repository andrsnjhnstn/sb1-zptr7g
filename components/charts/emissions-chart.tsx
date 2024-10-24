"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function EmissionsChart({ data }) {
  const getEmissionsData = () => {
    const parts = data.product.parts.map(part => ({
      name: part.name,
      emissions: part.total_part_emissions_kgCO2e
    }))

    parts.push({
      name: "Assembly",
      emissions: data.product.assembly.emissions_kgCO2e
    })

    return parts
  }

  const chartData = getEmissionsData()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "kg CO2e", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Bar dataKey="emissions" fill="#ADFA1D" />
      </BarChart>
    </ResponsiveContainer>
  )
}