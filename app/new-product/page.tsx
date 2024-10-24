"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductBasicInfo } from "@/components/product-forms/basic-info"
import { ProductParts } from "@/components/product-forms/parts"
import { ProductAssembly } from "@/components/product-forms/assembly"
import { ProductPackaging } from "@/components/product-forms/packaging"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useWebhook } from "@/hooks"
import { useProductStore } from "@/lib/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NewProductPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { sendWebhook } = useWebhook()
  const addProduct = useProductStore((state) => state.addProduct)
  const [showJson, setShowJson] = useState(false)
  const [submittedData, setSubmittedData] = useState<string>("")
  const [formData, setFormData] = useState({
    ProductName: "",
    ProductID: "",
    Parts: [],
    Assembly: {
      AbsoluteValue: { AbsoluteAssemblyCarbonValue: 0 },
      Calculate: {
        AssemblyDetails: "",
        AssemblyLocation: "",
        EmissionsFactorInstructions: ""
      }
    },
    Packaging: {
      AbsoluteValue: { AbsolutePackagingCarbonValue: 0 },
      Calculate: {
        PrimaryPackagingMaterial: {
          MaterialType: "",
          MaterialWeight: 0,
          Processing: "",
          EmissionsFactorInstructions: ""
        },
        SecondaryPackagingMaterial: {
          MaterialType: "",
          MaterialWeight: 0,
          Processing: "",
          EmissionsFactorInstructions: ""
        }
      }
    }
  })

  const handleSubmit = async () => {
    try {
      if (!formData.ProductName || !formData.ProductID) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Product Name and ID are required"
        })
        return
      }

      const payload = {
        ProductName: formData.ProductName,
        ProductID: formData.ProductID,
        Parts: formData.Parts.map(part => ({
          PartName: part.PartName,
          PartID: part.PartID,
          Supplier: {
            SupplierName: part.Supplier.SupplierName,
            SupplierID: part.Supplier.SupplierID,
            SupplierLocation: part.Supplier.SupplierLocation
          },
          CarbonFootprint: {
            Absolute: {
              AbsolutePartCarbonValue: part.CarbonFootprint.Absolute.AbsolutePartCarbonValue
            },
            Calculate: {
              Material: {
                PrimaryMaterial: {
                  MaterialType: part.CarbonFootprint.Calculate.Material.PrimaryMaterial.MaterialType,
                  MaterialWeight: part.CarbonFootprint.Calculate.Material.PrimaryMaterial.MaterialWeight,
                  Processing: part.CarbonFootprint.Calculate.Material.PrimaryMaterial.Processing,
                  EmissionsFactorInstructions: part.CarbonFootprint.Calculate.Material.PrimaryMaterial.EmissionsFactorInstructions
                },
                SecondaryMaterial: {
                  MaterialType: part.CarbonFootprint.Calculate.Material.SecondaryMaterial.MaterialType,
                  MaterialWeight: part.CarbonFootprint.Calculate.Material.SecondaryMaterial.MaterialWeight,
                  Processing: part.CarbonFootprint.Calculate.Material.SecondaryMaterial.Processing,
                  EmissionsFactorInstructions: part.CarbonFootprint.Calculate.Material.SecondaryMaterial.EmissionsFactorInstructions
                }
              },
              Manufacturing: {
                Process: part.CarbonFootprint.Calculate.Manufacturing.Process,
                EmissionsFactorInstructions: part.CarbonFootprint.Calculate.Manufacturing.EmissionsFactorInstructions
              },
              Shipping: {
                Origin: part.CarbonFootprint.Calculate.Shipping.Origin,
                Destination: part.CarbonFootprint.Calculate.Shipping.Destination,
                ModeOfTransport: part.CarbonFootprint.Calculate.Shipping.ModeOfTransport,
                Distance: part.CarbonFootprint.Calculate.Shipping.Distance,
                DistanceUnit: part.CarbonFootprint.Calculate.Shipping.DistanceUnit,
                EmissionsFactorInstructions: part.CarbonFootprint.Calculate.Shipping.EmissionsFactorInstructions
              }
            }
          }
        })),
        Assembly: {
          AbsoluteValue: {
            AbsoluteAssemblyCarbonValue: formData.Assembly.AbsoluteValue.AbsoluteAssemblyCarbonValue
          },
          Calculate: {
            AssemblyDetails: formData.Assembly.Calculate.AssemblyDetails,
            AssemblyLocation: formData.Assembly.Calculate.AssemblyLocation,
            EmissionsFactorInstructions: formData.Assembly.Calculate.EmissionsFactorInstructions
          }
        },
        Packaging: {
          AbsoluteValue: {
            AbsolutePackagingCarbonValue: formData.Packaging.AbsoluteValue.AbsolutePackagingCarbonValue
          },
          Calculate: {
            PrimaryPackagingMaterial: {
              MaterialType: formData.Packaging.Calculate.PrimaryPackagingMaterial.MaterialType,
              MaterialWeight: formData.Packaging.Calculate.PrimaryPackagingMaterial.MaterialWeight,
              Processing: formData.Packaging.Calculate.PrimaryPackagingMaterial.Processing,
              EmissionsFactorInstructions: formData.Packaging.Calculate.PrimaryPackagingMaterial.EmissionsFactorInstructions
            },
            SecondaryPackagingMaterial: {
              MaterialType: formData.Packaging.Calculate.SecondaryPackagingMaterial.MaterialType,
              MaterialWeight: formData.Packaging.Calculate.SecondaryPackagingMaterial.MaterialWeight,
              Processing: formData.Packaging.Calculate.SecondaryPackagingMaterial.Processing,
              EmissionsFactorInstructions: formData.Packaging.Calculate.SecondaryPackagingMaterial.EmissionsFactorInstructions
            }
          }
        }
      }

      // Add to product store
      addProduct(payload)

      // Send to webhook
      await sendWebhook(payload)

      // Show JSON data
      setSubmittedData(JSON.stringify(payload, null, 2))
      setShowJson(true)

      toast({
        title: "Assessment Submitted",
        description: "The product carbon footprint assessment has been saved successfully."
      })

      // Navigate to product list after 2 seconds
      setTimeout(() => {
        router.push('/products')
      }, 2000)

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit the assessment. Please try again."
      })
      console.error('Submission error:', error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>New Product Carbon Footprint Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              <TabsTrigger value="assembly">Assembly</TabsTrigger>
              <TabsTrigger value="packaging">Packaging</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <ProductBasicInfo 
                data={formData} 
                onChange={(data) => setFormData(data)} 
              />
            </TabsContent>
            <TabsContent value="parts">
              <ProductParts 
                data={formData} 
                onChange={(data) => setFormData(data)} 
              />
            </TabsContent>
            <TabsContent value="assembly">
              <ProductAssembly 
                data={formData} 
                onChange={(data) => setFormData(data)} 
              />
            </TabsContent>
            <TabsContent value="packaging">
              <ProductPackaging 
                data={formData} 
                onChange={(data) => setFormData(data)} 
              />
            </TabsContent>
          </Tabs>
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleSubmit}>Submit Assessment</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showJson} onOpenChange={setShowJson}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Assessment Data (JSON)</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[60vh]">
            <pre className="p-4 bg-muted rounded-lg overflow-auto">
              <code>{submittedData}</code>
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}