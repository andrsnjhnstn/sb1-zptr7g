"use client"

import { useProductStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Check, Copy, Eye, FileJson, Plus } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const { toast } = useToast()
  const products = useProductStore((state) => state.products)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showJson, setShowJson] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleViewJson = (product: any) => {
    setSelectedProduct(product)
    setShowJson(true)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(selectedProduct, null, 2))
      setCopied(true)
      toast({
        title: "Copied",
        description: "JSON data copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Carbon Footprint Assessments</CardTitle>
          <Link href="/new-product">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Parts Count</TableHead>
                  <TableHead>Assembly Carbon</TableHead>
                  <TableHead>Packaging Carbon</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.ProductName}</TableCell>
                    <TableCell>{product.ProductID}</TableCell>
                    <TableCell>{product.Parts?.length || 0}</TableCell>
                    <TableCell>
                      {product.Assembly?.AbsoluteValue?.AbsoluteAssemblyCarbonValue || 0} kg CO2e
                    </TableCell>
                    <TableCell>
                      {product.Packaging?.AbsoluteValue?.AbsolutePackagingCarbonValue || 0} kg CO2e
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewJson(product)}
                      >
                        <FileJson className="w-4 h-4" />
                      </Button>
                      <Link href={`/products/${product.ProductID}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No assessments found. Create your first assessment.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={showJson} onOpenChange={setShowJson}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Assessment Data (JSON)</DialogTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="h-8 w-8"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[60vh]">
            <pre className="p-4 bg-muted rounded-lg overflow-auto">
              <code>{JSON.stringify(selectedProduct, null, 2)}</code>
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}