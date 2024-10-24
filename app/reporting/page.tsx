"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaterialsChart } from "@/components/charts/materials-chart"
import { EmissionsChart } from "@/components/charts/emissions-chart"
import { ProductReport } from "@/components/product-report"
import { ChevronDown, ChevronUp, Download, Lightbulb, ArrowDownCircle } from "lucide-react"
import { generateHtmlReport } from "@/lib/report-generator"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ReportingPage() {
  const { toast } = useToast()
  const [jsonInput, setJsonInput] = useState("")
  const [reportData, setReportData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showInput, setShowInput] = useState(true)

  const handleJsonSubmit = () => {
    try {
      const data = JSON.parse(jsonInput)
      setReportData(data)
      setError(null)
      setShowInput(false)
    } catch (err) {
      setError("Invalid JSON format. Please check your input.")
      setReportData(null)
    }
  }

  const handleExportHtml = () => {
    if (!reportData) return

    try {
      const htmlContent = generateHtmlReport(reportData)
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${reportData.product.name.toLowerCase().replace(/\s+/g, "-")}-carbon-report.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "The HTML report has been downloaded."
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to generate HTML report. Please try again."
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Carbon Footprint Report Generator</CardTitle>
          <div className="flex gap-2">
            {reportData && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportHtml}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export HTML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInput(!showInput)}
                >
                  {showInput ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Hide Input
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show Input
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        {showInput && (
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your JSON data here..."
              className="min-h-[200px] font-mono"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleJsonSubmit}>Generate Report</Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        )}
      </Card>

      {reportData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Overview: {reportData.product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Emissions</p>
                  <p className="text-2xl font-bold">
                    {reportData.product.total_emissions_kgCO2e.toFixed(2)} kg CO2e
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Number of Parts</p>
                  <p className="text-2xl font-bold">{reportData.product.parts.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Assembly Location</p>
                  <p className="text-2xl font-bold">{reportData.product.assembly.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Materials Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <MaterialsChart data={reportData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emissions Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <EmissionsChart data={reportData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="parts" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="parts">Parts Analysis</TabsTrigger>
                  <TabsTrigger value="factors">Emissions Factors</TabsTrigger>
                  <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  <TabsTrigger value="conclusion">Conclusion</TabsTrigger>
                </TabsList>

                <TabsContent value="parts">
                  <ProductReport data={reportData} />
                </TabsContent>

                <TabsContent value="factors">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Value (kg CO2e/kg)</TableHead>
                          <TableHead>Source</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.values(reportData.emissions_factors).map((factor: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{factor.name}</TableCell>
                            <TableCell className="text-right">{factor.value_kgCO2e_per_kg.toFixed(3)}</TableCell>
                            <TableCell>{factor.source}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="opportunities">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-[#ADFA1D]" />
                          <CardTitle>Adjustment Opportunities</CardTitle>
                        </div>
                        <CardDescription>
                          Short-term improvements that can be implemented with minimal changes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {Object.values(reportData.adjustment_opportunities).map((value: string, index: number) => (
                              <div
                                key={index}
                                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                              >
                                <p className="text-sm text-muted-foreground leading-6">{value}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <ArrowDownCircle className="h-5 w-5 text-[#ADFA1D]" />
                          <CardTitle>Reduction Opportunities</CardTitle>
                        </div>
                        <CardDescription>
                          Long-term strategies for significant emissions reduction
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {Object.values(reportData.reduction_opportunities).map((value: string, index: number) => (
                              <div
                                key={index}
                                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                              >
                                <p className="text-sm text-muted-foreground leading-6">{value}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="conclusion">
                  <div className="rounded-md border p-4">
                    <p className="text-muted-foreground">{reportData.conclusion}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}