"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export function ProductBasicInfo({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            value={data.ProductName}
            onChange={(e) => handleChange("ProductName", e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="productId">Product ID</Label>
          <Input
            id="productId"
            value={data.ProductID}
            onChange={(e) => handleChange("ProductID", e.target.value)}
            placeholder="Enter product ID"
          />
        </div>
      </CardContent>
    </Card>
  )
}