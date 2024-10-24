"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProductReport({ data }) {
  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Name</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Shipping Method</TableHead>
            <TableHead>Emissions (kg CO2e)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.product.parts.map((part, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{part.name}</TableCell>
              <TableCell>{part.material}</TableCell>
              <TableCell>{part.weight_kg}</TableCell>
              <TableCell>{part.shipping?.method || "N/A"}</TableCell>
              <TableCell>{part.total_part_emissions_kgCO2e.toFixed(3)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium">Assembly</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{data.product.assembly.emissions_kgCO2e.toFixed(3)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollArea>
  )
}