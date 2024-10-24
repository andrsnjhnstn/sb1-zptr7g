"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductAssembly({ data, onChange }) {
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
              <Label>Absolute Assembly Carbon Value (kg CO2e)</Label>
              <Input
                type="number"
                value={data.Assembly.AbsoluteValue.AbsoluteAssemblyCarbonValue}
                onChange={(e) => handleChange("Assembly.AbsoluteValue.AbsoluteAssemblyCarbonValue", Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </TabsContent>

          <TabsContent value="calculate" className="space-y-6">
            <div>
              <Label>Assembly Details</Label>
              <Textarea
                value={data.Assembly.Calculate.AssemblyDetails}
                onChange={(e) => handleChange("Assembly.Calculate.AssemblyDetails", e.target.value)}
                placeholder="Enter assembly process details"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label>Assembly Location</Label>
              <Input
                value={data.Assembly.Calculate.AssemblyLocation}
                onChange={(e) => handleChange("Assembly.Calculate.AssemblyLocation", e.target.value)}
                placeholder="Enter assembly location"
              />
            </div>

            <div>
              <Label>Emissions Factor Instructions</Label>
              <Textarea
                value={data.Assembly.Calculate.EmissionsFactorInstructions}
                onChange={(e) => handleChange("Assembly.Calculate.EmissionsFactorInstructions", e.target.value)}
                placeholder="Enter emissions factor calculation instructions"
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}