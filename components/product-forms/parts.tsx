import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const transportModes = [
  "Road",
  "Rail",
  "Sea",
  "Air",
  "Multimodal"
]

const distanceUnits = [
  "kilometers",
  "miles",
  "nautical miles"
]

const MaterialForm = ({ index, prefix, title, part, onUpdate }) => {
  const material = part?.CarbonFootprint?.Calculate?.Material?.[prefix] || {
    MaterialType: "",
    MaterialWeight: "",
    Processing: "",
    EmissionsFactorInstructions: ""
  }
  
  const updateMaterial = (field, value) => {
    onUpdate(
      `CarbonFootprint.Calculate.Material.${prefix}.${field}`,
      value
    )
  }

  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Material Type</Label>
          <Input
            value={material.MaterialType}
            onChange={(e) => updateMaterial("MaterialType", e.target.value)}
            placeholder="Enter material type"
          />
        </div>
        <div>
          <Label>Material Weight (kg)</Label>
          <Input
            type="number"
            value={material.MaterialWeight}
            onChange={(e) => updateMaterial(
              "MaterialWeight",
              e.target.value === "" ? "" : Number(e.target.value)
            )}
            placeholder="0.00"
          />
        </div>
      </div>
      <div>
        <Label>Processing</Label>
        <Input
          value={material.Processing}
          onChange={(e) => updateMaterial("Processing", e.target.value)}
          placeholder="Enter processing details"
        />
      </div>
      <div>
        <Label>Emissions Factor Instructions</Label>
        <Textarea
          value={material.EmissionsFactorInstructions}
          onChange={(e) => updateMaterial("EmissionsFactorInstructions", e.target.value)}
          placeholder="Enter emissions factor instructions"
        />
      </div>
    </div>
  )
}

