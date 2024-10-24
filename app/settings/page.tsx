"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useWebhook } from "@/hooks/use-webhook"
import { Settings, Loader2, AlertCircle, Eye, EyeOff, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const { toast } = useToast()
  const { testWebhook, isLoading: isWebhookLoading, validateUrl, defaultWebhookUrl } = useWebhook()
  const [webhookUrl, setWebhookUrl] = useState<string>("")
  const [webhookToken, setWebhookToken] = useState<string>("")
  const [showToken, setShowToken] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)

  useEffect(() => {
    try {
      const savedUrl = localStorage.getItem("webhookUrl") || defaultWebhookUrl
      const savedToken = localStorage.getItem("webhookToken")
      if (savedUrl && validateUrl(savedUrl)) {
        setWebhookUrl(savedUrl)
      }
      if (savedToken) {
        setWebhookToken(savedToken)
      }
    } catch (error) {
      console.warn('Failed to load saved webhook settings:', error)
    }
  }, [validateUrl, defaultWebhookUrl])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)

      if (!webhookUrl) {
        throw new Error('Webhook URL is required')
      }

      if (!validateUrl(webhookUrl)) {
        throw new Error('Please enter a valid webhook URL')
      }

      localStorage.setItem("webhookUrl", webhookUrl)
      localStorage.setItem("webhookToken", webhookToken)

      toast({
        title: "Settings Saved",
        description: "Webhook settings have been saved successfully"
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save settings'
      setError({
        title: 'Save Failed',
        message
      })
      toast({
        variant: "destructive",
        title: "Error",
        description: message
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    try {
      setError(null)

      if (!webhookUrl) {
        throw new Error('Please enter a webhook URL first')
      }

      if (!validateUrl(webhookUrl)) {
        throw new Error('Please enter a valid webhook URL')
      }

      const result = await testWebhook(webhookUrl, webhookToken)

      if (result.success) {
        toast({
          title: "Test Successful",
          description: `Webhook responded with status ${result.statusCode}`
        })
      } else {
        throw new Error(result.details || result.message)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to test webhook'
      setError({
        title: 'Test Failed',
        message
      })
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: message
      })
    }
  }

  const handleClear = () => {
    try {
      setWebhookUrl("")
      setWebhookToken("")
      localStorage.removeItem("webhookUrl")
      localStorage.removeItem("webhookToken")
      setError(null)
      toast({
        title: "Settings Cleared",
        description: "Webhook settings have been cleared successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear settings"
      })
    }
  }

  const isDisabled = isSaving || isWebhookLoading

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#ADFA1D]" />
            <CardTitle>Settings</CardTitle>
          </div>
          <CardDescription>
            Configure your application settings and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Webhook Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Configure a webhook endpoint to receive assessment data when submitted
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{error.title}</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder={defaultWebhookUrl}
                    value={webhookUrl}
                    onChange={(e) => {
                      setWebhookUrl(e.target.value)
                      setError(null)
                    }}
                    disabled={isDisabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookToken">API Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhookToken"
                      type={showToken ? "text" : "password"}
                      placeholder="Enter your API token"
                      value={webhookToken}
                      onChange={(e) => {
                        setWebhookToken(e.target.value)
                        setError(null)
                      }}
                      disabled={isDisabled}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowToken(!showToken)}
                      type="button"
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The API token will be included in the Authorization header
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave}
                  disabled={isDisabled}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTest}
                  disabled={!webhookUrl || isDisabled}
                >
                  {isWebhookLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Test Webhook
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClear}
                  disabled={isDisabled || (!webhookUrl && !webhookToken)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}