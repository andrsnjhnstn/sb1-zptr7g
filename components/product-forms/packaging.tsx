"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductPackaging({ data, onChange }) {
  const handleChange = (field, value) => {
    const newData = { ...data }
    const fields = field.split(".")
    let current = newData
    
    for (let i = 0; i < fields.length - 1; i++) {
      current = current[fields[i]]
    }
    current[fields[fields.length - 1]] = value
    
    onChange(newData)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="absolute" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="absolute">Absolute Value</TabsTrigger>
            <TabsTrigger value="calculate">Calculate</TabsTrigger>
          </TabsList>

          <TabsContent value="absolute" className="space-y-4">
            <div>
              <Label>Absolute Packaging Carbon Value (kg CO2e)</Label>
              <Input
                type="number"
                value={data.Packaging.AbsoluteValue.AbsolutePackagingCarbonValue}
                onChange={(e) => handleChange("Packaging.AbsoluteValue.AbsolutePackagingCarbonValue", Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </TabsContent>

          <TabsContent value="calculate" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Primary Packaging Material</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Material Type</Label>
                    <Input
                      value={data.Packaging.Calculate.PrimaryPackagingMaterial.MaterialType}
                      onChange={(e) => handleChange("Packaging.Calculate.PrimaryPackagingMaterial.MaterialType", e.target.value)}
                      placeholder="Enter material type"
                    />
                  </div>
                  <div>
                    <Label>Material Weight (kg)</Label>
                    <Input
                      type="number"
                      value={data.Packaging.Calculate.PrimaryPackagingMaterial.MaterialWeight}
                      onChange={(e) => handleChange("Packaging.Calculate.PrimaryPackagingMaterial.MaterialWeight", Number(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Processing</Label>
                  <Input
                    value={data.Packaging.Calculate.PrimaryPackagingMaterial.Processing}
                    onChange={(e) => handleChange("Packaging.Calculate.PrimaryPackagingMaterial.Processing", e.target.value)}
                    placeholder="Enter processing details"
                  />
                </div>
                <div>
                  <Label>Emissions Factor Instructions</Label>
                  <Textarea
                    value={data.Packaging.Calculate.PrimaryPackagingMaterial.EmissionsFactorInstructions}
                    onChange={(e) => handleChange("Packaging.Calculate.PrimaryPackagingMaterial.EmissionsFactorInstructions", e.target.value)}
                    placeholder="Enter emissions factor instructions"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Secondary Packaging Material</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Material Type</Label>
                    <Input
                      value={data.Packaging.Calculate.SecondaryPackagingMaterial.MaterialType}
                      onChange={(e) => handleChange("Packaging.Calculate.SecondaryPackagingMaterial.MaterialType", e.target.value)}
                      placeholder="Enter material type"
                    />
                  </div>
                  <div>
                    <Label>Material Weight (kg)</Label>
                    <Input
                      type="number"
                      value={data.Packaging.Calculate.SecondaryPackagingMaterial.MaterialWeight}
                      onChange={(e) => handleChange("Packaging.Calculate.SecondaryPackagingMaterial.MaterialWeight", Number(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Processing</Label>
                  <Input
                    value={data.Packaging.Calculate.SecondaryPackagingMaterial.Processing}
                    onChange={(e) => handleChange("Packaging.Calculate.SecondaryPackagingMaterial.Processing", e.target.value)}
                    placeholder="Enter processing details"
                  />
                </div>
                <div>
                  <Label>Emissions Factor Instructions</Label>
                  <Textarea
                    value={data.Packaging.Calculate.SecondaryPackagingMaterial.EmissionsFactorInstructions}
                    onChange={(e) => handleChange("Packaging.Calculate.SecondaryPackagingMaterial.EmissionsFactorInstructions", e.target.value)}
                    placeholder="Enter emissions factor instructions"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}