export function ProductParts({ data, onChange }) {
  const updatePart = (index, updates) => {
    const updatedParts = [...(data.Parts || [])]
    updatedParts[index] = {
      ...updatedParts[index],
      ...updates
    }
    onChange({
      ...data,
      Parts: updatedParts
    })
  }

  const updateNestedPart = (index, path, value) => {
    const updatedParts = [...(data.Parts || [])]
    const part = { ...updatedParts[index] }
    
    const fields = path.split('.')
    let current = part
    
    for (let i = 0; i < fields.length - 1; i++) {
      if (!current[fields[i]]) {
        current[fields[i]] = {}
      }
      current = current[fields[i]] = { ...current[fields[i]] }
    }
    
    current[fields[fields.length - 1]] = value
    updatedParts[index] = part
    
    onChange({
      ...data,
      Parts: updatedParts
    })
  }

  const addPart = () => {
    const newPart = {
      PartName: "",
      PartID: "",
      Supplier: {
        SupplierName: "",
        SupplierID: "",
        SupplierLocation: ""
      },
      CarbonFootprint: {
        Absolute: {
          AbsolutePartCarbonValue: ""
        },
        Calculate: {
          Material: {
            PrimaryMaterial: {
              MaterialType: "",
              MaterialWeight: "",
              Processing: "",
              EmissionsFactorInstructions: ""
            },
            SecondaryMaterial: {
              MaterialType: "",
              MaterialWeight: "",
              Processing: "",
              EmissionsFactorInstructions: ""
            }
          },
          Manufacturing: {
            Process: "",
            EmissionsFactorInstructions: ""
          },
          Shipping: {
            Origin: "",
            Destination: "",
            ModeOfTransport: "",
            Distance: "",
            DistanceUnit: "",
            EmissionsFactorInstructions: ""
          }
        }
      }
    }
    onChange({
      ...data,
      Parts: [...(data.Parts || []), newPart]
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parts</CardTitle>
        <Button onClick={addPart}>Add Part</Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {(data.Parts || []).map((part, index) => (
            <AccordionItem key={index} value={`part-${index}`}>
              <AccordionTrigger>
                {part.PartName || `Part ${index + 1}`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Part Name</Label>
                      <Input
                        value={part.PartName || ""}
                        onChange={(e) => updatePart(index, { PartName: e.target.value })}
                        placeholder="Enter part name"
                      />
                    </div>
                    <div>
                      <Label>Part ID</Label>
                      <Input
                        value={part.PartID || ""}
                        onChange={(e) => updatePart(index, { PartID: e.target.value })}
                        placeholder="Enter part ID"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Supplier Information</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Supplier Name"
                        value={part.Supplier?.SupplierName || ""}
                        onChange={(e) => updateNestedPart(index, "Supplier.SupplierName", e.target.value)}
                      />
                      <Input
                        placeholder="Supplier ID"
                        value={part.Supplier?.SupplierID || ""}
                        onChange={(e) => updateNestedPart(index, "Supplier.SupplierID", e.target.value)}
                      />
                      <Input
                        placeholder="Location"
                        value={part.Supplier?.SupplierLocation || ""}
                        onChange={(e) => updateNestedPart(index, "Supplier.SupplierLocation", e.target.value)}
                      />
                    </div>
                  </div>

                  <Tabs defaultValue="absolute" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="absolute">Absolute Value</TabsTrigger>
                      <TabsTrigger value="calculate">Calculate</TabsTrigger>
                    </TabsList>

                    <TabsContent value="absolute" className="space-y-4">
                      <div>
                        <Label>Absolute Carbon Value (kg CO2e)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={part.CarbonFootprint?.Absolute?.AbsolutePartCarbonValue || ""}
                          onChange={(e) => updateNestedPart(
                            index,
                            "CarbonFootprint.Absolute.AbsolutePartCarbonValue",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="calculate" className="space-y-6">
                      <div className="space-y-6">
                        <MaterialForm
                          index={index}
                          prefix="PrimaryMaterial"
                          title="Primary Material"
                          part={part}
                          onUpdate={(path, value) => updateNestedPart(index, path, value)}
                        />
                        <MaterialForm
                          index={index}
                          prefix="SecondaryMaterial"
                          title="Secondary Material"
                          part={part}
                          onUpdate={(path, value) => updateNestedPart(index, path, value)}
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Manufacturing</Label>
                        <div>
                          <Label>Process</Label>
                          <Input
                            value={part.CarbonFootprint?.Calculate?.Manufacturing?.Process || ""}
                            onChange={(e) => updateNestedPart(
                              index,
                              "CarbonFootprint.Calculate.Manufacturing.Process",
                              e.target.value
                            )}
                            placeholder="Enter manufacturing process"
                          />
                        </div>
                        <div>
                          <Label>Emissions Factor Instructions</Label>
                          <Textarea
                            value={part.CarbonFootprint?.Calculate?.Manufacturing?.EmissionsFactorInstructions || ""}
                            onChange={(e) => updateNestedPart(
                              index,
                              "CarbonFootprint.Calculate.Manufacturing.EmissionsFactorInstructions",
                              e.target.value
                            )}
                            placeholder="Enter emissions factor instructions"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Shipping</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Origin</Label>
                            <Input
                              value={part.CarbonFootprint?.Calculate?.Shipping?.Origin || ""}
                              onChange={(e) => updateNestedPart(
                                index,
                                "CarbonFootprint.Calculate.Shipping.Origin",
                                e.target.value
                              )}
                              placeholder="Enter origin"
                            />
                          </div>
                          <div>
                            <Label>Destination</Label>
                            <Input
                              value={part.CarbonFootprint?.Calculate?.Shipping?.Destination || ""}
                              onChange={(e) => updateNestedPart(
                                index,
                                "CarbonFootprint.Calculate.Shipping.Destination",
                                e.target.value
                              )}
                              placeholder="Enter destination"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Mode of Transport</Label>
                            <Select
                              value={part.CarbonFootprint?.Calculate?.Shipping?.ModeOfTransport || ""}
                              onValueChange={(value) => updateNestedPart(
                                index,
                                "CarbonFootprint.Calculate.Shipping.ModeOfTransport",
                                value
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select transport mode" />
                              </SelectTrigger>
                              <SelectContent>
                                {transportModes.map((mode) => (
                                  <SelectItem key={mode} value={mode}>
                                    {mode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Distance Unit</Label>
                            <Select
                              value={part.CarbonFootprint?.Calculate?.Shipping?.DistanceUnit || ""}
                              onValueChange={(value) => updateNestedPart(
                                index,
                                "CarbonFootprint.Calculate.Shipping.DistanceUnit",
                                value
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {distanceUnits.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Distance</Label>
                          <Input
                            type="number"
                            value={part.CarbonFootprint?.Calculate?.Shipping?.Distance || ""}
                            onChange={(e) => updateNestedPart(
                              index,
                              "CarbonFootprint.Calculate.Shipping.Distance",
                              e.target.value === "" ? "" : Number(e.target.value)
                            )}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label>Emissions Factor Instructions</Label>
                          <Textarea
                            value={part.CarbonFootprint?.Calculate?.Shipping?.EmissionsFactorInstructions || ""}
                            onChange={(e) => updateNestedPart(
                              index,
                              "CarbonFootprint.Calculate.Shipping.EmissionsFactorInstructions",
                              e.target.value
                            )}
                            placeholder="Enter emissions factor instructions"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}