"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const recentProducts = [
  {
    id: "PROD-001",
    name: "Eco-Friendly Laptop",
    date: "2024-03-15",
    footprint: 245.6,
    status: "Completed",
  },
  {
    id: "PROD-002",
    name: "Solar Power Bank",
    date: "2024-03-14",
    footprint: 89.3,
    status: "In Progress",
  },
  {
    id: "PROD-003",
    name: "Recycled Smartphone",
    date: "2024-03-13",
    footprint: 156.8,
    status: "Completed",
  },
  {
    id: "PROD-004",
    name: "Smart Thermostat",
    date: "2024-03-12",
    footprint: 67.2,
    status: "Completed",
  },
]

export function RecentProducts() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead>Carbon Footprint</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.date}</TableCell>
            <TableCell>{product.footprint} kg CO2e</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  product.status === "Completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                }`}
              >
                {product.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}